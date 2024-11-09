import * as THREE from "three";

export const onIntersect = (scene: THREE.Scene, raycaster: THREE.Raycaster) => {
  const intersections = raycaster.intersectObjects(scene.children, true);
  
  const filteredIntersections = intersections.filter(
    (obj) => (obj.object as THREE.Mesh).geometry instanceof THREE.BoxGeometry
  );
  // console.log(raycaster)
  if (filteredIntersections.length > 0) {
    const hitObject = filteredIntersections[0];
    
    // console.log("hit", hitObject);
    const hitMesh = hitObject.object as THREE.Mesh;
    
    scene.remove(hitObject.object);

    if (hitMesh.geometry) hitMesh.geometry.dispose();
    if (hitMesh.material) {
      const material = hitMesh.material as THREE.MeshStandardMaterial;
      if (material.map) material.map.dispose();
      material.dispose();
    }
    
    return hitObject.object;
  }
  // console.log('no intersections found')
  // no intersections found 
  return undefined;
};
