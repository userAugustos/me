import { createActor } from 'xstate'
import { subscribeToLocale } from '../../i18n'
import { createLoadingMachine } from '../../lib/loading-machine'
import type { CommitChartData } from './types'
import { loadCommitChart } from './load'
import {
  renderCommitChart,
  renderCommitChartError,
  renderCommitChartSkeleton,
} from './render-commit-chart'

export function mountCommitChart(host: HTMLElement): () => void {
  const actor = createActor(createLoadingMachine<CommitChartData>(loadCommitChart))

  const updateView = (): void => {
    const snapshot = actor.getSnapshot()

    if (snapshot.matches('loading')) {
      renderCommitChartSkeleton(host)
    } else if (snapshot.matches('error')) {
      renderCommitChartError(host, () => actor.send({ type: 'TRIGGER' }))
    } else if (snapshot.matches('idle') && snapshot.context.data) {
      renderCommitChart(host, snapshot.context.data)
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
