---
slug: how-SPA-routers-works
title: 'How SPA routers work'
kind: essay
date: 2026-04-30
meta: 12 min read
image_url: /assets/router-bg.png
tags:
  - router
  - javascript
  - essay
---

<!-- preview:start -->

The browser was built for documents. When you click a link, it fetches a new page. Modern SPAs work around, the piece of code responsible for that is the router.

I built a small one from scratch to understand what Next.js, TanStack Router, and React Router are actually doing underneath.

<!-- preview:end -->

My favorite lib on 2025 was Tanstack Router and Tanstack Query, it changed the project I was working on, and I was always looking into the code, and thinking "Could I code a router at this level?", well I don't know, but I can say I know how it works.

![Routing pipeline](/assets/router-bg.png)

### A router has six jobs:

1. **Normalize** the URL — strip trailing slashes, handle base paths, ignore query strings and hashes during matching
2. **Parse** route patterns — turn `/posts/$postId` into something you can compare against
3. **Match** the URL against those patterns
4. **Extract params** — pull `postId` out of `/posts/42`
5. **Resolve** the matched route — call the right render function
6. **Generate URLs back** — turn `{ postId: '42' }` back into `/posts/42` for programmatic navigation

Steps 1–4 are the visible part. Steps 5 and 6 are where the interesting decisions live.

## The routing pipeline

A raw URL enters the system and passes through several transforms before anything gets rendered:

![Routing pipeline](/assets/routing_pipeline.svg)

Normalization and separation happen silently. The matching and rendering steps are where you actually write code.

## How URLs change in the browser

There are three distinct ways the URL can change while you're on a page, and they behave completely differently:

**User clicks a link.** The browser's default behavior is to request a new document — a full page reload. The SPA has to stop this.

**User presses back or forward.** The browser pops an entry from the history stack. No page load happens, but the URL changes and the browser fires a `popstate` event.

**JavaScript navigates.** `history.pushState(state, '', '/new-path')` changes the URL without triggering a page load and without firing `popstate`. It's purely a write — you have to read the new URL yourself and update the view.

Three cases, three handlers. Miss one and some navigations silently break.

## Defining a route

A route needs a pattern to match against, and a render function to call when it matches:

```ts
interface Route {
  pattern: string;
  params: string[];
  render: (root: HTMLElement, params: Record<string, string>) => void | Cleanup;
}
```

The `render` function returns an optional cleanup — a callback the router calls when navigating away, to stop subscriptions, cancel requests, or unmount things cleanly.

The routes are just an array:

```ts
const routes: Route[] = [
  { pattern: '/', params: [], render: root => renderHome(root) },
  {
    pattern: '/posts/$postId',
    params: ['postId'],
    render: (root, params) => renderPost(root, params),
  },
];
```

The `$` prefix marks a segment as a parameter placeholder — a convention you pick and enforce yourself.

## Matching a URL to a pattern

Given a URL and a pattern: does this URL match, and if so, what are the params?

```ts
function matchPath(
  url: string,
  pattern: string,
): null | Record<string, string> {
  const urlArr = url.split('/');
  const patternArr = pattern.split('/');
  const params: Record<string, string> = {};

  if (urlArr.length !== patternArr.length) return null;

  for (let i = 0; i < urlArr.length; i++) {
    if (patternArr[i].startsWith('$')) {
      params[patternArr[i].slice(1)] = urlArr[i];
      continue;
    }
    if (urlArr[i] !== patternArr[i]) return null;
  }

  return params;
}
```

Split both strings on `/` into segment arrays, compare segment by segment. If a pattern segment starts with `$`, it's a parameter — capture the corresponding URL segment. If it's a literal that doesn't match, return `null`. If every segment passes, return the params object.

```ts
matchPath('/posts/42', '/posts/$postId'); // → { postId: '42' }
matchPath('/posts/new', '/posts/new'); // → {}
matchPath('/posts/42', '/'); // → null (different segment count)
```

The length check is what rejects `/posts/42` against `/` — they split into arrays of different sizes, no regex needed.

## Building URLs from params

Going the other direction — turning a pattern and params back into a URL — matters for programmatic navigation and for generating `href` values:

```ts
function buildPath(to: string, params: Record<string, string>): string {
  return to
    .split('/')
    .map(segment =>
      segment.startsWith('$') ? params[segment.slice(1)] : segment,
    )
    .join('/');
}

buildPath('/posts/$postId', { postId: '42' }); // → '/posts/42'
```

