import { createActor } from 'xstate'
import { createLoadingMachine } from '../../lib/loading-machine'
import { loadPost } from './load'
import type { GeneratedPost } from './types'
import {
  renderGeneratedPost,
  renderPostError,
  renderPostSkeleton,
} from './render-post'

export function renderPost(root: HTMLElement, params: Record<string, string>): void {
  const slug = params.slug
  const actor = createActor(createLoadingMachine<GeneratedPost>(() => loadPost(slug)))

  actor.subscribe((snapshot) => {
    if (snapshot.matches('loading')) {
      renderPostSkeleton(root)
    } else if (snapshot.matches('error')) {
      renderPostError(root, () => actor.send({ type: 'TRIGGER' }))
    } else if (snapshot.matches('idle') && snapshot.context.data) {
      renderGeneratedPost(root, snapshot.context.data)
    }
  })

  actor.start()
  actor.send({ type: 'TRIGGER' })
}
