import { intlLocaleFor, t } from '../../i18n';
import { withBasePath } from '../../lib/base-path';
import { handleNavigate } from '../../lib/navigation';
import type { FeedItem } from './types';

const ARROW_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6 18L18 6M9 6h9v9"/></svg>`;
const LOADING_GIF_SRC = encodeURI(
  withBasePath('/assets/Super Mario Spinning Sticker by GIPHY Gaming.gif'),
);

function stampParts(isoDate: string): { day: string; month: string; year: string } {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const locale = intlLocaleFor();

  return {
    day: new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      timeZone: 'UTC',
    }).format(date),
    month: new Intl.DateTimeFormat(locale, {
      month: 'short',
      timeZone: 'UTC',
    }).format(date),
    year: new Intl.DateTimeFormat(locale, {
      year: '2-digit',
      timeZone: 'UTC',
    }).format(date),
  };
}

function stamp(item: FeedItem): string {
  const parts = stampParts(item.date);
  return `
    <time datetime="${item.date}" class="block pt-1 font-mono text-xs leading-5 tracking-wide text-ink-3 tabular-nums sm:w-20 sm:flex-none">
      <span class="block text-sm text-ink">${parts.day} ${parts.month}</span>
      <span class="text-ink-4">'${parts.year}</span>
    </time>
  `;
}

function row1(item: FeedItem): string {
  return `
    <p class="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-3">
      <span class="text-accent font-medium">${t(`feed.kinds.${item.kind}`)}</span>
      <span class="h-px w-3 bg-ink-4"></span>
      <span>${item.meta}</span>
    </p>
  `;
}

function tags(item: FeedItem): string {
  const cells = item.tags
    .map(
      t =>
        `<li><span class="inline-flex rounded-sm border border-rule bg-paper px-2 py-1">${t}</span></li>`,
    )
    .join('');
  return `<ul class="m-0 flex list-none flex-wrap gap-2 p-0 font-mono text-xs text-ink-3">${cells}</ul>`;
}

function titleBlock(item: FeedItem): string {
  if (item.kind === 'note') {
    return `
      <h3 class="m-0 mb-2 font-sans text-lg font-medium tracking-tight text-ink text-balance transition-colors duration-300 group-hover:text-accent">${item.title}</h3>
      <div class="feed-preview mb-3 max-w-3xl font-sans text-sm leading-6 text-ink-2 text-pretty">${item.previewHtml}</div>
    `;
  }
  return `
    <h3 class="m-0 mb-2 font-serif text-2xl font-normal leading-tight tracking-tight text-ink text-balance transition-colors duration-300 group-hover:text-accent sm:text-3xl" style="font-variation-settings: 'opsz' 28">${item.title}</h3>
    <div class="feed-preview mb-3 max-w-3xl font-serif text-base leading-7 text-ink-2 text-pretty" style="font-variation-settings: 'opsz' 16">${item.previewHtml}</div>
  `;
}

function arrow(): string {
  return `
    <div class="hidden size-10 shrink-0 place-items-center self-center rounded-full border border-rule text-ink-3 transition-[transform,border-color,color,background-color] duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-rotate-45 group-hover:border-ink group-hover:bg-paper group-hover:text-ink sm:grid">
      ${ARROW_SVG}
    </div>
  `;
}

function articleHTML(item: FeedItem): string {
  return `
    <a href="${withBasePath(item.href)}" class="flex flex-col gap-4 py-6 text-inherit no-underline sm:flex-row sm:items-start sm:gap-6">
      ${stamp(item)}
      <div class="min-w-0 flex-1">
        ${row1(item)}
        ${titleBlock(item)}
        ${tags(item)}
      </div>
      ${arrow()}
    </a>
  `;
}

export function renderFeed(root: HTMLElement, feed: FeedItem[]): void {
  root.innerHTML = '';

  feed.forEach((item, index) => {
    const article = document.createElement('article');
    article.className =
      'feed-item group relative cursor-pointer border-b border-rule-soft';
    article.dataset.kind = item.kind;
    article.style.opacity = '0';
    article.style.transform = 'translateY(12px)';
    article.style.transition =
      'opacity 0.8s cubic-bezier(.2,.7,.2,1), transform 0.8s cubic-bezier(.2,.7,.2,1)';
    article.style.transitionDelay = `${0.78 + index * 0.06}s`;
    article.innerHTML = articleHTML(item);
    article
      .querySelector<HTMLAnchorElement>('a')
      ?.addEventListener('click', event => {
        handleNavigate(event, item.href);
      });
    root.appendChild(article);
  });

  requestAnimationFrame(() => {
    root.querySelectorAll<HTMLElement>('.feed-item').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
}

export function renderFeedSkeleton(root: HTMLElement): void {
  root.innerHTML = `
    <div class="flex h-96 flex-col items-center justify-center gap-3 py-8" role="status" aria-live="polite" aria-label="${t('common.loading')}">
      <img src="${LOADING_GIF_SRC}" alt="" class="size-25 max-w-full object-contain [image-rendering:pixelated]" />
      <p class="m-0 font-mono text-xs uppercase tracking-widest text-ink-3">${t('common.loadingPosts')}</p>
    </div>
  `;
}

export function renderFeedError(root: HTMLElement, retry: () => void): void {
  root.innerHTML = `
    <div class="py-10 text-center font-mono text-sm text-ink-3">
      ${t('feed.errors.load')}
      <button type="button" data-retry class="ml-2 underline text-ink hover:text-accent cursor-pointer">${t('common.retry')}</button>
    </div>
  `;
  const button = root.querySelector<HTMLButtonElement>('[data-retry]');
  button?.addEventListener('click', retry);
}
