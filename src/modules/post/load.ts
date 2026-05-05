import type { FeedKind } from '../feed/types'
import type { GeneratedPost } from './types'

const KINDS: FeedKind[] = ['essay', 'repo', 'post', 'talk', 'note']

function isFeedKind(value: unknown): value is FeedKind {
  return typeof value === 'string' && KINDS.includes(value as FeedKind)
}

function isGeneratedPost(value: unknown): value is GeneratedPost {
  if (!value || typeof value !== 'object') return false
  const post = value as Record<string, unknown>

  return typeof post.slug === 'string'
    && isFeedKind(post.kind)
    && typeof post.date === 'string'
    && typeof post.meta === 'string'
    && typeof post.title === 'string'
    && typeof post.html === 'string'
    && Array.isArray(post.tags)
    && post.tags.every((tag) => typeof tag === 'string')
}

export async function loadPost(slug: string): Promise<GeneratedPost> {
  const response = await fetch(`/posts/generated/${slug}.json`)
  if (!response.ok) throw new Error(`post failed: HTTP ${response.status}`)

  const data: unknown = await response.json()
  if (!isGeneratedPost(data)) throw new Error('post has invalid shape')

  return data
}
