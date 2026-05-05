import type { IconNode, SVGProps } from 'lucide'

const DEFAULT_ATTRS: SVGProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 14,
  height: 14,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 1.5,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
}

function attrsToString(attrs: SVGProps): string {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => `${name}="${String(value)}"`)
    .join(' ')
}

export function renderIcon(icon: IconNode, attrs: SVGProps = {}): string {
  const children = icon
    .map(([tag, attrs]) => `<${tag} ${attrsToString(attrs)} />`)
    .join('')

  return `<svg ${attrsToString({ ...DEFAULT_ATTRS, ...attrs })}>${children}</svg>`
}
