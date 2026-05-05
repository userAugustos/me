import { withBasePath } from '../../lib/base-path'
import { handleNavigate } from '../../lib/navigation'
import type { FeedItem } from './types'

const ARROW_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6 18L18 6M9 6h9v9"/></svg>`

function stamp(item: FeedItem): string {
  return `
    <div class="font-mono text-[10.5px] text-ink-3 tracking-[0.04em] leading-[1.5] pt-1">
      <span class="block text-ink text-[12px]">${item.date.day} ${item.date.mo}</span>
      <span class="text-ink-4">'${item.date.year}</span>
    </div>
  `
}

function row1(item: FeedItem): string {
  return `
    <div class="flex items-center gap-2.5 mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-3">
      <span class="text-accent font-medium">${item.kind}</span>
      <span class="w-3.5 h-px bg-ink-4"></span>
      <span>${item.meta}</span>
    </div>
  `
}

function tags(item: FeedItem): string {
  const cells = item.tags
    .map((t) => `<span class="px-2 py-0.5 border border-rule rounded-[2px] bg-paper">${t}</span>`)
    .join('')
  return `<div class="flex flex-wrap gap-1.5 font-mono text-[10.5px] text-ink-3">${cells}</div>`
}

function titleBlock(item: FeedItem): string {
  if (item.kind === 'note') {
    return `
      <h3 class="font-sans font-medium text-[17px] tracking-[-0.005em] m-0 mb-2 text-ink transition-colors duration-300 group-hover:text-accent">${item.title}</h3>
      <div class="feed-preview font-sans text-[14px] leading-[1.55] text-ink-2 mb-3 max-w-[62ch] [text-wrap:pretty]">${item.previewHtml}</div>
    `
  }
  return `
    <h3 class="font-serif font-normal text-[26px] leading-[1.18] tracking-[-0.012em] m-0 mb-2 text-ink transition-colors duration-300 group-hover:text-accent" style="font-variation-settings: 'opsz' 28">${item.title}</h3>
    <div class="feed-preview font-serif text-[16px] leading-[1.55] text-ink-2 mb-3 max-w-[62ch] [text-wrap:pretty]" style="font-variation-settings: 'opsz' 16">${item.previewHtml}</div>
  `
}

function arrow(): string {
  return `
    <div class="self-center w-9 h-9 rounded-full border border-rule grid place-items-center text-ink-3 transition-[transform,border-color,color,background] duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-rotate-45 group-hover:border-ink group-hover:text-ink group-hover:bg-paper max-tablet:hidden">
      ${ARROW_SVG}
    </div>
  `
}

function articleHTML(item: FeedItem): string {
  return `
    <a href="${withBasePath(item.href)}" class="grid grid-cols-[92px_1fr_auto] gap-7 py-6 no-underline text-inherit max-tablet:grid-cols-[70px_1fr]">
      ${stamp(item)}
      <div class="min-w-0">
        ${row1(item)}
        ${titleBlock(item)}
        ${tags(item)}
      </div>
      ${arrow()}
    </a>
  `
}

export function renderFeed(root: HTMLElement, feed: FeedItem[]): void {
  root.innerHTML = ''

  feed.forEach((item, index) => {
    const article = document.createElement('article')
    article.className =
      'feed-item group relative cursor-pointer border-b border-rule-soft'
    article.dataset.kind = item.kind
    article.style.opacity = '0'
    article.style.transform = 'translateY(12px)'
    article.style.transition =
      'opacity 0.8s cubic-bezier(.2,.7,.2,1), transform 0.8s cubic-bezier(.2,.7,.2,1)'
    article.style.transitionDelay = `${0.78 + index * 0.06}s`
    article.innerHTML = articleHTML(item)
    article.querySelector<HTMLAnchorElement>('a')?.addEventListener('click', (event) => {
      handleNavigate(event, item.href)
    })
    root.appendChild(article)
  })

  requestAnimationFrame(() => {
    root.querySelectorAll<HTMLElement>('.feed-item').forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  })
}

function skeletonArticleHTML(): string {
  return `
    <div class="pt-1">
      <div class="h-3 w-12 bg-rule-soft rounded-[2px] mb-1.5"></div>
      <div class="h-2 w-8 bg-rule-soft rounded-[2px] opacity-60"></div>
    </div>
    <div class="min-w-0 flex flex-col gap-2.5">
      <div class="h-2.5 w-40 bg-rule-soft rounded-[2px]"></div>
      <div class="h-6 w-3/4 bg-rule-soft rounded-[2px]"></div>
      <div class="h-3 w-full bg-rule-soft rounded-[2px] opacity-60"></div>
      <div class="h-3 w-2/3 bg-rule-soft rounded-[2px] opacity-60"></div>
    </div>
    <div class="self-center w-9 h-9 rounded-full border border-rule max-tablet:hidden"></div>
  `
}

export function renderFeedSkeleton(root: HTMLElement, count = 4): void {
  root.innerHTML = ''
  for (let i = 0; i < count; i++) {
    const article = document.createElement('article')
    article.className =
      'grid grid-cols-[92px_1fr_auto] gap-7 border-b border-rule-soft py-6 max-tablet:grid-cols-[70px_1fr] animate-pulse'
    article.innerHTML = skeletonArticleHTML()
    root.appendChild(article)
  }
}

export function renderFeedError(root: HTMLElement, retry: () => void): void {
  root.innerHTML = `
    <div class="py-10 text-center font-mono text-[12px] text-ink-3">
      Couldn't load posts.
      <button type="button" data-retry class="ml-2 underline text-ink hover:text-accent cursor-pointer">Retry</button>
    </div>
  `
  const button = root.querySelector<HTMLButtonElement>('[data-retry]')
  button?.addEventListener('click', retry)
}
