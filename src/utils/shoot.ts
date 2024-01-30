import * as THREE from "three";
import { createBullet } from ".";

export const shoot = (
  bulletMesh: THREE.Mesh,
  shootingEnabled: React.MutableRefObject<boolean>,
  setBullets: React.Dispatch<React.SetStateAction<THREE.Mesh[] | undefined>>,
  playerPosition: THREE.Vector3,
  raycaster: THREE.Raycaster,
  rayWidthMultiplier: number
) => {
  if (shootingEnabled.current) {
    let { bullet } = createBullet(
      bulletMesh,
      playerPosition,
      raycaster,
      rayWidthMultiplier
    );

    setBullets((prevBullets) =>
      prevBullets ? [...prevBullets, bullet] : [bullet]
    );
    console.log(shootingEnabled);

    // avoid creating bullet per frame
    shootingEnabled.current = false;
    console.log(shootingEnabled);

    setTimeout(() => {
      shootingEnabled.current = true;
      // scene.remove(arrowHelper);
    }, 200);
  }
};
