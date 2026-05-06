export type FeedKind = 'essay' | 'repo' | 'post' | 'talk' | 'note'

export interface FeedItem {
  slug: string
  href: string
  kind: FeedKind
  date: string
  meta: string
  title: string
  previewHtml: string
  tags: string[]
}

export interface PostManifestItem {
  slug: string
  href: string
  kind: FeedKind
  date: string
  meta: string
  title: string
  previewHtml: string
  tags: string[]
}
