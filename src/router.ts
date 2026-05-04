type Page = {
  render: (root: HTMLElement, params: Record<string, string>) => void
}

const modules = import.meta.glob<Page>('./modules/**/*.ts')

const routes = Object.entries(modules).map(([file, load]) => {
  const segments = file
    .replace(/^\.\/modules\//, '')
    .replace(/\.ts$/, '')
    .split('/')
    .filter(s => s !== 'index')

  const params: string[] = []
  const source = segments
    .map(s => s.startsWith('$') ? (params.push(s.slice(1)), '([^/]+)') : s)
    .join('/')

  return { pattern: new RegExp(`^/${source}$`), params, load }
}).sort((a, b) => a.params.length - b.params.length)

const app = document.querySelector<HTMLDivElement>('#app')!

async function render() {
  for (const r of routes) {
    const m = location.pathname.match(r.pattern)
    if (!m) continue
    const values = Object.fromEntries(r.params.map((n, i) => [n, m[i + 1]]))
    const mod = await r.load()
    mod.render(app, values)
    return
  }
  app.innerHTML = '<h1>404</h1>'
}

window.addEventListener('popstate', render)
document.addEventListener('click', e => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = (e.target as Element).closest('a')
  if (!a || a.origin !== location.origin || a.target === '_blank') return
  e.preventDefault()
  history.pushState({}, '', a.href)
  render()
})

render()
