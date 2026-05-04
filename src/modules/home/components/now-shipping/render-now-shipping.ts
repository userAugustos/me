import type { ShippingItem } from './items'

function rowHTML(item: ShippingItem): string {
  return `
    <div class="flex items-start gap-3 text-[13px] leading-[1.4]">
      <div class="w-7 h-7 border border-rule rounded grid place-items-center shrink-0 bg-paper-2 text-ink-2">
        ${item.icon}
      </div>
      <div>
        <strong class="block font-medium text-ink text-[13px]">${item.name}</strong>
        <div class="font-mono text-[10.5px] text-ink-3 uppercase tracking-[0.06em] mt-0.5">${item.status}</div>
      </div>
    </div>
  `
}

export function renderNowShipping(root: HTMLElement, items: ShippingItem[]): void {
  root.innerHTML = items.map(rowHTML).join('')
}
