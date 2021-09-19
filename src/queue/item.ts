import * as THREE from "three";
import { Container } from "../commons";

type Item<T> = { value: T } & Container;

export default class <T> implements Item<T> {

    private _value: T;

    private geometry: THREE.BoxGeometry;
    private material: THREE.Material;
    public mesh: THREE.Mesh;

    constructor(value: T, material: THREE.Material) {
        this._value = value;
        this.material = material;
        this.geometry = new THREE.BoxGeometry();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    public get value(): T {
        return this._value;
    }

    public set value(v: T) {
        this._value = v;
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

};
