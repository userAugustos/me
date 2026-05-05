import type { FeedItem, FeedKind } from './types'

type FilterKind = FeedKind | 'all'

interface FilterDef {
  kind: FilterKind
  label: string
}

const FILTER_DEFS: FilterDef[] = [
  { kind: 'all', label: 'All' },
  { kind: 'essay', label: 'Essays' },
  { kind: 'repo', label: 'Repos' },
  { kind: 'talk', label: 'Talks' },
  { kind: 'post', label: 'Posts' },
  { kind: 'note', label: 'Notes' },
]

const BUTTON_CLASS =
  'appearance-none bg-transparent border-0 font-sans text-[13px] cursor-pointer px-3 py-1.5 rounded-full transition-colors duration-300 text-ink-3 hover:text-ink aria-pressed:bg-ink aria-pressed:text-paper'

const COUNT_CLASS = 'font-mono text-[10px] text-ink-4 ml-1.5'

function countItems(items: FeedItem[], kind: FilterKind): number {
  if (kind === 'all') return items.length
  return items.filter((item) => item.kind === kind).length
}

function buttonHTML(def: FilterDef, count: number, active: boolean): string {
  return `<button data-filter="${def.kind}" aria-pressed="${active}" class="${BUTTON_CLASS}">${def.label} <span class="${COUNT_CLASS}">${count}</span></button>`
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
