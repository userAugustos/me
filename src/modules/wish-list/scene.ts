import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface ItemScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  dispose: () => void;
}

const loader = new GLTFLoader();

export function createScene(modelPath: string): Promise<ItemScene> {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1, 3);
  camera.lookAt(0, 0, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  return new Promise((resolve, reject) => {
    loader.load(
      modelPath,
      gltf => {
        scene.add(gltf.scene);

        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fovRad = camera.fov * (Math.PI / 180);
        const distance = Math.abs(maxDim / 2 / Math.tan(fovRad / 2)) * 1.2;

        camera.position.set(center.x, center.y, center.z + distance);
        camera.lookAt(center);
        camera.near = distance / 100;
        camera.far = distance * 100;
        camera.updateProjectionMatrix();

        resolve({
          scene,
          camera,
          dispose: () => {
            gltf.scene.traverse(obj => {
              if (obj instanceof THREE.Mesh) {
                obj.geometry.dispose();
                if (Array.isArray(obj.material)) {
                  obj.material.forEach(m => m.dispose());
                } else {
                  obj.material.dispose();
                }
              }
            });
            scene.clear();
          },
        });
      },
      undefined,
      reject,
    );
  });
}
