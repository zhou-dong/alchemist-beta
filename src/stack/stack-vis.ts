import * as THREE from 'three';
import { Cube, TextCube } from '../commons/three';
import Stack from './stack';
import StackAlgo from './stack-algo';

export default class<T> implements Stack<T> {
  private stack: StackAlgo<TextCube<T>>;
  private stackShell: StackAlgo<Cube>;
  private stackPosition: THREE.Vector3;

  private nodeMaterial: THREE.Material;
  private nodeTextMaterial: THREE.Material;
  private nodeTextGeometryParameters: THREE.TextGeometryParameters;
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
    scene: THREE.Scene,
    duration: number,
    nodeWidth: number,
    nodeHeight: number,
    nodeDepth: number
  ) {
    this.stackPosition = stackPosition;
    this.nodeMaterial = nodeMaterial;
    this.nodeTextMaterial = nodeTextMaterial;
    this.nodeTextGeometryParameters = nodeTextGeometryParameters;
    this.scene = scene;
    this.duration = duration;
    this.nodeWidth = nodeWidth;
    this.nodeHeight = nodeHeight;
    this.nodeDepth = nodeDepth;
    this.stack = new StackAlgo();
    this.stackShell = new StackAlgo();
    this.buildStackShell(stackMaterial, stackShellSize);
  }

  private buildStackShell(material: THREE.Material, shellSize: number) {
    const { x, y, z } = this.stackPosition;
    for (let i = 0; i < shellSize; i++) {
      const geometry = new THREE.BoxGeometry(
        this.nodeWidth,
        this.nodeHeight,
        this.nodeDepth
      );
      const cube = new Cube(geometry, material, this.scene);
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
    const item = new TextCube<T>(
      value,
      this.nodeTextMaterial,
      this.nodeTextGeometryParameters,
      this.nodeMaterial,
      new THREE.BoxGeometry(),
      this.scene
    );
    item.width = this.nodeWidth;
    item.height = this.nodeHeight;
    item.depth = this.nodeDepth;
    return item;
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

  private playPush(item: TextCube<T>): Promise<void> {
    return Promise.resolve();
  }

  private playPop(item: TextCube<T> | undefined): Promise<void> {
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
