import React from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../types/Controls";
import { useFrame } from "@react-three/fiber";
import { BallCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Astronaut } from "./Astronaut";
import { createBullet, onIntersect } from "../utils";
import { handleThirdPersonCamera } from "../utils/handleThirdPlayerCamera";
import Enemy from "./Enemy";

const Player = React.forwardRef<RapierRigidBody>((_, ref) => {
  const [, get] = useKeyboardControls<Controls>();
  const rayWidthMultiplier = 2;
  const bulletsRef = React.useRef<THREE.Mesh[]>([]);
  const [raycaster] = React.useState(() => new THREE.Raycaster());
  const detectedObjectRef =
    React.useRef<THREE.Object3D<THREE.Object3DEventMap>>();

  const geometry = React.useMemo(() => new THREE.SphereGeometry(0.1), []);
  const mat = React.useMemo(
    () => new THREE.MeshStandardMaterial({ color: "red" }),
    []
  );
  const bulletMesh = React.useMemo(
    () => new THREE.Mesh(geometry, mat),
    [geometry, mat]
  );

  const playerPositionRef = React.useRef<THREE.Vector3>(new THREE.Vector3());
  const smoothCameraPosition = React.useRef<THREE.Vector3>(
    new THREE.Vector3(10, 10, 10)
  );
  const smoothCameraTarget = React.useRef<THREE.Vector3>(new THREE.Vector3());

  // shooting trigger
  const shootingEnabled = React.useRef(true);
  const handleShoot = (scene: THREE.Scene) => {
    const { bullet } = createBullet(
      bulletMesh,
      playerPositionRef,
      raycaster,
      rayWidthMultiplier
    );
    bulletsRef.current.push(bullet);
    scene.add(bullet);
  };

  console.log("Player Component Mounted");
  useFrame((state, delta) => {
    const { forward, left, right } = get();
    const impulse = { x: 0.00000001, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };
    const maxSpeed = 14;

    console.log(bulletsRef.current.length);

    if ("current" in ref! && ref.current) {
      const bodyOrigin = ref.current.translation();
      const currentVelocity = ref.current.linvel();

      const impulseStrength = 4 * delta;
      const torqueStrength = 0.02 * delta;

      if (currentVelocity.z > -maxSpeed) {
        if (!forward) {
          //
        }
      }

      if (left) {
        impulse.x =
          currentVelocity.x > -maxSpeed
            ? impulse.x - impulseStrength
            : impulseStrength;
        torque.z += torqueStrength;
      }
      if (right) {
        impulse.x =
          currentVelocity.x > -maxSpeed
            ? impulse.x + impulseStrength
            : impulseStrength;
        torque.z -= torqueStrength;
      }

      ref?.current?.applyImpulse(impulse, true);
      ref?.current?.applyTorqueImpulse(torque, true);

      if (bodyOrigin) {
        playerPositionRef.current.copy(
          new THREE.Vector3(bodyOrigin.x, bodyOrigin.y, bodyOrigin.z)
        );
        handleThirdPersonCamera(
          bodyOrigin,
          state,
          delta,
          ref,
          playerPositionRef,
          smoothCameraPosition,
          smoothCameraTarget
        );

        if (shootingEnabled.current) {
          handleShoot(state.scene);
          shootingEnabled.current = false;
          setTimeout(() => (shootingEnabled.current = true), 200);
        }

        if (bulletsRef.current) {
          bulletsRef.current.forEach((bullet, i) => {
            bullet.position.z -= 0.5;
            if (bullet.position.z < -50) {
              state.scene.remove(bullet);
              bulletsRef.current.splice(i, 1);
            }
          });
        }
        const detectedIntersectObject = onIntersect(state.scene, raycaster);
        detectedObjectRef.current = detectedIntersectObject;
      }
    }
  });

  React.useEffect(() => {
    const bullets = bulletsRef.current;
    return () => {
      bullets.forEach((mesh) => {
        mesh.parent?.remove(mesh);
        mesh.geometry.dispose();
      });
    };
  }, []);

  return (
    <>
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
        <BallCollider position={[0, 0.0, 0]} args={[0.4]} />
      </RigidBody>

      {detectedObjectRef.current ? null : (
        <Enemy playerPosition={playerPositionRef.current} />
      )}

      {bulletsRef.current.map((bullet, index) => (
        <primitive key={index} object={bullet} />
      ))}
    </>
  );
});

export default Player;
