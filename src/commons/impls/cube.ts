import * as THREE from "three";
import { Cube as ICube } from "../cube";

export class Cube implements ICube {

    private geometry: THREE.BoxGeometry;
    private material: THREE.Material;
    public mesh: THREE.Mesh;

    constructor(
        geometry: THREE.BoxGeometry = new THREE.BoxGeometry(),
        material: THREE.Material = new THREE.MeshBasicMaterial()
    ) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    public get x(): number {
        return this.mesh.position.x;
    }

    public set x(v: number) {
        this.mesh.position.setX(v);
    }

    public get y(): number {
        return this.mesh.position.y;
    }

    public set y(v: number) {
        this.mesh.position.setY(v);
    }

    public get z(): number {
        return this.mesh.position.z;
    }

    public set z(v: number) {
        this.mesh.position.setZ(v);
    }

    public get width(): number {
        return this.geometry.parameters.width;
    }

    public set width(v: number) {
        this.mesh.scale.setX(v);
    }

    public get height(): number {
        return this.geometry.parameters.height;
    }

    public set height(v: number) {
        this.mesh.scale.setY(v);
    }

    public get depth(): number {
        return this.geometry.parameters.depth;
    }

    public set depth(v: number) {
        this.mesh.scale.setZ(v);
    }

}
