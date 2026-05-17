import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ItemScene } from './scene';

export interface ItemRenderer {
  activate: () => void;
  deactivate: () => void;
  dispose: () => void;
}

export function mountRenderer(
  canvas: HTMLCanvasElement,
  itemScene: ItemScene,
): ItemRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const controls = new OrbitControls(itemScene.camera, canvas);
  controls.enableDamping = true;

  let rafId: number;
  let active = false;

  const resizeObserver = new ResizeObserver(() => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    itemScene.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    itemScene.camera.updateProjectionMatrix();
  });
  resizeObserver.observe(canvas);

  function animate() {
    if (!active) return;
    rafId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(itemScene.scene, itemScene.camera);
  }

  return {
    activate: () => {
      if (active) return;
      active = true;
      animate();
    },
    deactivate: () => {
      active = false;
      cancelAnimationFrame(rafId);
    },
    dispose: () => {
      active = false;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    },
  };
}
