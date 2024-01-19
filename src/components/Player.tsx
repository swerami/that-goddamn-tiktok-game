import React from 'react';
import * as THREE from "three"
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from '../types/Controls';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Astronaut } from './Astronaut';

const Player = React.forwardRef<RapierRigidBody>((_, ref) => {

    const [, get] = useKeyboardControls<Controls>()

    const [playerPosition, setPlayerPosition] = React.useState<THREE.Vector3>(new THREE.Vector3())
    const [smoothCameraPosition] = React.useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothCameraTarget] = React.useState(() => new THREE.Vector3())

    const geometry = new THREE.BoxGeometry(2, 2)
    const mat = new THREE.MeshBasicMaterial({ color: "red" })
    const bulletMesh = new THREE.Mesh(geometry, mat)
    const playerPositionRef = React.useRef<THREE.Vector3>(new THREE.Vector3());

    const shootingEnabled = React.useRef(true);

    const [bullets, setBullets] = React.useState<THREE.Mesh[]>()

    const handleShooting = () => {
        if (shootingEnabled.current) {
            let bullet = bulletMesh.clone();
            bullet.position.set(playerPositionRef.current.x, playerPositionRef.current.y, playerPositionRef.current.z);

            setBullets((prevBullets) => (prevBullets ? [...prevBullets, bullet] : [bullet]));

            shootingEnabled.current = false;

            setTimeout(() => {
                shootingEnabled.current = true;
            }, 200);
        }
    }


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
                    // impulse.z -= impulseStrength;
                    // torque.x -= torqueStrength;
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
                const position = ref.current.translation();
                // console.log('player position', position)
                setPlayerPosition(new THREE.Vector3(position.x, position.y, position.z))
                playerPositionRef.current.set(position.x, position.y, position.z);

                // Bullet needs
                // SpawnPosition (current player position)
                // forceMultiplier
                // Bullet is very fast but becomes slow within time
                // we need rays 



                console.log(bullets)
                handleShooting()
                updateBullets()
            }



        }
    })


    const updateBullets = () => {
        if (bullets) {
            bullets.forEach((mesh, i) => {
                mesh.position.z -= 0.25
                if (mesh.position.z < playerPosition.z - 30) {
                    mesh.parent?.remove(mesh)
                    mesh.geometry.dispose()
                    bullets.splice(i, 1)
                }
            })

        }
    }

    React.useEffect(() => {
        // handleShooting()

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
            <CuboidCollider position={[0, 0.0, 0]} args={[0.5, 0.1, 0.4]} />
        </RigidBody>

        {bullets && bullets?.map((bullet, index) => (
            <primitive key={index} object={bullet} />
        ))}
        {/* {handleShooting()} */}
    </>;
});

export default Player;
