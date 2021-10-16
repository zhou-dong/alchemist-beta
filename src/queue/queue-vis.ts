import gsap from "gsap";
import * as THREE from "three";
import Item from "./item";
import { Cube } from "../commons";
import Queue from "./queue";
import QueueAlgo from "./queue-algo";

export default class <T> implements Queue<T>, Cube {

    private items: Item<T>[];
    private queueAlgo: QueueAlgo<T>;

    private async playEnqueue(t: T): Promise<void> {
        const width = this.items.map(item => item.width).reduce((a, b) => a + b, 0);
        const item = new Item<T>(t);
        gsap.to(item.mesh.position, { x: this.x - width, y: this.y, z: this.z, duration: this.duration });
        this.items.push(item);
        await this.wait(this.duration);
        return Promise.resolve();
    }

    private async playDequeue(): Promise<void> {

        const first = this.items[0];
        if (!first) {
            return Promise.resolve();
        } else {
            gsap.to(first.mesh.position, { x: this.x + 100, y: this.y, z: this.z, duration: this.duration });
            await this.wait(this.duration);
            return Promise.resolve();
        }
    }

    private playPeek(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private playIsEmpty(): Promise<void> {
        throw new Error("Method not implemented.");
    }


    private playSize(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    width: number;
    height: number;
    depth: number;

    x: number;
    y: number;
    z: number;

    duration: number;

    private geometry: THREE.BoxGeometry;
    private material: THREE.Material;
    public mesh: THREE.Mesh;

    constructor(
        material: THREE.Material = new THREE.MeshBasicMaterial(),
        width: number = 1,
        height: number = 1,
        depth: number = 1,
        x: number = 1,
        y: number = 1,
        z: number = 1,
        duration: number = 0
    ) {
        this.queueAlgo = new QueueAlgo<T>();
        this.items = [];
        this.material = material;
        this.geometry = new THREE.BoxGeometry();
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.x = x;
        this.y = y;
        this.z = z;
        this.duration = duration;
    }

    async enqueue(t: T): Promise<number> {
        await this.playEnqueue(t);
        return this.queueAlgo.enqueue(t);
    }

    async dequeue(): Promise<T | undefined> {
        await this.playDequeue();
        return this.queueAlgo.dequeue();
    }

    async peek(): Promise<T | undefined> {
        await this.playPeek();
        return this.queueAlgo.peek();
    }

    async isEmpty(): Promise<boolean> {
        await this.playIsEmpty();
        return this.queueAlgo.isEmpty();
    }

    async size(): Promise<number> {
        await this.playSize();
        return this.queueAlgo.size();
    }

    private wait(duration: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, duration * 1000));
    }
}