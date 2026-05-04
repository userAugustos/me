import type { ElsewhereLink } from './items'

function linkHTML(link: ElsewhereLink): string {
  return `
    <a href="${link.href}" class="group flex justify-between items-center py-2 border-b border-rule-soft text-[13px] text-ink transition-[padding] duration-300 ease-[cubic-bezier(.7,0,.2,1)] hover:pl-2">
      <span>${link.label}</span>
      <span class="font-mono text-ink-3 text-[12px] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent">→</span>
    </a>
  `
}

export function renderElsewhere(root: HTMLElement, links: ElsewhereLink[]): void {
  root.innerHTML = links.map(linkHTML).join('')
}
