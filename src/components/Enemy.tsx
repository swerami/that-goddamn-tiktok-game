import { useFrame } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";

interface EnemyProps {
  enemies: React.MutableRefObject<THREE.Mesh[]>;
}

const Enemy = React.forwardRef<THREE.Vector3, EnemyProps>(
  ({ enemies }, playerPositionRef) => {
    const boxWidth = 1.0;
    const enemyBox = new THREE.BoxGeometry(boxWidth, 3.0);
    const enemyMat = new THREE.MeshBasicMaterial({ color: "red" });
    const spawnEnemyBool = React.useRef<boolean>(true);

    const spawnEnemy = (scene: THREE.Scene): void => {
      if ("current" in playerPositionRef! && playerPositionRef.current) {
        const playerPos = playerPositionRef.current;
        const randomX = Math.random() * 10 - 5;
        const randomZ = playerPos.z - 40 - Math.random() * 7;
        const enemy = new THREE.Mesh(enemyBox.clone(), enemyMat.clone());
        enemy.position.x = randomX;
        enemy.position.z = randomZ;
        enemies.current.push(enemy);
        scene.add(enemy);
      }
    };

    useFrame((state, delta) => {
      // enemy spawner
      if (spawnEnemyBool.current) {
        spawnEnemyBool.current = false;
        spawnEnemy(state.scene);
        setTimeout(() => (spawnEnemyBool.current = true), 300);
      }

      // control enemy movement
      if (
        "current" in playerPositionRef! &&
        playerPositionRef.current &&
        enemies.current
      ) {
        enemies.current.forEach((enemy, i) => {
          enemy.position.z += 2 * delta;
          if (enemy.position.z > playerPositionRef!.current!.z + 10) {
            enemies.current.splice(i, 1);
            state.scene.remove(enemy);
          }
        });
      }
    });

    return <></>;
  }
);

export default Enemy;
