import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React from "react";
import * as THREE from "three";

const Enemy = ({ playerPosition }: { playerPosition: THREE.Vector3 }) => {
  const enemyRef = React.useRef<THREE.Mesh>(null);
  const speed = 0.2;

  useFrame(() => {
    if (enemyRef.current) {
      const distance = enemyRef.current.position.distanceTo(playerPosition);
      // console.log(playerPosition)
      if (distance < 425) {
        // console.log(playerPosition)
        const direction = new THREE.Vector3();
        direction
          .subVectors(playerPosition, enemyRef.current.position)
          .normalize();
        enemyRef.current.position.add(direction.multiplyScalar(speed));
      }
    }
  });

  return (
    <>
      {/* <RigidBody position={[4, 0.5, -10]} colliders="cuboid"> */}
      <mesh ref={enemyRef} position={[3, 0, -30]}>
        <boxGeometry args={[4, 4]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      {/* </RigidBody> */}
    </>
  );
};

export default Enemy;
