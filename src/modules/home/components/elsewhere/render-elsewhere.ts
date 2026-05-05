import type { ElsewhereLink } from './items'

function linkHTML(link: ElsewhereLink): string {
  return `
    <li class="border-b border-rule-soft">
      <a href="${link.href}" target="_blank" rel="noreferrer" class="group flex items-center justify-between gap-3 py-2 text-sm text-ink no-underline transition-colors duration-300 hover:text-accent">
        <span class="min-w-0 text-pretty">${link.label}</span>
        <span aria-hidden="true" class="shrink-0 font-mono text-xs text-ink-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent">→</span>
      </a>
    </li>
  `
}

export function renderElsewhere(root: HTMLElement, links: ElsewhereLink[]): void {
  root.innerHTML = `<ul class="m-0 list-none p-0">${links.map(linkHTML).join('')}</ul>`
}
