import * as THREE from "three";

export const createBullet = (
  bulletMesh: THREE.Mesh,
  playerPosition: React.MutableRefObject<THREE.Vector3>,
  raycaster: THREE.Raycaster,
  rayWidthMultiplier: number
): { bullet: THREE.Mesh; forward: THREE.Vector3 } => {
  const bullet = bulletMesh.clone();

  bullet.position.copy({
    x: playerPosition.current.x,
    y: playerPosition.current.y + 0.65,
    z: playerPosition.current.z - 1.1,
  } as THREE.Vector3);

  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
    bullet.quaternion
  );

  forward.multiplyScalar(rayWidthMultiplier);
  raycaster.set(bullet.position, forward);
  raycaster.far = 1.4;

  return { bullet, forward };
};
