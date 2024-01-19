import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useEffect, useState } from "react";
import * as THREE from "three";

const Enemy = React.forwardRef<RapierRigidBody>((_, ref) => {
    const enemyRef = React.useRef<THREE.Mesh>(null);
    const speed = 1.02;

    const [playerPosition, setPlayerPosition] = useState<THREE.Vector3>(new THREE.Vector3());

    useEffect(() => {
        if (ref && 'current' in ref) {
            const playerVector3 = ref.current!.translation();
            setPlayerPosition(new THREE.Vector3(playerVector3.x, playerVector3.y, playerVector3.z));
        }
    }, [ref]);

    useFrame(() => {
        if (enemyRef.current) {
            const distance = enemyRef.current.position.distanceTo(playerPosition);
            // console.log(playerPosition)
            if (distance < 5) {
                // console.log(playerPosition)
                const direction = new THREE.Vector3();
                direction.subVectors(playerPosition, enemyRef.current.position).normalize();
                enemyRef.current.position.add(direction.multiplyScalar(speed));
            }
        }
    });

    return (
        <>
            <RigidBody ref={ref} position={[4, 0.5, -10]} colliders="cuboid">
                <mesh ref={enemyRef}>
                    <boxGeometry />
                    <meshStandardMaterial color="red" />
                </mesh>
            </RigidBody>
        </>
    );
});

export default Enemy;
