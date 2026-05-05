import type { ShippingItem } from './items'

function rowHTML(item: ShippingItem): string {
  return `
    <li>
      <article class="flex items-start gap-3 text-sm leading-6">
        <div class="flex size-8 shrink-0 items-center justify-center rounded-md border border-rule bg-paper-2 text-ink-2">
          ${item.icon}
        </div>
        <div class="min-w-0">
          <h3 class="m-0 text-sm font-medium leading-6 text-ink text-pretty">${item.name}</h3>
          <p class="mt-1 font-mono text-xs uppercase tracking-wider text-ink-3">${item.status}</p>
        </div>
      </article>
    </li>
  `
}

export function renderNowShipping(root: HTMLElement, items: ShippingItem[]): void {
  root.innerHTML = `<ul class="m-0 flex list-none flex-col gap-3 p-0">${items.map(rowHTML).join('')}</ul>`
}
