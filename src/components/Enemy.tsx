import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

enum EnemyState {
  IDLE,
  CHASE,
  ATTACK,
}

const Enemy = ({
  playerPosition,
  hasBeenShot = 0,
}: {
  playerPosition: THREE.Vector3;
  hasBeenShot: number;
}) => {
  const rigidRef = useRef<RapierRigidBody>(null);
  const speed = 0.2;
  console.log("Enemy Mounted");
  const currentEnemyState = useRef<EnemyState>(EnemyState.CHASE);
  const playerIsInRange = useRef<boolean>(false);
  useFrame(() => {
    if (rigidRef.current) {
      const currentTranslation = rigidRef.current.translation();
      const enemyPosition = new THREE.Vector3(
        currentTranslation.x,
        currentTranslation.y,
        currentTranslation.z
      );
      const distance = enemyPosition.distanceTo(playerPosition);
      console.log(distance);
      if (distance < 425 && distance > 5) {
        playerIsInRange.current = true;
      } else {
        playerIsInRange.current = false;
        currentEnemyState.current = EnemyState.IDLE;
      }
      // console.log(distance);
      if (currentEnemyState.current === EnemyState.CHASE && playerIsInRange) {
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

  const randomPosition = (): THREE.Vector3 => {
    const randomX = Math.random() * 4;
    const randomZ = (Math.random() + 1) * 26;
    return new THREE.Vector3(randomX, 2.0, -randomZ);
  };

  return (
    <>
      <RigidBody
        ref={rigidRef}
        type="kinematicPosition"
        colliders="cuboid"
        position={randomPosition()}
        onCollisionEnter={(other) => {
          console.log(other.rigidBodyObject);
        }}
      >
        <Text position={[0, 3, 0]}>{hasBeenShot}</Text>
        <mesh>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Enemy;
