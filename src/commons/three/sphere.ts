import * as THREE from 'three';
import { ColorRepresentation } from 'three';

export default class {
  private scene: THREE.Scene;
  private mesh: THREE.Mesh;

  constructor(radius: number, color: ColorRepresentation, scene: THREE.Scene) {
    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshBasicMaterial({ color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene = scene;
  }

  public hide() {
    this.scene.remove(this.mesh);
  }
}
