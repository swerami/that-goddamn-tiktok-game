import { useFrame } from "@react-three/fiber";
import React, { useEffect } from "react";
import * as THREE from "three"
import Floor from "./Floor";
import Player from "./Player";
import { RapierRigidBody } from "@react-three/rapier";
import Enemy from "./Enemy";

const World = () => {
    const [floors, setFloors] = React.useState<THREE.Vector3[]>()
    const playerRef = React.useRef<RapierRigidBody>(null!)

    useEffect(() => {

        const initFloors = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -10),
            new THREE.Vector3(0, 0, -20),
            new THREE.Vector3(0, 0, -30),
            new THREE.Vector3(0, 0, -40)
        ]
        setFloors(initFloors);
    }, [])


    const [currentFloorIndex, setCurrentFloorIndex] = React.useState(0);

    useFrame(() => {
        if (!playerRef.current) return;

        const playerZ = playerRef.current.translation().z;
        const newFloorIndex = Math.floor(-playerZ / 10);

        if (newFloorIndex !== currentFloorIndex && newFloorIndex > 0) {
            setCurrentFloorIndex(newFloorIndex);
            console.log(newFloorIndex, currentFloorIndex)

            const lastFloorZ = floors!.length > 0 ? floors![floors!.length - 1].z : 0;
            const newFloorPosition = new THREE.Vector3(0, 0, lastFloorZ - 10);

            setFloors(prev => {
                prev!.shift();
                return [...prev!, newFloorPosition];
            });
        }
    });


    return (
        <>
            <Enemy ref={playerRef} />
            {floors?.map((position, index) => (
                <Floor key={index} position={position} />
            ))}
            <Player ref={playerRef} />
        </>
    );
};

export default World;
