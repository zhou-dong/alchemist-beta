import gsap from 'gsap';
import * as THREE from 'three';
import { Cube, TextCube } from '../commons/three';
import { wait } from '../commons';
import Queue from './queue';
import QueueAlgo from './queue-algo';

export default class<T> implements Queue<T> {
  private queue: QueueAlgo<TextCube<T>>;
  private queueShell: QueueAlgo<Cube>;
  private queuePosition: THREE.Vector3;

  private nodeMaterial: THREE.Material;
  private nodeTextMaterial: THREE.Material;
  private nodeTextGeometryParameters: THREE.TextGeometryParameters;
  private nodeWidth: number;
  private nodeHeight: number;
  private nodeDepth: number;

  private scene: THREE.Scene;
  private duration: number;

  constructor(
    queueMaterial: THREE.Material,
    queuePosition: THREE.Vector3,
    queueShellSize: number,
    nodeMaterial: THREE.Material,
    nodeTextMaterial: THREE.Material,
    nodeTextGeometryParameters: THREE.TextGeometryParameters,
    scene: THREE.Scene,
    duration: number,
    nodeWidth = 1,
    nodeHeight = 1,
    nodeDepth = 1
  ) {
    this.queuePosition = queuePosition;
    this.nodeMaterial = nodeMaterial;
    this.nodeTextMaterial = nodeTextMaterial;
    this.nodeTextGeometryParameters = nodeTextGeometryParameters;
    this.scene = scene;
    this.queue = new QueueAlgo<TextCube<T>>();
    this.queueShell = new QueueAlgo<Cube>();
    this.duration = duration;
    this.nodeWidth = nodeWidth;
    this.nodeHeight = nodeHeight;
    this.nodeDepth = nodeDepth;
    this.buildQueueShell(queueMaterial, queueShellSize);
  }

  async enqueue(value: T): Promise<number> {
    const item = this.createItem(value);
    await this.playEnqueue(item);
    return this.queue.enqueue(item);
  }

  private createItem(value: T): TextCube<T> {
    const item = new TextCube<T>(
      value,
      this.nodeTextMaterial,
      this.nodeTextGeometryParameters,
      this.nodeMaterial,
      this.buildBoxGeometry(),
      this.scene
    );
    item.width = this.nodeWidth;
    item.height = this.nodeHeight;
    item.depth = this.nodeDepth;
    return item;
  }

  private buildBoxGeometry(): THREE.BoxGeometry {
    return new THREE.BoxGeometry(
      this.nodeWidth,
      this.nodeHeight,
      this.nodeDepth
    );
  }

  private buildQueueShell(material: THREE.Material, shellSize: number) {
    const { x, y, z } = this.queuePosition;
    for (let i = 0; i < shellSize; i++) {
      const cube = new Cube(this.buildBoxGeometry(), material, this.scene);
      cube.x = x - this.nodeWidth * i;
      cube.y = y;
      cube.z = z;
      cube.show();
      this.queueShell.enqueue(cube);
    }
  }

  async dequeue(): Promise<T | undefined> {
    const item = await this.queue.dequeue();
    if (item) {
      await this.playDequeue(item);
      return Promise.resolve(item.value);
    } else {
      return Promise.resolve(undefined);
    }
  }

  async peek(): Promise<T | undefined> {
    const item = await this.queue.peek();
    if (item) {
      await this.playPeek(item);
      return Promise.resolve(item.value);
    } else {
      return Promise.resolve(undefined);
    }
  }

  async isEmpty(): Promise<boolean> {
    await this.playIsEmpty();
    return this.queue.isEmpty();
  }

  async size(): Promise<number> {
    await this.playSize();
    return this.queue.size();
  }

  private sumItemsWidth(): number {
    return this.sumQueueWidth(this.queue);
  }

  private sumQueueWidth(queue: QueueAlgo<Cube>): number {
    let result = 0;
    const iterator = queue.iterator();
    while (iterator.hasNext()) {
      result += iterator.next().width;
    }
    return result;
  }

  private adjustTextX(x: number): number {
    return x - this.nodeWidth / 2.7;
  }

  private async playEnqueue(item: TextCube<T>): Promise<void> {
    const width = this.sumItemsWidth();
    const { x, y, z } = this.queuePosition;

    const startX = x - this.nodeWidth * 10;
    const startTextX = this.adjustTextX(startX);

    const endX = x - width;
    const endTextX = this.adjustTextX(endX);

    item.x = startX;
    item.y = y;
    item.z = z;

    item.textX = startTextX;
    item.textY = y - item.height / 2;
    item.textZ = z;

    item.show();

    gsap.to(item.mesh.position, { x: endX, duration: this.duration });
    gsap.to(item.textMesh.position, { x: endTextX, duration: this.duration });

    await wait(this.duration);
    return Promise.resolve();
  }

  private async playDequeue(item: TextCube<T>): Promise<void> {
    const { x } = this.queuePosition;

    const endX = x + 10;
    const endTextX = this.adjustTextX(endX);

    // remove item from queue.
    gsap.to(item.mesh.position, { x: endX, duration: this.duration });
    gsap.to(item.textMesh.position, { x: endTextX, duration: this.duration });

    // arrange exist items in queue.
    let index = 0;
    const iterator = this.queue.iterator();
    while (iterator.hasNext()) {
      const current = iterator.next();

      const newX = x - this.nodeWidth * index;
      const newTextX = this.adjustTextX(newX);

      gsap.to(current.mesh.position, {
        x: newX,
        duration: this.duration,
      });
      gsap.to(current.textMesh.position, {
        x: newTextX,
        duration: this.duration,
      });
      index += 1;
    }

    await wait(this.duration);
    item.hide();
    return Promise.resolve();
  }

  private playPeek(item: TextCube<T>): Promise<void> {
    return Promise.resolve();
  }

  private playIsEmpty(): Promise<void> {
    return Promise.resolve();
  }

  private playSize(): Promise<void> {
    return Promise.resolve();
  }
}
