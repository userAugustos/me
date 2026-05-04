const X_RANGE = 4
const Y_RANGE = 3

export function attachIntroParallax(target: HTMLElement): void {
  target.style.transition = 'transform 1.6s cubic-bezier(.2,.7,.2,1)'

  document.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * X_RANGE
    const y = (event.clientY / window.innerHeight - 0.5) * Y_RANGE
    target.style.transform = `translate(${x}px, ${y}px)`
  })
}