You could also do it with a single replace:

```ts
function buildPathWithReplace(
  to: string,
  params: Record<string, string>,
): string {
  return to.replace(/\$\w+/g, match => params[match.slice(1)]);
}
```

Same result. The `split/map/join` makes each step explicit; the regex is more compact. But I personally, don't choose to work with regex unless it's really better than the alternative.

## Handling route changes

When the URL changes — for any of those three reasons — one function does the work:

```ts
function handleRouteChange(pathname: string) {
  for (const route of routes) {
    const routeParams = matchPath(pathname, route.pattern);
    if (routeParams) return route.render(root, routeParams);
  }
  root.innerHTML = `<p>404</p>`;
}
```

Walk the routes, try each pattern, call the first that matches. If nothing matches, render a 404. The `root` variable is a closure — captured when the module loaded, pointing to `#app` in the DOM.

## The click interceptor and `closest()`

Intercepting link clicks means stopping the browser before it acts. The naive approach attaches a listener to every `<a>` tag. The better approach is **event delegation**: one listener on `document`, figure out what was clicked from there.

This works because of how DOM events bubble. When you click anywhere on the page, the `click` event fires on the exact element clicked and then travels up through every parent — the `<span>` inside the link, the link itself, `<nav>`, `<body>`, up to `document`. A listener at the top catches it all.

The problem is that `event.target` gives you the exact element clicked — could be a `<span>`, an `<img>`, a text node. You need the nearest ancestor `<a>`, if one exists.

That's what `element.closest(selector)` does. It walks up the DOM from the element, checks each ancestor against the CSS selector, returns the first match — or `null`. It checks the element itself too, so clicking directly on the `<a>` works fine.

```ts
document.addEventListener('click', event => {
  const link = (event.target as Element).closest('a');
  if (!link) return;

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.origin !== location.origin) return;
  if (link.target === '_blank') return;
  if (link.download) return;

  event.preventDefault();
  history.pushState({}, '', link.href);
  handleRouteChange(link.pathname);
});
```

Each guard handles a real case:

- **Modifier keys** — `Cmd+Click` on Mac opens a link in a new tab. Intercepting that breaks it.
- **External links** — `link.origin !== location.origin` catches anything pointing to a different domain.
- **`target="_blank"`** — these are meant to open in a new tab; leave them alone.
- **`download`** — download links shouldn't trigger navigation.

## Reacting to back/forward

`popstate` fires whenever the browser moves through history — back button, forward button, `history.back()`. At that point the URL has already changed; you just read it and update the view:

```ts
window.addEventListener('popstate', () => handleRouteChange(location.pathname));
```

`popstate` does **not** fire when you call `history.pushState()` yourself. It only fires for browser-driven history changes. That's why the click handler calls `handleRouteChange` explicitly after `pushState` — the event won't do it.

## The initial render

When the page first loads there's no navigation event. The URL is just there. So `handleRouteChange` runs once at startup with the current pathname:

```ts
handleRouteChange(window.location.pathname);
```

Without this, anyone who links directly to `/posts/42` gets a blank page.

## How production routers differ

The mechanics above are the same ones production libraries use. What changes is scale and ergonomics.

**Trees instead of arrays.** A flat array works fine with a handful of routes. TanStack Router and React Router build a route tree instead. The tree enables nested layouts — a `/dashboard` shell that wraps every `/dashboard/*` route — and you can know which routes are active at multiple levels at once. A trie also makes matching faster as the route table grows, since you stop exploring branches that can't possibly match.

**They don't intercept clicks globally.** Next.js and TanStack don't put a `click` listener on `document`. They give you a `<Link>` component that renders a normal `<a>` tag but replaces the default click behavior with a controlled handler. HTML behavior is preserved by default; the router only takes over when you use `<Link>`. The global interception approach is useful for understanding event delegation and `closest()`, but it's more aggressive than you'd want in production — you're overriding behavior that the browser otherwise handles correctly.

**Loaders and guards.** Production routers separate data fetching from rendering. You define a `loader` function on the route, the router calls it before rendering, and the component receives already-resolved data.

**Type safety.** TanStack Router generates types from your route definitions, so wrong param names are a compile error rather than a runtime blank screen.

Next.js, TanStack Router, React Router — variations on this same skeleton. They add loaders, nested layouts, code splitting, type safety. The fundamental mechanics are the same.
