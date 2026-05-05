import type { TickerItem } from './items'

const SPAN_CLASS =
  "inline-flex items-center gap-2 before:content-['•'] before:text-ink-4"

const EMPHASIS_CLASS = 'font-serif normal-case text-ink not-italic'

function emphasisHTML(emphasis: NonNullable<TickerItem['emphasis']>): string {
  if (emphasis.href) {
    return `<a href="${emphasis.href}" class="${EMPHASIS_CLASS}">${emphasis.title}</a>`
  }
  return `<em class="${EMPHASIS_CLASS}">${emphasis.title}</em>`
}

function itemHTML(item: TickerItem): string {
  if (!item.emphasis) {
    return `<li class="${SPAN_CLASS}">${item.text}</li>`
  }
  return `<li class="${SPAN_CLASS}">${item.text} ${emphasisHTML(item.emphasis)}</li>`
}

function listHTML(items: TickerItem[], hidden: boolean): string {
  const aria = hidden ? ' aria-hidden="true"' : ''
  return `<ul class="m-0 flex shrink-0 list-none items-center gap-10 p-0"${aria}>${items.map(itemHTML).join('')}</ul>`
}

export function renderTicker(root: HTMLElement, items: TickerItem[]): void {
  const main = listHTML(items, false)
  const loop = listHTML(items, true)
  root.innerHTML = main + loop
}
