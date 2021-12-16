export interface NodeParams {
  width: number;
  height: number;
  depth: number;

  material: THREE.Material;

  textMaterial: THREE.Material;
  textGeometryParameters: THREE.TextGeometryParameters;

  initPosition: THREE.Vector3;
  textAdjust: THREE.Vector3;
}

export interface ShellParams {
  material: THREE.Material;
  position: THREE.Vector3;
  size: number;
}
