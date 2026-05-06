import { createActor } from 'xstate'
import { subscribeToLocale } from '../../i18n'
import { createLoadingMachine } from '../../lib/loading-machine'
import { mountFilters } from './filters'
import { loadFeed } from './load'
import { renderFeed, renderFeedError, renderFeedSkeleton } from './render-feed'
import type { FeedItem } from './types'

export function mountFeed(
  feedRoot: HTMLElement,
  filtersRoot: HTMLElement,
): () => void {
  const actor = createActor(createLoadingMachine<FeedItem[]>(loadFeed))

  const updateView = (): void => {
    const snapshot = actor.getSnapshot()

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
  }
  actor.subscribe(() => {
    updateView()
  })

  actor.start()
  actor.send({ type: 'TRIGGER' })
  const localeCleanup = subscribeToLocale(updateView)

  return () => {
    localeCleanup()
    actor.stop()
  }
}
