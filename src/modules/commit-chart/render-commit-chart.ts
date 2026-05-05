import type { CommitChartData } from './types'

const DEFAULT_COLUMN_COUNT = 30

const LEVEL_CLASS: Record<number, string> = {
  0: 'bg-rule-soft',
  1: 'bg-[oklch(0.92_0.04_25)]',
  2: 'bg-[oklch(0.82_0.08_25)]',
  3: 'bg-[oklch(0.7_0.13_25)]',
  4: 'bg-accent',
}

function heatLevel(count: number): number {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

function totalCommits(counts: number[]): number {
  return counts.reduce((sum, n) => sum + n, 0)
}

function buildCell(count: number, index: number): HTMLElement {
  const cell = document.createElement('div')
  cell.className = `aspect-square rounded-[2px] transition-transform duration-300 hover:scale-[1.4] ${LEVEL_CLASS[heatLevel(count)]}`
  cell.title = `${count} commits`
  cell.style.opacity = '0'
  cell.style.transition += ', opacity 0.5s ease'
  cell.style.transitionDelay = `${1.0 + index * 0.015}s`
  requestAnimationFrame(() => {
    cell.style.opacity = '1'
  })
  return cell
}

function buildGrid(counts: number[]): HTMLElement {
  const grid = document.createElement('div')
  grid.className = 'grid gap-0.75 mb-2.5'
  grid.style.gridTemplateColumns = `repeat(${counts.length}, minmax(0, 1fr))`
  counts.forEach((count, index) => grid.appendChild(buildCell(count, index)))
  return grid
}

function legendHTML(data: CommitChartData): string {
  return `
    <div class="font-mono text-[10px] text-ink-3 flex justify-between uppercase tracking-wider">
      <span>${data.from}</span>
      <span>${totalCommits(data.counts)} commits</span>
      <span>${data.to}</span>
    </div>
  `
}

export function renderCommitChart(root: HTMLElement, data: CommitChartData): void {
  root.innerHTML = ''
  root.appendChild(buildGrid(data.counts))
  root.insertAdjacentHTML('beforeend', legendHTML(data))
}

function buildSkeletonGrid(count: number): HTMLElement {
  const grid = document.createElement('div')
  grid.className = 'grid gap-0.75 mb-2.5 animate-pulse'
  grid.style.gridTemplateColumns = `repeat(${count}, minmax(0, 1fr))`
  for (let i = 0; i < count; i++) {
    const cell = document.createElement('div')
    cell.className = 'aspect-square rounded-[2px] bg-rule-soft'
    grid.appendChild(cell)
  }
  return grid
}

function skeletonLegendHTML(): string {
  return `
    <div class="font-mono text-[10px] text-ink-3 flex justify-between uppercase tracking-wider opacity-60">
      <span>—</span>
      <span>Loading commits…</span>
      <span>—</span>
    </div>
  `
}

export function renderCommitChartSkeleton(root: HTMLElement, count = DEFAULT_COLUMN_COUNT): void {
  root.innerHTML = ''
  root.appendChild(buildSkeletonGrid(count))
  root.insertAdjacentHTML('beforeend', skeletonLegendHTML())
}

export function renderCommitChartError(root: HTMLElement, retry: () => void): void {
  root.innerHTML = `
    <div class="font-mono text-[11px] text-ink-3 py-2">
      Couldn't load commits.
      <button type="button" data-retry class="ml-2 underline text-ink hover:text-accent cursor-pointer">Retry</button>
    </div>
  `
  const button = root.querySelector<HTMLButtonElement>('[data-retry]')
  button?.addEventListener('click', retry)
}
