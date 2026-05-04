import { assign, fromPromise, setup } from 'xstate'
import { MAX_RETRIES } from '../config'

export interface LoadingContext<T> {
  data: T | null
  error: unknown
  attempts: number
}

export type LoadingEvent = { type: 'TRIGGER' }

export function createLoadingMachine<T>(loader: () => Promise<T>) {
  return setup({
    types: {
      context: {} as LoadingContext<T>,
      events: {} as LoadingEvent,
    },
    actors: {
      load: fromPromise<T>(() => loader()),
    },
    guards: {
      canRetry: ({ context }) => context.attempts < MAX_RETRIES,
    },
  }).createMachine({
    id: 'loading',
    initial: 'idle',
    context: { data: null, error: null, attempts: 0 },
    states: {
      idle: {
        on: {
          TRIGGER: {
            target: 'loading',
            actions: assign({ attempts: 0, error: null }),
          },
        },
      },
      loading: {
        invoke: {
          src: 'load',
          onDone: {
            target: 'idle',
            actions: assign({
              data: ({ event }) => event.output,
              error: null,
            }),
          },
          onError: [
            {
              guard: 'canRetry',
              target: 'loading',
              reenter: true,
              actions: assign({
                attempts: ({ context }) => context.attempts + 1,
              }),
            },
            {
              target: 'error',
              actions: assign({
                error: ({ event }) => event.error,
              }),
            },
          ],
        },
      },
      error: {
        on: {
          TRIGGER: {
            target: 'loading',
            actions: assign({ attempts: 0, error: null }),
          },
        },
      },
    },
  })
}
