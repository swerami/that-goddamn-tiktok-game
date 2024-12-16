import React from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../types/Controls";
import { useFrame } from "@react-three/fiber";
import { Astronaut } from "./Astronaut";
import { handleThirdPersonCamera } from "../utils/handleThirdPlayerCamera";

interface PlayerProps {
  playerPositionRef: React.MutableRefObject<THREE.Vector3>;
  enemies: React.MutableRefObject<THREE.Mesh[]>;
}

const Player = React.memo(
  React.forwardRef<THREE.Group, PlayerProps>(
    ({ playerPositionRef, enemies }, ref) => {
      const [, get] = useKeyboardControls<Controls>();
      const bulletsRef = React.useRef<{ mesh: THREE.Mesh; hit: boolean }[]>([]);
      const geometry = React.useMemo(() => new THREE.SphereGeometry(0.1), []);
      const mat = React.useMemo(
        () => new THREE.MeshStandardMaterial({ color: "red" }),
        []
      );
      const bulletMesh = React.useMemo(
        () => new THREE.Mesh(geometry, mat),
        [geometry, mat]
      );

      const smoothCameraPosition = React.useRef<THREE.Vector3>(
        new THREE.Vector3(10, 10, 10)
      );
      const smoothCameraTarget = React.useRef<THREE.Vector3>(
        new THREE.Vector3()
      );

      // shooting trigger
      const shootingEnabled = React.useRef(true);

      const handleShoot = (scene: THREE.Scene) => {
        const bullet = bulletMesh.clone();
        if ("current" in playerPositionRef! && playerPositionRef.current) {
          bullet.position.copy({
            x: playerPositionRef.current.x,
            y: playerPositionRef.current.y + 0.65,
            z: playerPositionRef.current.z - 0.5,
          } as THREE.Vector3);

          bulletsRef.current.push({ mesh: bullet, hit: false });
          scene.add(bullet);
        }
      };

      console.log("Player Component Mounted");
      useFrame((state, delta) => {
        const { forward, left, right } = get();

        if ("current" in ref! && ref.current) {
          const bodyOrigin = ref.current.position;

          if (!forward) {
            bodyOrigin.z -= delta * 15;
          }

          if (left && bodyOrigin.x > -9.5) {
            bodyOrigin.x -= delta * 10;
          }
          if (right && bodyOrigin.x < 9.5) {
            bodyOrigin.x += delta * 10;
          }

          if (
            bodyOrigin &&
            "current" in playerPositionRef! &&
            playerPositionRef.current
          ) {
            playerPositionRef.current.copy(
              new THREE.Vector3(bodyOrigin.x, bodyOrigin.y, bodyOrigin.z)
            );
            handleThirdPersonCamera(
              bodyOrigin,
              state,
              delta,
              ref,
              playerPositionRef,
              smoothCameraPosition,
              smoothCameraTarget
            );

            if (shootingEnabled.current) {
              handleShoot(state.scene);
              shootingEnabled.current = false;
              setTimeout(() => (shootingEnabled.current = true), 200);
            }
            if (bulletsRef.current) {
              bulletsRef.current.forEach((bulletData, i) => {
                const { mesh: bullet } = bulletData;
                bullet.position.z -= 0.5;
                enemies.current.forEach((enemy, j) => {
                  const enemyX = enemy.position.x;
                  const enemyZ = enemy.position.z;
                  if (
                    // the value: 1 should become a variable
                    enemyX >= bullet.position.x - 1 / 2 &&
                    enemyX <= bullet.position.x + 1 / 2 &&
                    enemyZ >= bullet.position.z - 1 / 2 &&
                    enemyZ <= bullet.position.z + 1 / 2
                  ) {
                    bulletData.hit = true;
                    if (bulletData.hit) {
                      console.log("removing bullet:", i);
                      state.scene.remove(enemy);
                      enemies.current.splice(j, 1);

                      state.scene.remove(bullet);
                      bulletsRef.current.splice(i, 1);
                    }
                  }
                });

                if (bullet.position.z < playerPositionRef.current.z - 50) {
                  bulletsRef.current.splice(i, 1);
                  state.scene.remove(bullet);
                }
              });
            }
          }
        }
      });

      return (
        <>
          <Astronaut ref={ref} />
        </>
      );
    }
  )
);

export default Player;
