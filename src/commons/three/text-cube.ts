import * as THREE from "three";
import { Cube } from "./cube";
import { TextCube as ITextCube } from "../text-cube";

export class TextCube<T> extends Cube implements ITextCube<T> {

    private _value: T;
    private textGeometry: THREE.TextGeometry;
    private textMaterial: THREE.MeshPhongMaterial;
    private textMesh: THREE.Mesh;
    private _scene: THREE.Scene;

    constructor(
        value: T,
        textMaterial: THREE.MeshPhongMaterial,
        textGeometryParameters: THREE.TextGeometryParameters,
        cubeMaterial: THREE.Material,
        cubeGeometry: THREE.BoxGeometry,
        scene: THREE.Scene
    ) {
        super(cubeGeometry, cubeMaterial, scene);
        this._value = value;
        this.textMaterial = textMaterial;
        this.textGeometry = new THREE.TextGeometry(value + "", textGeometryParameters);
        this.textMesh = new THREE.Mesh(this.textGeometry, this.textMaterial);
        this._scene = scene;
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

    public show(): void {
        super.show();
        this._scene.add(this.textMesh);
    }

    public hide(): void {
        super.hide();
        this._scene.remove(this.textMesh);
    }
}
