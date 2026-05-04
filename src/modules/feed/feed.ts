import { createActor } from 'xstate'
import { createLoadingMachine } from '../../lib/loading-machine'
import { mountFilters } from './filters'
import type { FeedItem } from './items'
import { loadFeed } from './load'
import {
  renderFeed,
  renderFeedError,
  renderFeedSkeleton,
} from './render-feed'

export function mountFeed(feedRoot: HTMLElement, filtersRoot: HTMLElement): void {
  const actor = createActor(createLoadingMachine<FeedItem[]>(loadFeed))

  actor.subscribe((snapshot) => {
    if (snapshot.matches('loading')) {
      renderFeedSkeleton(feedRoot)
      filtersRoot.innerHTML = ''
    } else if (snapshot.matches('error')) {
      renderFeedError(feedRoot, () => actor.send({ type: 'TRIGGER' }))
      filtersRoot.innerHTML = ''
    } else if (snapshot.matches('idle') && snapshot.context.data) {
      renderFeed(feedRoot, snapshot.context.data)
      mountFilters(filtersRoot, feedRoot, snapshot.context.data)
    }
  })

  actor.start()
  actor.send({ type: 'TRIGGER' })
}
