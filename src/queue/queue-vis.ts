import gsap from "gsap";
import * as THREE from "three";
import { Cube, TextCube } from "../commons/three";
import Queue from "./queue";
import QueueAlgo from "./queue-algo";

export default class <T> extends Cube implements Queue<T> {

    private items: QueueAlgo<TextCube<T>>;

    private _scene: THREE.Scene;
    private duration: number;
    private nodeMaterial: THREE.Material;
    private nodeTextMaterial: THREE.MeshPhongMaterial;
    private nodeTextGeometryParameters: THREE.TextGeometryParameters;

    private queueInitSize: number;
    private nodeWidth: number;
    private nodeHeight: number;
    private nodeDepth: number;

    constructor(
        queueMaterial: THREE.Material,
        nodeMaterial: THREE.Material,
        nodeTextMaterial: THREE.MeshPhongMaterial,
        nodeTextGeometryParameters: THREE.TextGeometryParameters,
        scene: THREE.Scene,
        duration: number = 0,
        queueInitSize: number = 5,
        nodeWidth: number = 1,
        nodeHeight: number = 1,
        nodeDepth: number = 1
    ) {
        super(new THREE.BoxGeometry(), queueMaterial, scene);
        this.nodeMaterial = nodeMaterial;
        this.nodeTextMaterial = nodeTextMaterial;
        this.nodeTextGeometryParameters = nodeTextGeometryParameters;
        this._scene = scene;
        this.items = new QueueAlgo<TextCube<T>>();
        this.duration = duration;

        // set node width, height and depth
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.nodeDepth = nodeDepth;

        // set queue width, height and depth
        this.queueInitSize = queueInitSize;
        this.width = queueInitSize * nodeWidth;
        this.height = nodeHeight;
        this.depth = nodeDepth;
    }

    async enqueue(value: T): Promise<number> {
        const item = this.createItem(value);
        await this.playEnqueue(item);
        await this.updateQueueWidth();
        return this.items.enqueue(item);
    }

    private createItem(value: T): TextCube<T> {
        const item = new TextCube<T>(
            value,
            this.nodeTextMaterial,
            this.nodeTextGeometryParameters,
            this.nodeMaterial,
            new THREE.BoxGeometry(),
            this._scene
        );
        item.width = this.nodeWidth;
        item.height = this.nodeHeight;
        item.depth = this.nodeDepth;
        return item;
    }

    private async updateQueueWidth() {
        const queueSize: number = await this.items.size();
        if (queueSize < this.queueInitSize) {
            this.width = this.queueInitSize * this.nodeWidth;
        } else {
            this.width = queueSize * this.nodeWidth;
        }
    }

    async dequeue(): Promise<T | undefined> {
        const item = await this.items.dequeue();
        if (item) {
            await this.playDequeue(item);
            await this.updateQueueWidth();
            return Promise.resolve(item.value)
        } else {
            await this.updateQueueWidth();
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
        let result = 0;
        const iterator = this.items.iterator();
        while (iterator.hasNext()) {
            result += iterator.next().width;
        }
        return result;
    }

    private async playEnqueue(item: TextCube<T>): Promise<void> {
        const width = this.sumItemsWidth();
        item.show();
        gsap.to(item.mesh.position, { x: this.x - width, y: this.y, z: this.z, duration: this.duration });
        await this.wait(this.duration);
        return Promise.resolve();
    }

    private async playDequeue(item: TextCube<T>): Promise<void> {
        gsap.to(item.mesh.position, { x: this.x + 10, y: this.y, z: this.z, duration: this.duration });
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