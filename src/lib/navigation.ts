import { withBasePath } from './base-path'

type Navigator = (to: string) => void

let navigator: Navigator | null = null

function canHandleClientSide(event: MouseEvent): boolean {
  return event.button === 0
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey
}

export function setNavigator(nextNavigator: Navigator): void {
  navigator = nextNavigator
}

export function navigate(to: string): void {
  if (navigator) {
    navigator(to)
    return
  }

  location.assign(withBasePath(to))
}

export function handleNavigate(event: MouseEvent, to: string): void {
  if (!canHandleClientSide(event)) return
  event.preventDefault()
  navigate(to)
}
