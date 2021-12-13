import gsap from 'gsap';
import * as THREE from 'three';
import { Cube, TextCube } from '../commons/three';
import { wait } from '../commons';
import { IStack } from './stack';
import { StackAlgo } from './stack-algo';

export class StackVis<T> implements IStack<T> {
  private stack: StackAlgo<TextCube<T>>;
  private stackShell: StackAlgo<Cube>;
  private stackPosition: THREE.Vector3;
  private stackShellSize: number;

  private nodeMaterial: THREE.Material;
  private nodeTextMaterial: THREE.Material;
  private nodeTextGeometryParameters: THREE.TextGeometryParameters;
  private nodeInitPosition: THREE.Vector3;
  private nodeTextAdjust: THREE.Vector3;
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
    nodeTextAdjust: THREE.Vector3,
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
    this.nodeTextAdjust = nodeTextAdjust;
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

  async push(value: T): Promise<number> {
    const item = this.createAndInitItemPosition(value);
    await this.playPush([item]);
    return this.stack.push(item);
  }

  async pushElements(elements: T[]): Promise<void> {
    const items = elements.map(e => this.createAndInitItemPosition(e));
    await this.playPush(items);
    items.map(item => this.stack.push(item));
  }

  private async playPush(items: TextCube<T>[]): Promise<void> {
    await this.shiftNodesForPush(items.length);

    items.map((item, i) => {
      item.show();
      this.move(item, this.getTopX() + (items.length - 1 - i) * this.nodeWidth);
    });

    await wait(this.duration);
  }

  private createAndInitItemPosition(value: T): TextCube<T> {
    const item = this.createItem(value);
    this.initItemPosition(item);
    return item;
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

  private initItemPosition(item: TextCube<T>): void {
    this.initItemNodePosition(item);
    this.initItemTextPosition(item);
  }

  private initItemNodePosition(item: TextCube<T>): void {
    item.x = this.nodeInitPosition.x;
    item.y = this.nodeInitPosition.y;
    item.z = this.nodeInitPosition.z;
  }

  private initItemTextPosition(item: TextCube<T>): void {
    item.textX = this.adjustTextX(item.x);
    item.textY = this.adjustTextY(item.y);
    item.textZ = item.z;
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
    return x - this.nodeWidth / 2.7 + this.nodeTextAdjust.x;
  }

  private adjustTextY(y: number): number {
    return y - this.nodeHeight / 2 + this.nodeTextAdjust.y;
  }

  private async shiftNodesForPush(nodes: number): Promise<void> {
    const iterator = this.stack.iterator();
    while (iterator.hasNext()) {
      const current = iterator.next();
      this.move(current, current.x + this.nodeWidth * nodes);
    }

    await wait(this.duration);
  }

  private move(item: TextCube<T>, nodeX: number): void {
    const textX = this.adjustTextX(nodeX);

    gsap.to(item.mesh.position, { x: nodeX, duration: this.duration });
    gsap.to(item.textMesh.position, { x: textX, duration: this.duration });
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
    this.move(item, this.getTopX() - 10);

    const iterator = this.stack.iterator();
    while (iterator.hasNext()) {
      const current = iterator.next();
      this.move(current, current.x - this.nodeWidth);
    }

    await wait(this.duration);
    item.hide();
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
