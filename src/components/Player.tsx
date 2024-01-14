import React from 'react';
import * as THREE from "three"
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from '../types/Controls';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Coordinates } from '../types/Coordinates';
import { Astronaut } from './Astronaut';

const Player = React.forwardRef<RapierRigidBody>((_, ref) => {

    const [sub, get] = useKeyboardControls<Controls>()

    const [smoothCameraPosition] = React.useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothCameraTarget] = React.useState(() => new THREE.Vector3())

    useFrame((state, delta) => {
        const { back, forward, left, right } = get()
        const impulse = { x: 0.0004, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }
        const maxSpeed = 14;

        if ('current' in ref! && ref.current) {
            const bodyOrigin = ref.current.translation();
            const currentVelocity = ref.current.linvel();

            const impulseStrength = 15 * delta;
            const torqueStrength = 0.02 * delta;

            if (currentVelocity.z > -maxSpeed) {
                if (!forward) {
                    impulse.z -= impulseStrength;
                    torque.x -= torqueStrength;
                }
            }

            if (left) {
                impulse.x = currentVelocity.x > -maxSpeed ? impulse.x - impulseStrength : impulseStrength
                torque.z += torqueStrength
            }
            if (right) {
                impulse.x = currentVelocity.x > -maxSpeed ? impulse.x + impulseStrength : impulseStrength
                torque.z -= torqueStrength
            }

            ref?.current?.applyImpulse(impulse, true)
            ref?.current?.applyTorqueImpulse(torque, true)

            if (bodyOrigin) {
                const cameraPosition = new THREE.Vector3()
                cameraPosition.copy(bodyOrigin as THREE.Vector3)
                cameraPosition.z += 3.25
                cameraPosition.y += 2.20

                const cameraTarget = new THREE.Vector3()
                cameraTarget.copy(bodyOrigin as THREE.Vector3)
                cameraTarget.z -= 5.25

                smoothCameraPosition.lerp(cameraPosition, 12 * delta)
                smoothCameraTarget.lerp(cameraTarget, 12 * delta)

                state.camera.position.copy(smoothCameraPosition)
                state.camera.lookAt(smoothCameraTarget)
            }

        }
    })


    return <>
        <RigidBody
            type="dynamic"
            ref={ref}
            restitution={0.1}
            friction={1}
            linearDamping={0.1}
            angularDamping={0.5}
            colliders="hull"
            enabledRotations={[false, false, false]}
            position={[0, 0.5, 0]}
        >
            <Astronaut />
        </RigidBody>
    </>;
});

export default Player;
