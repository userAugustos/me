import template from './wish-list.html?raw';
import { items } from './items';
import { createScene } from './scene';
import { mountRenderer } from './renderer';
import { createObserver } from './observer';
import type { ItemRenderer } from './renderer';
import type { ItemScene } from './scene';

export function renderWishList(root: HTMLElement): () => void {
  root.innerHTML = template;

  const container = root.querySelector<HTMLElement>('[data-wish-list-items]')!;

  const scenes = new Map<string, ItemScene>();
  const renderers = new Map<string, ItemRenderer>();
  const pendingActivation = new Set<string>();

  for (const item of items) {
    const card = document.createElement('div');
    card.className = 'wish-list-card w-full h-[35rem] rounded-xl bg-[oklch(0.965_0.008_80)] overflow-hidden relative';
    card.dataset.modelSlot = item.id;
    card.innerHTML = `
      <canvas class="w-full h-full block"></canvas>
      ${item.brand || item.year ? `
      <div class="absolute bottom-4 right-4 text-right pointer-events-none">
        ${item.name ? `<p class="text-xs font-medium text-ink">${item.name}</p>` : ''}
        ${item.brand ? `<p class="text-xs text-ink-3">${item.brand}</p>` : ''}
        ${item.year ? `<p class="text-xs text-ink-4">${item.year}</p>` : ''}
      </div>` : ''}
    `;
    container.appendChild(card);

    const canvas = card.querySelector<HTMLCanvasElement>('canvas')!;

    createScene(item.modelPath).then(scene => {
      scenes.set(item.id, scene);
      const itemRenderer = mountRenderer(canvas, scene);
      renderers.set(item.id, itemRenderer);

      if (pendingActivation.has(item.id)) {
        itemRenderer.activate();
        pendingActivation.delete(item.id);
      }
    });
  }

  const slots = root.querySelectorAll('[data-model-slot]');

  const observerCleanup = createObserver(
    slots,
    id => {
      const r = renderers.get(id);
      if (r) {
        r.activate();
      } else {
        pendingActivation.add(id);
      }
    },
    id => {
      renderers.get(id)?.deactivate();
      pendingActivation.delete(id);
    },
  );

  return () => {
    observerCleanup();
    for (const r of renderers.values()) r.dispose();
    for (const s of scenes.values()) s.dispose();
    renderers.clear();
    scenes.clear();
  };
}
