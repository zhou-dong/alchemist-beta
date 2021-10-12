import * as THREE from "three";
import { Cube } from "./cube";
import { TextCube as ITextCube } from "../test-cube";

export class TextCube<T> extends Cube implements ITextCube<T> {
    private _value: T;

    private textGeometry: THREE.TextGeometry;
    private textMaterial: THREE.MeshPhongMaterial;
    public textMesh: THREE.Mesh;

    constructor(
        value: T,
        material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial(),
        geometryParameters: THREE.TextGeometryParameters
    ) {
        super();
        this._value = value;
        this.textMaterial = material;
        this.textGeometry = new THREE.TextGeometry(value + "", geometryParameters);
        this.textMesh = new THREE.Mesh(this.textGeometry, this.textMaterial);
    }

    public get value(): T {
        return this._value;
    }

    public get textX(): number {
        return this.textMesh.position.x;
    }

    public set textX(v: number) {
        this.textMesh.position.setX(v);
    }

    public get textY(): number {
        return this.textMesh.position.y;
    }

    public set textY(v: number) {
        this.textMesh.position.setY(v);
    }

    public get textZ(): number {
        return this.textMesh.position.z;
    }

    public set textZ(v: number) {
        this.textMesh.position.setZ(v);
    }
}
