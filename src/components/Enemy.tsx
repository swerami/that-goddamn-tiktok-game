import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import * as THREE from "three";

enum EnemyState {
  IDLE,
  CHASE,
  ATTACK,
}

const Enemy = ({ playerPosition }: { playerPosition: THREE.Vector3 }) => {
  const rigidRef = useRef<any>(null);
  const speed = 0.2;
  const [currentEnemyState, setCurrentEnemyState] = useState(EnemyState.CHASE);
  const [playerIsInRange, setPlayerIsInRange] = useState(false);
  useFrame(() => {
    if (rigidRef.current) {
      const currentTranslation = rigidRef.current.translation();
      const enemyPosition = new THREE.Vector3(
        currentTranslation.x,
        currentTranslation.y,
        currentTranslation.z
      );
      const distance = enemyPosition.distanceTo(playerPosition);

      if (distance < 425 && distance > 5) {
        setPlayerIsInRange(true);
      } else {
        setPlayerIsInRange(false);
      }

      if (currentEnemyState === EnemyState.CHASE && playerIsInRange) {
        const direction = new THREE.Vector3();
        direction.subVectors(playerPosition, enemyPosition).normalize();
        const newPosition = enemyPosition.add(direction.multiplyScalar(speed));

        rigidRef.current.setNextKinematicTranslation({
          x: newPosition.x,
          y: currentTranslation.y, // Keep the y-axis as it is
          z: newPosition.z,
        });
      }
    }
  });

  return (
    <>
      <RigidBody
        ref={rigidRef}
        type="kinematicPosition"
        colliders="cuboid"
        position={[3, 2.0, -30]}
      >
        <mesh>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Enemy;
