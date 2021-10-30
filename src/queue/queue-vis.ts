import gsap from "gsap";
import * as THREE from "three";
import { Cube, TextCube } from "../commons/three";
import Queue from "./queue";
import QueueAlgo from "./queue-algo";

export default class <T> implements Queue<T> {

    private items: QueueAlgo<TextCube<T>>;
    private queuePosition: THREE.Vector3;

    private nodeMaterial: THREE.Material;
    private nodeTextMaterial: THREE.MeshPhongMaterial;
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
        nodeTextMaterial: THREE.MeshPhongMaterial,
        nodeTextGeometryParameters: THREE.TextGeometryParameters,
        nodeWidth: number,
        nodeHeight: number,
        nodeDepth: number,
        scene: THREE.Scene,
        duration: number
    ) {
        this.queuePosition = queuePosition;
        this.nodeMaterial = nodeMaterial;
        this.nodeTextMaterial = nodeTextMaterial;
        this.nodeTextGeometryParameters = nodeTextGeometryParameters;
        this.scene = scene;
        this.items = new QueueAlgo<TextCube<T>>();
        this.duration = duration;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.nodeDepth = nodeDepth;
        this.buildQueueShell(queueMaterial, queueShellSize);
    }

    async enqueue(value: T): Promise<number> {
        const item = this.createItem(value);
        await this.playEnqueue(item);
        const result = await this.items.enqueue(item);
        return result;
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

    private buildQueueShell(material: THREE.Material, shellSize: number) {
        const { x, y, z } = this.queuePosition;
        const geometry = new THREE.BoxGeometry(this.nodeWidth * shellSize, this.nodeHeight, this.nodeDepth);
        const cube = new Cube(geometry, material, this.scene);
        cube.x = x;
        cube.y = y;
        cube.z = z;
        cube.show();
    }

    async dequeue(): Promise<T | undefined> {
        const item = await this.items.dequeue();
        if (item) {
            await this.playDequeue(item);
            return Promise.resolve(item.value)
        } else {
            return Promise.resolve(undefined);
        }
    }

    async peek(): Promise<T | undefined> {
        const item = await this.items.peek();
        if (item) {
            await this.playPeek(item);
            return Promise.resolve(item.value);
        } else {
            return Promise.resolve(undefined);
        }
    }

    async isEmpty(): Promise<boolean> {
        await this.playIsEmpty();
        return this.items.isEmpty();
    }

    async size(): Promise<number> {
        await this.playSize();
        return this.items.size();
    }

    private wait(duration: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, duration * 1000));
    }

    private sumItemsWidth(): number {
        return this.sumQueueWidth(this.items);
    }

    private sumQueueWidth<R>(queue: QueueAlgo<Cube>): number {
        let result = 0;
        const iterator = queue.iterator();
        while (iterator.hasNext()) {
            result += iterator.next().width;
        }
        return result;
    }

    private async playEnqueue(item: TextCube<T>): Promise<void> {
        const width = this.sumItemsWidth();
        item.show();
        const { x, y, z } = this.queuePosition;
        gsap.to(item.mesh.position, { x: x - width, y, z, duration: this.duration });
        await this.wait(this.duration);
        return Promise.resolve();
    }

    private async playDequeue(item: TextCube<T>): Promise<void> {
        const { x, y, z } = this.queuePosition;
        gsap.to(item.mesh.position, { x: x + 10, y, z: z, duration: this.duration });
        await this.wait(this.duration);
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