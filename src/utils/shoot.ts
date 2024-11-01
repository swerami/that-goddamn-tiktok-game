import * as THREE from "three";
import { createBullet } from ".";

export const shoot = (
  bulletMesh: THREE.Mesh,
  shootingEnabled: React.MutableRefObject<boolean>,
  bulletRef: React.MutableRefObject<THREE.Mesh[]>,
  playerPosition: React.MutableRefObject<THREE.Vector3>,
  raycaster: THREE.Raycaster,
  rayWidthMultiplier: number
) => {
  if (shootingEnabled.current) {
    const { bullet } = createBullet(
      bulletMesh,
      playerPosition,
      raycaster,
      rayWidthMultiplier
    );

    bulletRef.current = [...bulletRef.current, bullet]
    // console.log(shootingEnabled);

    // avoid creating bullet per frame
    shootingEnabled.current = false;

    setTimeout(() => {
      shootingEnabled.current = true;
      // scene.remove(arrowHelper);
    }, 200);
  }
};
