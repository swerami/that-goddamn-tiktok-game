import * as THREE from "three";

export const updateBullets = (
  scene: THREE.Scene,
  bullets: THREE.Mesh[],
  playerPosition: React.MutableRefObject<THREE.Vector3>,
  raycaster: THREE.Raycaster,
  rayWidthMultiplier: number
) => {
  if (bullets.length > 0) {
    bullets.forEach((bullet, i) => {
      bullet.position.z -= 0.55;
      if (bullet.position.z < playerPosition.current.z - 30) {
        scene.remove(bullet);
        bullet.parent?.remove(bullet);
        bullet.geometry.dispose();
        bullets.splice(i, 1);
      } else {
        const bulletForward = new THREE.Vector3(0, 0, -1).applyQuaternion(
          bullet.quaternion
        );
        bulletForward.multiplyScalar(rayWidthMultiplier);
        raycaster.set(bullet.position, bulletForward);

        const intersections = raycaster.intersectObjects(scene.children, true);
        const  filteredIntersections = intersections.filter(
          (obj) =>
            (obj.object as THREE.Mesh).geometry instanceof THREE.BoxGeometry
        );

        if (filteredIntersections.length > 0) {
          const hitObject = filteredIntersections[0];

          scene.remove(hitObject.object);

          const hitMesh = hitObject.object as THREE.Mesh;
          if (hitMesh.geometry) hitMesh.geometry.dispose();
        }
      }
    });
  }
};
