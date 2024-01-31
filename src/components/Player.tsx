import React from 'react';
import * as THREE from "three"
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from '../types/Controls';
import { useFrame } from '@react-three/fiber';
import { BallCollider, RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Astronaut } from './Astronaut';
import { onIntersect, shoot, updateBullets } from '../utils';
import { handleThirdPersonCamera } from '../utils/handleThirdPlayerCamera';
import Enemy from './Enemy';

const Player = React.forwardRef<RapierRigidBody>((_, ref) => {
    const [, get] = useKeyboardControls<Controls>()

    const [playerPosition, setPlayerPosition] = React.useState<THREE.Vector3>(new THREE.Vector3())
    const [bullets, setBullets] = React.useState<THREE.Mesh[]>()
    const [raycaster] = React.useState(() => new THREE.Raycaster());
    const rayWidthMultiplier = 2

    const geometry = new THREE.SphereGeometry(0.1)
    const mat = new THREE.MeshStandardMaterial({ color: "red" })
    const bulletMesh = new THREE.Mesh(geometry, mat)

    const playerPositionRef = React.useRef<THREE.Vector3>(new THREE.Vector3());
    const smoothCameraPosition = React.useRef<THREE.Vector3>(new THREE.Vector3(10, 10, 10));
    const smoothCameraTarget = React.useRef<THREE.Vector3>(new THREE.Vector3());
    const shootingEnabled = React.useRef(true);


    useFrame((state, delta) => {
        const { forward, left, right } = get()
        const impulse = { x: 0.00000001, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }
        const maxSpeed = 14;

        if ('current' in ref! && ref.current) {
            const bodyOrigin = ref.current.translation();
            const currentVelocity = ref.current.linvel();

            const impulseStrength = 4 * delta;
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
                handleThirdPersonCamera(
                    bodyOrigin,
                    state,
                    delta,
                    ref,
                    setPlayerPosition,
                    playerPositionRef,
                    smoothCameraPosition,
                    smoothCameraTarget
                );
                shoot(bulletMesh, shootingEnabled, setBullets, playerPosition, raycaster, rayWidthMultiplier)
                if (bullets) {
                    updateBullets(state.scene, bullets, playerPosition, raycaster, rayWidthMultiplier)
                }
                onIntersect(state.scene, raycaster)
            }

        }
    })


    React.useEffect(() => {
        return () => {
            if (bullets) {
                bullets.forEach((mesh) => {
                    mesh.parent?.remove(mesh)
                    mesh.geometry.dispose()
                })
            }
        }
    }, [])

    return <>
        <RigidBody
            type="dynamic"
            ref={ref}
            restitution={0.1}
            friction={1}
            linearDamping={0.1}
            angularDamping={0.5}
            colliders={false}
            enabledRotations={[false, false, false]}
            position={[0, 0.1, 0]}
        >
            <Astronaut />
            <BallCollider

                position={[0, 0.0, 0]} args={[0.4]} />
        </RigidBody>
        <Enemy playerPosition={playerPosition} />
        {/* <mesh position={[-3, 0, -24]}>
            <boxGeometry args={[4, 4]} />
            <meshStandardMaterial color="blue" />
        </mesh>
        <mesh position={[3, 0, -224]}>
            <boxGeometry args={[4, 4]} />
            <meshStandardMaterial color="blue" />
        </mesh>
        <mesh position={[7, 0, -96]}>
            <boxGeometry args={[4, 4]} />
            <meshStandardMaterial color="blue" />
        </mesh>
        <mesh position={[-3, 0, -124]}>
            <boxGeometry args={[4, 4]} />
            <meshStandardMaterial color="blue" />
        </mesh> */}

        {bullets && bullets?.map((bullet, index) => (
            <primitive key={index} object={bullet} />
        ))}
    </>;
});

export default Player;
