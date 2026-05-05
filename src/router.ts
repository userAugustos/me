import { renderHome } from './modules/home/home'
import { renderPost } from './modules/post/post'
import { setNavigator } from './lib/navigation'

type Route = {
  pattern: RegExp
  render: (root: HTMLElement, params: Record<string, string>) => void
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

function paramsFor(route: Route, match: RegExpMatchArray): Record<string, string> {
  if (route.pattern.source.includes('posts')) return { slug: match[1] }
  return {}
}

function renderCurrentRoute(): void {
  if (!appRoot) return

  for (const route of routes) {
    const match = location.pathname.match(route.pattern)
    if (!match) continue
    route.render(appRoot, paramsFor(route, match))
    return
  }

  appRoot.innerHTML = '<h1 class="font-serif text-ink">404</h1>'
}

export function mountRouter(app: HTMLElement): void {
  appRoot = app
  setNavigator((to) => {
    history.pushState({}, '', to)
    renderCurrentRoute()
    scrollTo(0, 0)
  })

  window.addEventListener('popstate', renderCurrentRoute)
  renderCurrentRoute()
}
