// utils.ts
import * as THREE from "three";
import { RootState } from "@react-three/fiber";
import { RapierRigidBody } from "@react-three/rapier";
import { Vector } from "three/examples/jsm/physics/RapierPhysics.js";

export const handleThirdPersonCamera = (
  bodyOrigin: Vector,
  state: RootState,
  delta: number,
  ref: React.RefObject<RapierRigidBody>,
  setPlayerPosition: React.Dispatch<React.SetStateAction<THREE.Vector3>>,
  playerPositionRef: React.MutableRefObject<THREE.Vector3>,
  smoothCameraPosition: React.MutableRefObject<THREE.Vector3>,
  smoothCameraTarget: React.MutableRefObject<THREE.Vector3>
) => {
  const cameraPosition = new THREE.Vector3();
  cameraPosition.copy(bodyOrigin as THREE.Vector3);
  cameraPosition.z += 3.25;
  cameraPosition.y += 2.2;

  const cameraTarget = new THREE.Vector3();
  cameraTarget.copy(bodyOrigin as THREE.Vector3);
  cameraTarget.z -= 5.25;

  smoothCameraPosition.current.lerp(cameraPosition, 12 * delta);
  smoothCameraTarget.current.lerp(cameraTarget, 12 * delta);

  state.camera.position.copy(smoothCameraPosition.current);
  state.camera.lookAt(smoothCameraTarget.current);

  if (ref.current) {
    const position = ref.current.translation();
    setPlayerPosition(new THREE.Vector3(position.x, position.y, position.z));
    playerPositionRef.current.set(position.x, position.y, position.z);
  }
};
