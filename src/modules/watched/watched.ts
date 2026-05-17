import template from './watched.html?raw';
import { items } from './items';
import type { WatchedItem } from './types';

const CARD_BASE = 'watched-card cursor-pointer rounded-xl overflow-hidden bg-paper-2';

function cardClass(expanded: boolean): string {
  return expanded ? `${CARD_BASE} col-span-full h-[35rem] order-first` : CARD_BASE;
}

function collapsedContent(item: WatchedItem): string {
  return `
    <img
      src="https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg"
      alt="${item.title}"
      class="w-full aspect-video object-cover"
    />
    <div class="p-3">
      <h3 class="text-sm font-medium text-ink line-clamp-2">${item.title}</h3>
    </div>
  `;
}

function expandedContent(item: WatchedItem): string {
  return `
    <div class="flex flex-col h-full">
      <div class="flex-1 min-h-0 bg-black">
        <iframe
          src="https://www.youtube.com/embed/${item.youtubeId}?autoplay=1"
          class="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="flex flex-col gap-1 px-4 py-3 shrink-0">
        <h2 class="text-sm font-semibold text-ink leading-snug">${item.title}</h2>
        ${item.notes ? `<p class="text-xs text-ink-3 leading-relaxed">${item.notes}</p>` : ''}
      </div>
    </div>
  `;
}

function flip(
  snapshots: Map<string, DOMRect>,
  grid: HTMLElement,
) {
  for (const item of items) {
    const card = grid.querySelector<HTMLElement>(`[data-video-id="${item.id}"]`);
    const first = snapshots.get(item.id);
    if (!card || !first) continue;

    const last = card.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const sx = first.width / last.width;
    const sy = first.height / last.height;

    if (dx === 0 && dy === 0 && sx === 1 && sy === 1) continue;

    card.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: 'top left' },
        { transform: 'none' },
      ],
      { duration: 380, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    );
  }
}

export function renderWatched(root: HTMLElement): () => void {
  root.innerHTML = template;

  const grid = root.querySelector<HTMLElement>('[data-watched-grid]')!;
  let activeId: string | null = null;

  function applyState() {
    for (const item of items) {
      const card = grid.querySelector<HTMLElement>(`[data-video-id="${item.id}"]`);
      if (!card) continue;

      const expanded = item.id === activeId;
      card.className = cardClass(expanded);
      card.innerHTML = expanded ? expandedContent(item) : collapsedContent(item);

      if (expanded) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function setActive(id: string | null) {
    activeId = id;

    if ('startViewTransition' in document) {
      document.startViewTransition(applyState);
      return;
    }

    const snapshots = new Map<string, DOMRect>();
    for (const item of items) {
      const card = grid.querySelector<HTMLElement>(`[data-video-id="${item.id}"]`);
      if (card) snapshots.set(item.id, card.getBoundingClientRect());
    }

    applyState();
    flip(snapshots, grid);
  }

  for (const item of items) {
    const card = document.createElement('div');
    card.dataset.videoId = item.id;
    card.className = cardClass(false);
    card.innerHTML = collapsedContent(item);
    card.style.viewTransitionName = `watched-card-${item.id}`;
    card.addEventListener('click', () => {
      setActive(activeId === item.id ? null : item.id);
    });
    grid.appendChild(card);
  }

  return () => {
    activeId = null;
  };
}
