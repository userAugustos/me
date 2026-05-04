import { createActor } from 'xstate'
import { createLoadingMachine } from '../../lib/loading-machine'
import type { CommitChartData } from './types'
import { loadCommitChart } from './load'
import {
  renderCommitChart,
  renderCommitChartError,
  renderCommitChartSkeleton,
} from './render-commit-chart'

export function mountCommitChart(host: HTMLElement): void {
  const actor = createActor(createLoadingMachine<CommitChartData>(loadCommitChart))

  actor.subscribe((snapshot) => {
    if (snapshot.matches('loading')) {
      renderCommitChartSkeleton(host)
    } else if (snapshot.matches('error')) {
      renderCommitChartError(host, () => actor.send({ type: 'TRIGGER' }))
    } else if (snapshot.matches('idle') && snapshot.context.data) {
      renderCommitChart(host, snapshot.context.data)
    }
  })

  actor.start()
  actor.send({ type: 'TRIGGER' })
}
