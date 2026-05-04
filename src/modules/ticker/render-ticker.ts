import type { TickerItem } from './items'

const SPAN_CLASS =
  "inline-flex items-center gap-2 before:content-['◆'] before:text-ink-4 before:text-[7px]"

const EMPHASIS_CLASS = 'font-serif normal-case text-ink not-italic'

function emphasisHTML(emphasis: NonNullable<TickerItem['emphasis']>): string {
  if (emphasis.href) {
    return `<a href="${emphasis.href}" class="${EMPHASIS_CLASS}">${emphasis.title}</a>`
  }
  return `<em class="${EMPHASIS_CLASS}">${emphasis.title}</em>`
}

function itemHTML(item: TickerItem, hidden: boolean): string {
  const aria = hidden ? ' aria-hidden="true"' : ''
  if (!item.emphasis) {
    return `<span class="${SPAN_CLASS}"${aria}>${item.text}</span>`
  }
  return `<span class="${SPAN_CLASS}"${aria}>${item.text} ${emphasisHTML(item.emphasis)}</span>`
}

export function renderTicker(root: HTMLElement, items: TickerItem[]): void {
  const main = items.map((item) => itemHTML(item, false)).join('')
  const loop = items.map((item) => itemHTML(item, true)).join('')
  root.innerHTML = main + loop
}
