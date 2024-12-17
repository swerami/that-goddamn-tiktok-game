import * as THREE from "three";
import React, { useEffect, useRef, forwardRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Pistol: THREE.Mesh;
    FinnTheFrog: THREE.SkinnedMesh;
    Root: THREE.Bone;
  };
  materials: {
    Atlas: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

type ActionName =
  | "CharacterArmature|Death"
  | "CharacterArmature|Duck"
  | "CharacterArmature|HitReact"
  | "CharacterArmature|Idle"
  | "CharacterArmature|Idle_Gun"
  | "CharacterArmature|Jump"
  | "CharacterArmature|Jump_Idle"
  | "CharacterArmature|Jump_Land"
  | "CharacterArmature|No"
  | "CharacterArmature|Punch"
  | "CharacterArmature|Run"
  | "CharacterArmature|Run_Gun"
  | "CharacterArmature|Run_Gun_Shoot"
  | "CharacterArmature|Walk"
  | "CharacterArmature|Walk_Gun"
  | "CharacterArmature|Wave"
  | "CharacterArmature|Weapon"
  | "CharacterArmature|Yes";

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

const Astronaut = forwardRef<THREE.Group, JSX.IntrinsicElements["group"]>(
  (props, ref) => {
    const localRef = useRef<THREE.Group | null>(null);
    const { nodes, materials, animations } = useGLTF(
      "./models/Astronaut.glb"
    ) as GLTFResult;

    const { actions } = useAnimations(animations, localRef);

    useEffect(() => {
      actions["CharacterArmature|Run_Gun"]?.play();
    }, [actions]);

    return (
      <group
        position={[0, 0.4, 0]}
        scale={0.4}
        ref={(instance) => {
          if (typeof ref === "function") {
            ref(instance);
          } else if (ref && "current" in ref) {
            (ref as React.MutableRefObject<THREE.Group | null>).current =
              instance;
          }
          localRef.current = instance;
        }}
        {...props}
        dispose={null}
      >
        <group name="Root_Scene">
          <group name="RootNode">
            <group
              name="CharacterArmature"
              rotation={[-Math.PI / 2, 0, Math.PI]}
              scale={100}
            >
              <primitive object={nodes.Root} />
            </group>
            <skinnedMesh
              name="FinnTheFrog"
              geometry={nodes.FinnTheFrog.geometry}
              material={materials.Atlas}
              skeleton={nodes.FinnTheFrog.skeleton}
              scale={100}
            />
          </group>
        </group>
      </group>
    );
  }
);

useGLTF.preload("./models/Astronaut.glb");

export { Astronaut };
