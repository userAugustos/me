export function createObserver(
  slots: NodeListOf<Element>,
  onEnter: (id: string) => void,
  onLeave: (id: string) => void,
): () => void {
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.modelSlot!;
        entry.isIntersecting ? onEnter(id) : onLeave(id);
      }
    },
    { threshold: 0.1 },
  );

  slots.forEach(slot => observer.observe(slot));
  return () => observer.disconnect();
}
