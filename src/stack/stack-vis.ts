import gsap from 'gsap';
import * as THREE from 'three';
import { Cube, TextCube } from '../commons/three';
import { wait } from '../commons';
import Stack from './stack';
import StackAlgo from './stack-algo';

export default class<T> implements Stack<T> {
  private stack: StackAlgo<TextCube<T>>;
  private stackShell: StackAlgo<Cube>;
  private stackPosition: THREE.Vector3;
  private stackShellSize: number;

  private nodeMaterial: THREE.Material;
  private nodeTextMaterial: THREE.Material;
  private nodeTextGeometryParameters: THREE.TextGeometryParameters;
  private nodeInitPosition: THREE.Vector3;
  private nodeWidth: number;
  private nodeHeight: number;
  private nodeDepth: number;

  private scene: THREE.Scene;
  private duration: number;

  constructor(
    stackMaterial: THREE.Material,
    stackPosition: THREE.Vector3,
    stackShellSize: number,
    nodeMaterial: THREE.Material,
    nodeTextMaterial: THREE.Material,
    nodeTextGeometryParameters: THREE.TextGeometryParameters,
    nodeInitPosition: THREE.Vector3,
    nodeWidth: number,
    nodeHeight: number,
    nodeDepth: number,
    scene: THREE.Scene,
    duration: number
  ) {
    this.stackPosition = stackPosition;
    this.stackShellSize = stackShellSize;
    this.nodeMaterial = nodeMaterial;
    this.nodeTextMaterial = nodeTextMaterial;
    this.nodeTextGeometryParameters = nodeTextGeometryParameters;
    this.nodeInitPosition = nodeInitPosition;
    this.nodeWidth = nodeWidth;
    this.nodeHeight = nodeHeight;
    this.nodeDepth = nodeDepth;
    this.scene = scene;
    this.duration = duration;
    this.stack = new StackAlgo();
    this.stackShell = new StackAlgo();
    this.buildStackShell(stackMaterial);
  }

  private buildStackShell(material: THREE.Material) {
    const { x, y, z } = this.stackPosition;
    for (let i = 0; i < this.stackShellSize; i++) {
      const cube = new Cube(this.buildBoxGeometry(), material, this.scene);
      cube.x = x - this.nodeWidth * i;
      cube.y = y;
      cube.z = z;
      cube.show();
      this.stackShell.push(cube);
    }
  }

  async push(t: T): Promise<number> {
    const item = this.createItem(t);
    await this.playPush(item);
    return this.stack.push(item);
  }

  private createItem(value: T): TextCube<T> {
    return new TextCube<T>(
      value,
      this.nodeTextMaterial,
      this.nodeTextGeometryParameters,
      this.nodeMaterial,
      this.buildBoxGeometry(),
      this.scene
    );
  }

  private buildBoxGeometry(): THREE.BoxGeometry {
    return new THREE.BoxGeometry(
      this.nodeWidth,
      this.nodeHeight,
      this.nodeDepth
    );
  }

  async pop(): Promise<T | undefined> {
    const item: TextCube<T> | undefined = await this.stack.pop();
    await this.playPop(item);
    return item ? item.value : undefined;
  }

  async peek(): Promise<T | undefined> {
    const item: TextCube<T> | undefined = await this.stack.peek();
    await this.playPeek(item);
    return item ? item.value : undefined;
  }

  async isEmpty(): Promise<boolean> {
    await this.playIsEmpty();
    return this.stack.isEmpty();
  }

  async size(): Promise<number> {
    await this.playSize();
    return this.stack.size();
  }

  private adjustTextX(x: number): number {
    return x - this.nodeWidth / 2.7;
  }

  private adjustTextY(y: number): number {
    return y - this.nodeHeight / 2;
  }

  private async playPush(item: TextCube<T>): Promise<void> {
    const iterator = this.stack.iterator();
    while (iterator.hasNext()) {
      const current = iterator.next();

      const nodeNewX = current.x + this.nodeWidth;
      const textNewX = this.adjustTextX(nodeNewX);

      gsap.to(current.mesh.position, {
        x: nodeNewX,
        duration: this.duration,
      });

      gsap.to(current.textMesh.position, {
        x: textNewX,
        duration: this.duration,
      });
    }

    item.x = this.nodeInitPosition.x;
    item.y = this.nodeInitPosition.y;
    item.z = this.nodeInitPosition.z;

    item.textX = this.adjustTextX(item.x);
    item.textY = this.adjustTextY(item.y);
    item.textZ = item.z;

    const nodeEndPosition = this.stackPosition.clone().setX(this.getTopX());

    const textEndPosition = this.stackPosition
      .clone()
      .setX(this.adjustTextX(nodeEndPosition.x))
      .setY(this.adjustTextY(nodeEndPosition.y));

    gsap.to(item.mesh.position, {
      ...nodeEndPosition,
      duration: this.duration,
    });

    gsap.to(item.textMesh.position, {
      ...textEndPosition,
      duration: this.duration,
    });

    await wait(this.duration);
    return Promise.resolve();
  }

  private getTopX(): number {
    const { x } = this.stackPosition;
    const size = this.stackShellSize;
    return x - this.nodeWidth * (size - 1);
  }

  private playPop(item: TextCube<T> | undefined): Promise<void> {
    if (item) {
      return this.playPopItem(item);
    } else {
      return Promise.resolve();
    }
  }

  private async playPopItem(item: TextCube<T>): Promise<void> {
    const endX = this.getTopX() - 10;
    const endTextX = this.adjustTextX(endX);

    gsap.to(item.mesh.position, { x: endX, duration: this.duration });
    gsap.to(item.textMesh.position, { x: endTextX, duration: this.duration });

    const iterator = this.stack.iterator();
    while (iterator.hasNext()) {
      const current = iterator.next();

      const nodeNewX = current.x - this.nodeWidth;
      const textNewX = this.adjustTextX(nodeNewX);

      gsap.to(current.mesh.position, {
        x: nodeNewX,
        duration: this.duration,
      });
      gsap.to(current.textMesh.position, {
        x: textNewX,
        duration: this.duration,
      });
    }

    await wait(this.duration);
    item.hide();
    return Promise.resolve();
  }

  private playPeek(item: TextCube<T> | undefined): Promise<void> {
    return Promise.resolve();
  }

  private playIsEmpty(): Promise<void> {
    return Promise.resolve();
  }

  private playSize(): Promise<void> {
    return Promise.resolve();
  }
}
