import { renderHome } from './modules/home/home'
import { renderPost } from './modules/post/post'
import { stripBasePath, withBasePath } from './lib/base-path'
import { setNavigator } from './lib/navigation'

type Cleanup = () => void

type Route = {
  pattern: RegExp
  render: (root: HTMLElement, params: Record<string, string>) => void | Cleanup
}

const routes: Route[] = [
  {
    pattern: /^\/$/,
    render: (root) => renderHome(root),
  },
  {
    pattern: /^\/posts\/([^/]+)$/,
    render: (root, params) => renderPost(root, params),
  },
]

let appRoot: HTMLElement | null = null
let currentCleanup: Cleanup | null = null

function paramsFor(route: Route, match: RegExpMatchArray): Record<string, string> {
  if (route.pattern.source.includes('posts')) return { slug: match[1] }
  return {}
}

function renderCurrentRoute(): void {
  if (!appRoot) return
  currentCleanup?.()
  currentCleanup = null
  const pathname = stripBasePath(location.pathname)

  for (const route of routes) {
    const match = pathname.match(route.pattern)
    if (!match) continue
    currentCleanup = route.render(appRoot, paramsFor(route, match)) ?? null
    return
  }

  appRoot.innerHTML = '<h1 class="font-serif text-ink">404</h1>'
}

export function mountRouter(app: HTMLElement): void {
  appRoot = app
  setNavigator((to) => {
    history.pushState({}, '', withBasePath(to))
    renderCurrentRoute()
    scrollTo(0, 0)
  })

  window.addEventListener('popstate', renderCurrentRoute)
  renderCurrentRoute()
}
