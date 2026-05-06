import { intlLocaleFor, subscribeToLocale, t } from '../../../../i18n'
import { loadLatestDeployCommitDate } from './load'

const SECOND_MS = 1000
const MINUTE_MS = 60 * SECOND_MS
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS
const WEEK_MS = 7 * DAY_MS
const MONTH_MS = 30 * DAY_MS
const YEAR_MS = 365 * DAY_MS

function formatRelativeTime(isoDate: string): string {
  const diffMs = new Date(isoDate).getTime() - Date.now()
  const formatter = new Intl.RelativeTimeFormat(intlLocaleFor(), {
    numeric: 'auto',
  })

  if (Math.abs(diffMs) >= YEAR_MS) {
    return formatter.format(Math.round(diffMs / YEAR_MS), 'year')
  }

  if (Math.abs(diffMs) >= MONTH_MS) {
    return formatter.format(Math.round(diffMs / MONTH_MS), 'month')
  }

  if (Math.abs(diffMs) >= WEEK_MS) {
    return formatter.format(Math.round(diffMs / WEEK_MS), 'week')
  }

  if (Math.abs(diffMs) >= DAY_MS) {
    return formatter.format(Math.round(diffMs / DAY_MS), 'day')
  }

  if (Math.abs(diffMs) >= HOUR_MS) {
    return formatter.format(Math.round(diffMs / HOUR_MS), 'hour')
  }

  if (Math.abs(diffMs) >= MINUTE_MS) {
    return formatter.format(Math.round(diffMs / MINUTE_MS), 'minute')
  }

  return formatter.format(Math.round(diffMs / SECOND_MS), 'second')
}

export function mountDeployStatus(root: HTMLElement): () => void {
  let disposed = false
  let latestCommitDate: string | null = null

  const render = (): void => {
    root.textContent = latestCommitDate
      ? t('home.footerDeploy', { timeAgo: formatRelativeTime(latestCommitDate) })
      : t('home.footerDeployLoading')
  }

  render()

  const localeCleanup = subscribeToLocale(render)

  void loadLatestDeployCommitDate()
    .then((date) => {
      if (disposed) return
      latestCommitDate = date
      root.textContent = date
        ? t('home.footerDeploy', { timeAgo: formatRelativeTime(date) })
        : t('home.footerDeployFallback')
    })
    .catch(() => {
      if (disposed) return
      root.textContent = t('home.footerDeployFallback')
    })

  return () => {
    disposed = true
    localeCleanup()
  }
}
