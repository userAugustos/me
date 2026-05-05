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
    .map((tag) => `<span class="px-2 py-0.5 border border-rule rounded-[2px] bg-paper">${tag}</span>`)
    .join('')
}

export function renderGeneratedPost(root: HTMLElement, post: GeneratedPost): void {
  document.title = `${post.title} — Felipe Augustos`
  root.innerHTML = `
    <article class="pt-10 max-w-190">
      <a href="${withBasePath('/')}" data-home-link class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 no-underline transition-colors duration-300 hover:text-accent mb-9">← Field notes</a>

      <header class="border-b-2 border-ink pb-7 mb-8">
        <div class="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3 mb-3">
          <span class="text-accent">${post.kind}</span>
          <span class="mx-2 text-ink-4">/</span>
          <span>${formatDate(post.date)}</span>
          <span class="mx-2 text-ink-4">/</span>
          <span>${post.meta}</span>
        </div>
        <h1 class="font-serif font-normal text-[clamp(36px,6vw,72px)] leading-[0.98] tracking-[-0.035em] text-ink m-0 max-w-13ch" style="font-variation-settings: 'opsz' 60">${post.title}</h1>
        <div class="flex flex-wrap gap-1.5 font-mono text-[10.5px] text-ink-3 mt-6">${tagsHTML(post.tags)}</div>
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
    <article class="pt-10 max-w-190 animate-pulse">
      <div class="h-3 w-30 bg-rule-soft rounded-[2px] mb-9"></div>
      <div class="border-b-2 border-ink pb-7 mb-8">
        <div class="h-3 w-62 bg-rule-soft rounded-[2px] mb-4"></div>
        <div class="h-16 w-4/5 bg-rule-soft rounded-[2px] mb-3"></div>
        <div class="h-16 w-3/5 bg-rule-soft rounded-[2px]"></div>
      </div>
      <div class="flex flex-col gap-3">
        <div class="h-4 w-full bg-rule-soft rounded-[2px]"></div>
        <div class="h-4 w-11/12 bg-rule-soft rounded-[2px]"></div>
        <div class="h-4 w-2/3 bg-rule-soft rounded-[2px]"></div>
      </div>
    </article>
  `
}

export function renderPostError(root: HTMLElement, retry: () => void): void {
  root.innerHTML = `
    <div class="py-16 max-w-160 font-mono text-[12px] text-ink-3">
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
