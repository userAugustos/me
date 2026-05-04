import type { Endpoints } from '@octokit/types'
import { GITHUB_USERNAME } from '../../config'
import { octokit } from '../../lib/github'
import type { CommitChartData } from './types'

const WINDOW_DAYS = 30
const MS_PER_DAY = 24 * 60 * 60 * 1000

type GhEvent = Endpoints['GET /users/{username}/events/public']['response']['data'][number]

const labelFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  timeZone: 'UTC',
})

function startOfUTCDay(ms: number): number {
  const date = new Date(ms)
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function formatLabel(ms: number): string {
  return labelFormatter.format(new Date(ms))
}

function aggregate(events: GhEvent[]): CommitChartData {
  const todayUTC = startOfUTCDay(Date.now())
  const startUTC = todayUTC - (WINDOW_DAYS - 1) * MS_PER_DAY
  const counts: number[] = new Array(WINDOW_DAYS).fill(0)

  for (const event of events) {
    if (event.type !== 'PushEvent') continue
    if (!event.created_at) continue
    const dayStart = startOfUTCDay(new Date(event.created_at).getTime())
    if (dayStart < startUTC || dayStart > todayUTC) continue
    const index = Math.floor((dayStart - startUTC) / MS_PER_DAY)
    const payload = event.payload as { size?: number; commits?: unknown[] }
    counts[index] += payload.size ?? payload.commits?.length ?? 1
  }

  return {
    counts,
    from: formatLabel(startUTC),
    to: formatLabel(todayUTC),
  }
}

export async function loadCommitChart(): Promise<CommitChartData> {
  const { data } = await octokit.rest.activity.listPublicEventsForUser({
    username: GITHUB_USERNAME,
    per_page: 100,
  })
  return aggregate(data)
}
