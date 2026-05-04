type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* storage unavailable */
  }
}

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  persistTheme(theme)
}

function syncButton(button: HTMLElement, theme: Theme): void {
  button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false')
  button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
  button.dataset.theme = theme
}

export function attachThemeToggle(button: HTMLElement): void {
  syncButton(button, currentTheme())

  button.addEventListener('click', () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    syncButton(button, next)
  })

  if (readStoredTheme() === null) {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', (event) => {
      if (readStoredTheme() !== null) return
      const next: Theme = event.matches ? 'dark' : 'light'
      document.documentElement.dataset.theme = next
      syncButton(button, next)
    })
  }
}
