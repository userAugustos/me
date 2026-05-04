import template from './topbar.html?raw'
import { writeDateline } from '../dateline/dateline'
import { attachThemeToggle } from '../theme-toggle/theme-toggle'
import { loadWeather } from '../weather/weather'

function pick<T extends HTMLElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector)
  if (!element) throw new Error(`topbar: missing element matching '${selector}'`)
  return element
}

function buildRoot(): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = template.trim()
  const root = wrapper.firstElementChild
  if (!(root instanceof HTMLElement)) throw new Error('topbar: template has no root element')
  return root
}

export function mountTopbar(placeholder: HTMLElement): void {
  const root = buildRoot()
  placeholder.replaceWith(root)
  writeDateline(pick(root, '[data-dateline]'))
  attachThemeToggle(pick(root, '[data-theme-toggle]'))
  void loadWeather(pick(root, '[data-weather]'))
}
