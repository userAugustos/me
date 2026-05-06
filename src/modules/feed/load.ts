import { withBasePath } from '../../lib/base-path'
import type { FeedItem, FeedKind, PostManifestItem } from './types'

const KINDS: FeedKind[] = ['essay', 'repo', 'post', 'talk', 'note']
const FEED_LOADING_DELAY_MS = 1500

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

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

export async function loadFeed(): Promise<FeedItem[]> {
  const responsePromise = fetch(withBasePath('/posts/manifest.json'))
  await delay(FEED_LOADING_DELAY_MS)

  const response = await responsePromise
  if (!response.ok) throw new Error(`feed manifest failed: HTTP ${response.status}`)

  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isPostManifestItem)) {
    throw new Error('feed manifest has invalid shape')
  }

  return data
}
