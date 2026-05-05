import { withBasePath } from '../../lib/base-path'
import { handleNavigate } from '../../lib/navigation'
import type { GeneratedPost } from './types'

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatDate(isoDate: string): string {
  return DATE_FORMATTER.format(new Date(`${isoDate}T00:00:00Z`))
}

function tagsHTML(tags: string[]): string {
  return tags
    .map((tag) => `<li><span class="inline-flex rounded-sm border border-rule bg-paper px-2 py-1">${tag}</span></li>`)
    .join('')
}

export function renderGeneratedPost(root: HTMLElement, post: GeneratedPost): void {
  document.title = `${post.title} — Felipe Augustos`
  root.innerHTML = `
    <article class="max-w-3xl pt-10">
      <a href="${withBasePath('/')}" data-home-link class="mb-9 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-3 no-underline transition-colors duration-300 hover:text-accent">← Field notes</a>

      <header class="mb-8 border-b-2 border-ink pb-7">
        <p class="mb-3 font-mono text-xs uppercase tracking-widest text-ink-3">
          <span class="text-accent">${post.kind}</span>
          <span class="mx-2 text-ink-4">/</span>
          <span>${formatDate(post.date)}</span>
          <span class="mx-2 text-ink-4">/</span>
          <span>${post.meta}</span>
        </p>
        <h1 class="m-0 max-w-3xl font-serif text-4xl font-normal tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl" style="font-variation-settings: 'opsz' 60">${post.title}</h1>
        <ul class="mt-6 flex list-none flex-wrap gap-2 p-0 font-mono text-xs text-ink-3">${tagsHTML(post.tags)}</ul>
      </header>

      <div class="post-content">${post.html}</div>
    </article>
  `

  root.querySelector<HTMLAnchorElement>('[data-home-link]')?.addEventListener('click', (event) => {
    handleNavigate(event, '/')
  })
}

export function renderPostSkeleton(root: HTMLElement): void {
  root.innerHTML = `
    <article class="max-w-3xl animate-pulse pt-10">
      <div class="mb-9 h-3 w-32 rounded-sm bg-rule-soft"></div>
      <div class="mb-8 border-b-2 border-ink pb-7">
        <div class="mb-4 h-3 w-48 rounded-sm bg-rule-soft"></div>
        <div class="mb-3 h-14 w-4/5 rounded-sm bg-rule-soft"></div>
        <div class="h-14 w-3/5 rounded-sm bg-rule-soft"></div>
      </div>
      <div class="flex flex-col gap-3">
        <div class="h-4 w-full rounded-sm bg-rule-soft"></div>
        <div class="h-4 w-11/12 rounded-sm bg-rule-soft"></div>
        <div class="h-4 w-2/3 rounded-sm bg-rule-soft"></div>
      </div>
    </article>
  `
}

export function renderPostError(root: HTMLElement, retry: () => void): void {
  root.innerHTML = `
    <div class="max-w-2xl py-16 font-mono text-sm text-ink-3">
      Couldn't load this post.
      <button type="button" data-retry class="ml-2 underline text-ink hover:text-accent cursor-pointer">Retry</button>
      <a href="${withBasePath('/')}" data-home-link class="ml-4 underline text-ink hover:text-accent">Back home</a>
    </div>
  `
  const button = root.querySelector<HTMLButtonElement>('[data-retry]')
  button?.addEventListener('click', retry)
  root.querySelector<HTMLAnchorElement>('[data-home-link]')?.addEventListener('click', (event) => {
    handleNavigate(event, '/')
  })
}
