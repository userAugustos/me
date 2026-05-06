import en from './en.json'
import pt from './pt.json'

export type Locale = 'en' | 'pt'

type Messages = typeof en

interface MessageTree {
  [key: string]: string | MessageTree
}
type Primitive = string | number

type Join<K extends string, P extends string> = `${K}.${P}`
type MessageKey<T> = {
  [K in keyof T & string]:
    T[K] extends string
      ? K
      : T[K] extends MessageTree
        ? Join<K, MessageKey<T[K]>>
        : never
}[keyof T & string]

const STORAGE_KEY = 'locale'
const DEFAULT_LOCALE: Locale = 'en'
const dictionaries: Record<Locale, Messages> = { en, pt }
const listeners = new Set<() => void>()

let currentLocale: Locale = detectInitialLocale()

function readStoredLocale(): Locale | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return isLocale(value) ? value : null
  } catch {
    return null
  }
}

function detectBrowserLocale(): Locale {
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  return readStoredLocale() ?? detectBrowserLocale()
}

function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* storage unavailable */
  }
}

function applyDocumentLanguage(): void {
  document.documentElement.lang = intlLocaleFor(currentLocale)
}

function resolveMessage(tree: MessageTree, key: string): string | null {
  const value = key.split('.').reduce<string | MessageTree | undefined>((current, part) => {
    if (!current || typeof current === 'string') return undefined
    return current[part]
  }, tree)

  return typeof value === 'string' ? value : null
}

function interpolate(template: string, params?: Record<string, Primitive>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token]
    return value === undefined ? `{${token}}` : String(value)
  })
}

function elementsMatching(root: ParentNode, selector: string): HTMLElement[] {
  const elements = Array.from(root.querySelectorAll<HTMLElement>(selector))
  if (root instanceof HTMLElement && root.matches(selector)) {
    elements.unshift(root)
  }
  return elements
}

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'pt'
}

export function getLocale(): Locale {
  return currentLocale
}

export function intlLocaleFor(locale: Locale = currentLocale): string {
  return locale === 'pt' ? 'pt-BR' : 'en-US'
}

export function initializeI18n(): void {
  applyDocumentLanguage()
}

export function setLocale(locale: Locale): void {
  if (locale === currentLocale) return
  currentLocale = locale
  persistLocale(locale)
  applyDocumentLanguage()
  listeners.forEach(listener => {
    listener()
  })
}

export function subscribeToLocale(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function t(key: MessageKey<Messages>, params?: Record<string, Primitive>): string {
  const current = resolveMessage(dictionaries[currentLocale] as MessageTree, key)
  const fallback = resolveMessage(dictionaries[DEFAULT_LOCALE] as MessageTree, key)
  const value = current ?? fallback

  if (value === null) {
    console.warn(`i18n: missing key '${key}'`)
    return key
  }

  return interpolate(value, params)
}

export function translateFragment(root: ParentNode): void {
  elementsMatching(root, '[data-i18n]').forEach(element => {
    const key = element.dataset.i18n
    if (!key) return
    element.textContent = t(key as MessageKey<Messages>)
  })

  elementsMatching(root, '[data-i18n-aria-label]').forEach(element => {
    const key = element.dataset.i18nAriaLabel
    if (!key) return
    element.setAttribute('aria-label', t(key as MessageKey<Messages>))
  })
}
