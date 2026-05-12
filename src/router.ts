import { renderHome } from './modules/home/home';
import { renderPost } from './modules/post/post';

const PARAM_PATTERN_STR = '$';
const root = document.querySelector<HTMLDivElement>('#app');

type Cleanup = () => void;

interface Route {
  pattern: string;
  params: string[];
  render: (root: HTMLElement, params: Record<string, string>) => void | Cleanup;
}

const routes: Route[] = [
  {
    pattern: '/',
    params: [],
    render: root => renderHome(root),
  },
  {
    pattern: '/posts/$postId',
    params: ['postId'],
    render: (root, params) => renderPost(root, params),
  },
];

export function matchPath(
  url: string,
  pattern: string,
): null | Record<string, string> {
  const urlArr = url.split('/');
  const patternArr = pattern.split('/');
  const params: Record<string, string> = {};

  if (urlArr.length !== patternArr.length) {
    return null;
  }

  for (let i = 0; i < urlArr.length; i++) {
    if (patternArr[i].startsWith(PARAM_PATTERN_STR)) {
      // we know it's supossed to be a param
      params[patternArr[i].slice(1)] = urlArr[i];
      continue;
    }
    if (urlArr[i] !== patternArr[i]) {
      return null;
    }
  }

  return params;
}

// This update the DOM
function handleRouteChange(pathname: string) {
  console.debug(pathname);
  // accessing root = closure
  if (!root) {
    throw new Error('Router setup: #app element not found in DOM');
  }

  for (const route of routes) {
    const routeParams = matchPath(pathname, route.pattern);
    if (routeParams) {
      return route.render(root, routeParams);
    }
  }

  root.innerHTML = `<p>404</p>`;

  return;
}

window.addEventListener('popstate', () => handleRouteChange(location.pathname));
handleRouteChange(window.location.pathname);

document.addEventListener('click', event => {
  // 1. Achar o <a> mais próximo do clique (event delegation)
  const target = event.target as Element;
  if (!target) return;

  const link = target.closest('a');
  if (!link) return;

  // if it's external link
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.origin !== location.origin) return;
  if (link.target === '_blank') return;
  if (link.download) return;

  event.preventDefault();
  history.pushState({}, '', link.href);
  handleRouteChange(link.pathname);
});
