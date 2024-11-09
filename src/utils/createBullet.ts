import * as THREE from "three";

export const createBullet = (
  bulletMesh: THREE.Mesh,
  playerPosition: React.MutableRefObject<THREE.Vector3>,
  raycaster: THREE.Raycaster,
  rayWidthMultiplier: number,
): { bullet: THREE.Mesh; forward: THREE.Vector3 } => {
  const bullet = bulletMesh.clone();

  bullet.position.copy({
    x: playerPosition.current.x,
    y: playerPosition.current.y + 0.65,
    z: playerPosition.current.z + 1.0,
  } as THREE.Vector3);

  const forward = new THREE.Vector3(0, 0, -2).applyQuaternion(
    bullet.quaternion
  );

  forward.multiplyScalar(rayWidthMultiplier);
  raycaster.set(bullet.position, forward);
  // bullet.position.set(bullet.position.x, bullet.position.y, updatedBulletPos.current.z)

  console.log(bullet.position.z)
  raycaster.far = 6.4;

  return { bullet, forward };
};
