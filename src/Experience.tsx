import World from "./components/World";
import { KeyboardControls, KeyboardControlsEntry, OrbitControls } from "@react-three/drei";
import { Controls } from "./types/Controls";
import React from "react";
import { Physics } from "@react-three/rapier";

const Experience = () => {
    const map = React.useMemo<KeyboardControlsEntry<Controls>[]>(() => [
        // { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
        // { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
        { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
        { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
        { name: Controls.jump, keys: ['Space'] },
    ], [])

    return <>
        <KeyboardControls map={map}>
            <Physics >
                <World />
            </Physics>
        </KeyboardControls>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight intensity={1.0} />
    </>;
};

export default Experience;
