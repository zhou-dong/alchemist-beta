import gsap from "gsap";
import THREE from "three";
import Queue from "./abstract-queue";
import item from "./item";

export default class <T> extends Queue<T> {

    width: number;
    height: number;
    depth: number;

    x: number;
    y: number;
    z: number;

    duraion: number;

    private geometry: THREE.BoxGeometry;
    private material: THREE.Material;
    public mesh: THREE.Mesh;

    constructor(material: THREE.Material) {
        super();
        this.material = material;
        this.geometry = new THREE.BoxGeometry();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    private wait(duration: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    protected async playEnqueue(item: item<T>): Promise<void> {
        const width = this.items.map(item => item.width).reduce((a, b) => a + b, 0);
        gsap.to(item.mesh.position, { x: this.x - width, y: this.y, z: this.z, duration: this.duraion });
        return await this.wait(this.duraion);
    }

    protected async playDequeue(): Promise<void> {
        const first = this.items[0];
        if (!first) {
            return new Promise(() => { });
        } else {
            gsap.to(first.mesh.position, { x: this.x + 100, y: this.y, z: this.z, duration: this.duraion });
            return await this.wait(this.duraion);
        }
    }

}