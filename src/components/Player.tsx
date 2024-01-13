import React from 'react';
import * as THREE from "three"
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from '../types/Controls';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Coordinates } from '../types/Coordinates';

const Player = React.forwardRef<RapierRigidBody>((_, ref) => {

    const [sub, get] = useKeyboardControls<Controls>()

    const [smoothCameraPosition] = React.useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothCameraTarget] = React.useState(() => new THREE.Vector3())
    const [currentUserLocation, setCurrentUserLocation] = React.useState<Coordinates>({ x: 0, y: 0, z: 0 });

    useFrame((state, delta) => {
        const { back, forward, left, right } = get()
        const impulse = { x: 0.001, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        if ('current' in ref! && ref.current) {
            const bodyOrigin = ref.current.translation();

            const impulseStrength = 16 * delta;
            const torqueStrength = 0.2 * delta;

            if (forward) {
                impulse.z -= impulseStrength
                torque.x -= torqueStrength
            }
            if (back) {
                impulse.z += impulseStrength
                torque.x += torqueStrength
            }
            if (left) {
                impulse.x -= impulseStrength
                torque.z += torqueStrength
            }
            if (right) {
                impulse.x += impulseStrength
                torque.z -= torqueStrength
            }

            ref?.current?.applyImpulse(impulse, true)
            ref?.current?.applyTorqueImpulse(torque, true)
            setCurrentUserLocation(ref?.current.translation())

            if (bodyOrigin) {
                const cameraPosition = new THREE.Vector3()
                cameraPosition.copy(bodyOrigin as THREE.Vector3)
                cameraPosition.z += 2.25
                cameraPosition.y += 0.80

                const cameraTarget = new THREE.Vector3()
                cameraTarget.copy(bodyOrigin as THREE.Vector3)
                cameraTarget.y += 0.25

                smoothCameraPosition.lerp(cameraPosition, 5 * delta)
                smoothCameraTarget.lerp(cameraTarget, 5 * delta)

                state.camera.position.copy(smoothCameraPosition)
                state.camera.lookAt(smoothCameraTarget)
            }

        }
        // mesh.current.position.set(Math.sin(state.clock.getElapsedTime()) * 1,0,0)
    })


    return <>
        <RigidBody
            type="dynamic"
            ref={ref}
            restitution={0.2}
            friction={1}
            linearDamping={0.5}
            angularDamping={0.5}
            colliders="cuboid"
            position={[0, 0.5, 0]}
        >
            <mesh>
                <boxGeometry />
                <meshBasicMaterial color={"red"} />
            </mesh>
        </RigidBody>
    </>;
});

export default Player;
