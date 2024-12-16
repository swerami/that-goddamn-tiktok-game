import { useFrame } from "@react-three/fiber";
import React from "react";
import * as THREE from "three";
import Player from "./Player";

const World = () => {
  // const floors: React.MutableRefObject<THREE.Vector3[]> = React.useRef<
  //   THREE.Vector3[]
  // >([
  //   new THREE.Vector3(0, 0, 0),
  //   new THREE.Vector3(0, 0, -10),
  //   new THREE.Vector3(0, 0, -20),
  //   new THREE.Vector3(0, 0, -30),
  //   new THREE.Vector3(0, 0, -40),
  // ]);
  const geom = React.useMemo(() => new THREE.BoxGeometry(20, 10), []);
  const mat = React.useMemo(() => new THREE.MeshBasicMaterial(), []);
  // console.log("world mounted");
  // console.log(floors);
  // const currentFloorIndex = React.useRef(0);
  const playerRef = React.useRef<THREE.Group>(null!);
  const [floors, setFloors] = React.useState<THREE.Vector3[]>();

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
  // useFrame(() => {
  //   // console.log(floors);
  //   if (!playerRef.current) return;

  //   const playerZ = playerRef.current.position.z;
  //   const newFloorIndex = Math.floor(-playerZ / 10);

  //   if (newFloorIndex !== currentFloorIndex.current && newFloorIndex > 0) {
  //     console.log(newFloorIndex, currentFloorIndex);
  //     currentFloorIndex.current = newFloorIndex;

  //     const lastFloorZ =
  //       floors!.current.length > 0
  //         ? floors.current![floors!.current.length - 1].z
  //         : 0;
  //     const newFloorPosition = new THREE.Vector3(0, 0, lastFloorZ - 10);

  //     floors?.current.push(newFloorPosition);
  //     floors?.current.shift();
  //   }
  // });
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
      <Player ref={playerRef} />
    </>
  );
  // return (
  //   <>
  //     {floors?.current.map((position, index) => (
  //       <mesh
  //         geometry={geom}
  //         material={mat}
  //         key={position.z + index}
  //         position={[position.x, position.y, position.z]}
  //       />
  //     ))}
  //     <Player ref={playerRef} />
  //   </>
  // );
};

export default World;
