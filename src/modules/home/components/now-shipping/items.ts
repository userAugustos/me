export interface ShippingItem {
  icon: string
  name: string
  status: string
}

const ICON_GLOBE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`

const ICON_SQUARE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>`

const ICON_LINES = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h16M4 12h16M4 18h10"/></svg>`

export const items: ShippingItem[] = [
  { icon: ICON_GLOBE, name: 'orbit/runtime', status: 'v0.4 · 73% to RC1' },
  { icon: ICON_SQUARE, name: 'State machine essay (pt. 3)', status: 'Draft · 2,400 words' },
  { icon: ICON_LINES, name: 'API ergonomics talk', status: 'QCon SP · Aug 14' },
]
