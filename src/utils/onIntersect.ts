import * as THREE from "three";

export const onIntersect = (scene: THREE.Scene, raycaster: THREE.Raycaster) => {
  const intersections = raycaster.intersectObjects(scene.children, true);

  let filteredIntersections = intersections.filter(
    (obj) => (obj.object as THREE.Mesh).geometry instanceof THREE.BoxGeometry
  );

  if (filteredIntersections.length > 0) {
    const hitObject = filteredIntersections[0];

    scene.remove(hitObject.object);

    const hitMesh = hitObject.object as THREE.Mesh;
    if (hitMesh.geometry) hitMesh.geometry.dispose();
    if (hitMesh.material) {
      const material = hitMesh.material as THREE.MeshStandardMaterial;
      if (material.map) material.map.dispose();
      material.dispose();
    }
  }
};
