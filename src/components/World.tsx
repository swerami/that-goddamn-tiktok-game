import { useFrame } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";
import Player from "./Player";
import Enemy from "./Enemy";

const World = () => {
  const geom = React.useMemo(() => new THREE.BoxGeometry(20, 10), []);
  const mat = React.useMemo(() => new THREE.MeshBasicMaterial(), []);

  const playerRef = React.useRef<THREE.Group>(null!);
  const playerPositionRef = React.useRef<THREE.Vector3>(new THREE.Vector3());
  const [floors, setFloors] = React.useState<THREE.Vector3[]>();

  // enemy
  const enemies = React.useRef<THREE.Mesh[]>([]);

  React.useEffect(() => {
    const initFloors = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, -20),
      new THREE.Vector3(0, 0, -30),
      new THREE.Vector3(0, 0, -40),
    ];
    setFloors(initFloors);
  }, []);

  const [currentFloorIndex, setCurrentFloorIndex] = React.useState(0);

  useFrame(() => {
    if (!playerRef.current) return;
    const bodyOrigin = playerRef.current.position;

    playerPositionRef.current.copy(
      new THREE.Vector3(bodyOrigin.x, bodyOrigin.y, bodyOrigin.z)
    );

    const playerZ = playerRef.current.position.z;
    const newFloorIndex = Math.floor(-playerZ / 10);

    if (newFloorIndex !== currentFloorIndex && newFloorIndex > 0) {
      setCurrentFloorIndex(newFloorIndex);
      console.log(newFloorIndex, currentFloorIndex);

      const lastFloorZ = floors!.length > 0 ? floors![floors!.length - 1].z : 0;
      const newFloorPosition = new THREE.Vector3(0, 0, lastFloorZ - 10);

      setFloors((prev) => [...prev!.slice(1), newFloorPosition]);
    }
  });
  return (
    <>
      {floors?.map((position, index) => (
        <mesh
          geometry={geom}
          rotation={[-Math.PI / 2, 0, 0]}
          material={mat}
          key={position.z + index}
          position={[position.x, position.y, position.z]}
        />
      ))}
      <Player
        ref={playerRef}
        playerPositionRef={playerPositionRef}
        enemies={enemies}
      />
      <Enemy ref={playerPositionRef} enemies={enemies} />
    </>
  );
};

export default World;
