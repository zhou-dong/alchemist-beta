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

    constructor(
        queueMaterial: THREE.Material,
        nodeMaterial: THREE.Material,
        nodeTextMaterial: THREE.MeshPhongMaterial,
        nodeTextGeometryParameters: THREE.TextGeometryParameters,
        scene: THREE.Scene,
        duration: number = 0
    ) {
        super(new THREE.BoxGeometry(), queueMaterial, scene);
        this.nodeMaterial = nodeMaterial;
        this.nodeTextMaterial = nodeTextMaterial;
        this.nodeTextGeometryParameters = nodeTextGeometryParameters;
        this._scene = scene;
        this.items = new QueueAlgo<TextCube<T>>();
        this.duration = duration;
    }

    async enqueue(value: T): Promise<number> {
        const item = new TextCube<T>(
            value,
            this.nodeTextMaterial,
            this.nodeTextGeometryParameters,
            this.nodeMaterial,
            new THREE.BoxGeometry(),
            this._scene
        );
        await this.playEnqueue(item);
        return this.items.enqueue(item);
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

    private getItemsLength(): number {
        let result = 0;
        const iterator = this.items.iterator();
        while (iterator.hasNext()) {
            result += iterator.next().width;
        }
        return result;
    }

    private async playEnqueue(item: TextCube<T>): Promise<void> {
        const width = this.getItemsLength();
        const position = { x: item.x, y: item.y, z: item.z };
        item.show();
        gsap.to(position, { x: this.x - width, y: this.y, z: this.z, duration: this.duration });
        await this.wait(this.duration);
        return Promise.resolve();
    }

    private async playDequeue(item: TextCube<T>): Promise<void> {
        const position = { x: item.x, y: item.y, z: item.z };
        gsap.to(position, { x: this.x + 100, y: this.y, z: this.z, duration: this.duration });
        await this.wait(this.duration);
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