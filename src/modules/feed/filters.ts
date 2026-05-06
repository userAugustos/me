import { t } from '../../i18n'
import type { FeedItem, FeedKind } from './types'

type FilterKind = FeedKind | 'all'

interface FilterDef {
  kind: FilterKind
  labelKey: 'feed.filters.all' | 'feed.filters.essay' | 'feed.filters.repo' | 'feed.filters.talk' | 'feed.filters.post' | 'feed.filters.note'
}

const FILTER_DEFS: FilterDef[] = [
  { kind: 'all', labelKey: 'feed.filters.all' },
  { kind: 'essay', labelKey: 'feed.filters.essay' },
  { kind: 'repo', labelKey: 'feed.filters.repo' },
  { kind: 'talk', labelKey: 'feed.filters.talk' },
  { kind: 'post', labelKey: 'feed.filters.post' },
  { kind: 'note', labelKey: 'feed.filters.note' },
]

const BUTTON_CLASS =
  'min-h-10 appearance-none rounded-full border border-transparent bg-transparent px-4 py-2 font-sans text-sm text-ink-3 transition-[color,background-color,transform] duration-300 hover:text-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper active:scale-[0.96] cursor-pointer'

const COUNT_CLASS = 'ml-1.5 font-mono text-xs text-current/70 tabular-nums'

function countItems(items: FeedItem[], kind: FilterKind): number {
  if (kind === 'all') return items.length
  return items.filter((item) => item.kind === kind).length
}

function buttonHTML(def: FilterDef, count: number, active: boolean): string {
  return `<button type="button" data-filter="${def.kind}" aria-pressed="${active}" class="${BUTTON_CLASS}">${t(def.labelKey)} <span class="${COUNT_CLASS}">${count}</span></button>`
}

function showItem(item: HTMLElement, index: number): void {
  item.classList.remove('is-hidden')
  item.style.transitionDelay = `${index * 0.04}s`
  item.style.opacity = '0'
  item.style.transform = 'translateY(8px)'
  requestAnimationFrame(() => {
    item.style.opacity = '1'
    item.style.transform = 'translateY(0)'
  })
}

function hideItem(item: HTMLElement): void {
  item.classList.add('is-hidden')
}

function applyFilter(items: NodeListOf<HTMLElement>, filter: string): void {
  items.forEach((item, index) => {
    const match = filter === 'all' || item.dataset.kind === filter
    if (match) showItem(item, index)
    else hideItem(item)
  })
}

function setActive(buttons: NodeListOf<HTMLButtonElement>, active: HTMLButtonElement): void {
  buttons.forEach((btn) => {
    btn.setAttribute('aria-pressed', btn === active ? 'true' : 'false')
  })
}

export function mountFilters(host: HTMLElement, feedRoot: HTMLElement, items: FeedItem[]): void {
  host.innerHTML = FILTER_DEFS.map((def, index) =>
    buttonHTML(def, countItems(items, def.kind), index === 0),
  ).join('')

  const buttons = host.querySelectorAll<HTMLButtonElement>('button[data-filter]')

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter ?? 'all'
      setActive(buttons, button)
      applyFilter(feedRoot.querySelectorAll<HTMLElement>('.feed-item'), filter)
    })
  })
}
