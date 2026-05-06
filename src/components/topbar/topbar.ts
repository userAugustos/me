import template from './topbar.html?raw'
import { writeDateline } from '../dateline/dateline'
import { attachThemeToggle, syncThemeToggle } from '../theme-toggle/theme-toggle'
import { loadWeather } from '../weather/weather'
import { getLocale, isLocale, setLocale, subscribeToLocale, translateFragment } from '../../i18n'
import { GITHUB_AVATAR_URL, PROFILE_NAME } from '../../lib/profile'

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
  const localeSwitch = pick(root, '[data-locale-switch]')
  const themeToggle = pick(root, '[data-theme-toggle]')
  const dateline = pick(root, '[data-dateline]')
  const weather = pick(root, '[data-weather]')
  const profileAvatar = pick<HTMLImageElement>(root, '[data-profile-avatar]')

  attachLanguageToggle(localeSwitch)
  attachThemeToggle(themeToggle)
  profileAvatar.src = GITHUB_AVATAR_URL
  profileAvatar.alt = PROFILE_NAME

  const render = (): void => {
    translateFragment(root)
    syncLanguageToggle(localeSwitch)
    syncThemeToggle(themeToggle)
    writeDateline(dateline)
    void loadWeather(weather)
  }

  render()
  subscribeToLocale(render)
}

function syncLanguageToggle(root: HTMLElement): void {
  const locale = getLocale()
  root.querySelectorAll<HTMLButtonElement>('button[data-locale-option]').forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset.localeOption === locale ? 'true' : 'false')
  })
}

function attachLanguageToggle(root: HTMLElement): void {
  root.querySelectorAll<HTMLButtonElement>('button[data-locale-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const locale = button.dataset.localeOption
      if (isLocale(locale)) setLocale(locale)
    })
  })
}
