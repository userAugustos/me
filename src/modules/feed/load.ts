import { items, type FeedItem } from './items'

export async function loadFeed(): Promise<FeedItem[]> {
  return items
}
