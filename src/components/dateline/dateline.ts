import { intlLocaleFor } from '../../i18n'

function formatDateline(date: Date): string {
  return new Intl.DateTimeFormat(intlLocaleFor(), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function writeDateline(target: HTMLElement, date: Date = new Date()): void {
  target.textContent = formatDateline(date)
}
