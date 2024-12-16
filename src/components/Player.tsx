import React from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../types/Controls";
import { useFrame } from "@react-three/fiber";
import { Astronaut } from "./Astronaut";
import { handleThirdPersonCamera } from "../utils/handleThirdPlayerCamera";

const Player = React.memo(
  React.forwardRef<THREE.Group>((_, ref) => {
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

    // enemy
    const enemies = React.useRef<THREE.Mesh[]>([]);
    const enemyRef = React.useRef<THREE.Mesh>(null!);
    const boxWidth = 1.0;

    const playerPositionRef = React.useRef<THREE.Vector3>(new THREE.Vector3());
    const smoothCameraPosition = React.useRef<THREE.Vector3>(
      new THREE.Vector3(10, 10, 10)
    );
    const smoothCameraTarget = React.useRef<THREE.Vector3>(new THREE.Vector3());

    // shooting trigger
    const shootingEnabled = React.useRef(true);

    const handleShoot = (scene: THREE.Scene) => {
      const bullet = bulletMesh.clone();
      bullet.position.copy({
        x: playerPositionRef.current.x,
        y: playerPositionRef.current.y + 0.65,
        z: playerPositionRef.current.z - 0.5,
      } as THREE.Vector3);

      bulletsRef.current.push({ mesh: bullet, hit: false });
      scene.add(bullet);
    };

    const enemyBox = new THREE.BoxGeometry(boxWidth, 3.0);
    const enemyMat = new THREE.MeshBasicMaterial({ color: "red" });
    const spawnEnemyBool = React.useRef<boolean>(true);
    const spawnEnemy = (scene: THREE.Scene): void => {
      const playerPos = playerPositionRef.current;
      const randomX = Math.random() * 10 - 5;
      const randomZ = playerPos.z - 40 - Math.random() * 7;
      const enemy = new THREE.Mesh(enemyBox.clone(), enemyMat.clone());
      enemy.position.x = randomX;
      enemy.position.z = randomZ;
      enemies.current.push(enemy);
      scene.add(enemy);
    };

    console.log("Player Component Mounted");
    useFrame((state, delta) => {
      const { forward, left, right } = get();
      // console.log("arr length", bulletsRef.current.length);
      // console.log(bulletsRef.current.length);

      if ("current" in ref! && ref.current) {
        const bodyOrigin = ref.current.position;

        if (!forward) {
          bodyOrigin.z -= delta * 15;
        }

        // console.log(playerPositionRef.current.x);
        if (left && bodyOrigin.x > -9.5) {
          bodyOrigin.x -= delta * 10;
        }
        if (right && bodyOrigin.x < 9.5) {
          bodyOrigin.x += delta * 10;
        }

        // setInterval(() => spawnEnemy(state.scene), 10000);
        // spawnEnemy(state.scene);

        if (spawnEnemyBool.current) {
          spawnEnemyBool.current = false;
          spawnEnemy(state.scene);
          setTimeout(() => (spawnEnemyBool.current = true), 1000);
        }

        if (enemies.current) {
          enemies.current.forEach((enemy, i) => {
            enemy.position.z += 2 * delta;
            if (enemy.position.z > playerPositionRef.current.z + 10) {
              enemies.current.splice(i, 1);
              state.scene.remove(enemy);
            }
          });
        }

        if (bodyOrigin) {
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
            setTimeout(() => (shootingEnabled.current = true), 5200);
          }
          if (bulletsRef.current) {
            bulletsRef.current.forEach((bulletData, i) => {
              let { mesh: bullet, hit } = bulletData;
              bullet.position.z -= 0.5;
              enemies.current.forEach((enemy) => {
                const enemyX = enemy.position.x;
                const enemyZ = enemy.position.z;
                if (
                  enemyX >= bullet.position.x - boxWidth / 2 &&
                  enemyX <= bullet.position.x + boxWidth / 2 &&
                  enemyZ >= bullet.position.z - boxWidth / 2 &&
                  enemyZ <= bullet.position.z + boxWidth / 2
                ) {
                  hit = true;
                  if (hit) {
                    state.scene.remove(bullet);
                    bulletsRef.current.splice(i, 1);
                    console.log("enemy hit");
                  }
                }
              });

              if (bullet.position.z < playerPositionRef.current.z - 50) {
                state.scene.remove(bullet);
                bulletsRef.current.splice(i, 1);
              }
            });
          }
        }
      }
    });

    return (
      <>
        <Astronaut ref={ref} />

        <mesh ref={enemyRef} position={[-1, 0, -9]}>
          <boxGeometry args={[boxWidth, 5.0]} />
          <meshStandardMaterial color={"blue"} />
        </mesh>
      </>
    );
  })
);

export default Player;
