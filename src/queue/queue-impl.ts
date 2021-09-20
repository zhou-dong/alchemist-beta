import gsap from "gsap";
import * as THREE from "three";
import Queue from "./queue";
import item from "./item";

export default class <T> extends Queue<T> {

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
        super();

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

    private wait(duration: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    protected async playEnqueue(item: item<T>): Promise<void> {
        const width = this.items.map(item => item.width).reduce((a, b) => a + b, 0);
        gsap.to(item.mesh.position, { x: this.x - width, y: this.y, z: this.z, duration: this.duration });
        await this.wait(this.duration);
        return Promise.resolve();
    }

    protected async playDequeue(): Promise<void> {
        const first = this.items[0];
        if (!first) {
            return Promise.resolve();
        } else {
            gsap.to(first.mesh.position, { x: this.x + 100, y: this.y, z: this.z, duration: this.duration });
            await this.wait(this.duration);
            return Promise.resolve();
        }
    }

}