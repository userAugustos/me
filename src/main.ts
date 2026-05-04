import './style.css'
import { mountTopbar } from './components/topbar/topbar'
import { renderHome } from './modules/home/home'

function pick<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`main: missing element matching '${selector}'`)
  return element
}

mountTopbar(pick('#topbar'))
renderHome(pick('#app'))
