import { withBasePath } from '../../lib/base-path'
import type { FeedDate, FeedItem, FeedKind, PostManifestItem } from './types'

const KINDS: FeedKind[] = ['essay', 'repo', 'post', 'talk', 'note']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function isFeedKind(value: unknown): value is FeedKind {
  return typeof value === 'string' && KINDS.includes(value as FeedKind)
}

function isPostManifestItem(value: unknown): value is PostManifestItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>

  return typeof item.slug === 'string'
    && typeof item.href === 'string'
    && isFeedKind(item.kind)
    && typeof item.date === 'string'
    && typeof item.meta === 'string'
    && typeof item.title === 'string'
    && typeof item.previewHtml === 'string'
    && Array.isArray(item.tags)
    && item.tags.every((tag) => typeof tag === 'string')
}

function formatDate(isoDate: string): FeedDate {
  const [year, month, day] = isoDate.split('-')
  return {
    day,
    mo: MONTHS[Number(month) - 1] ?? month,
    year: year.slice(2),
  }
}

function toFeedItem(item: PostManifestItem): FeedItem {
  return {
    ...item,
    isoDate: item.date,
    date: formatDate(item.date),
  }
}

export async function loadFeed(): Promise<FeedItem[]> {
  const response = await fetch(withBasePath('/posts/manifest.json'))
  if (!response.ok) throw new Error(`feed manifest failed: HTTP ${response.status}`)

  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isPostManifestItem)) {
    throw new Error('feed manifest has invalid shape')
  }

  return data.map(toFeedItem)
}
