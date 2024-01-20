import World from "./components/World";
import { KeyboardControls, KeyboardControlsEntry, OrbitControls } from "@react-three/drei";
import { Controls } from "./types/Controls";
import React from "react";
import { Physics } from "@react-three/rapier";
// import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
// import { BlurPass, Resizer, KernelSize, Resolution } from 'postprocessing'

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
            <Physics debug>
                <World />
            </Physics>
        </KeyboardControls>
        <OrbitControls />
        <ambientLight intensity={1.5} />
        <directionalLight intensity={1.0} />
        {/* <EffectComposer > */}
        {/* <DepthOfField focusDistance={0} focalLength={0.5} bokehScale={2} height={480} /> */}
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.2} height={600} /> */}
        {/* <Noise opacity={1.02} /> */}
        {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
        {/* </EffectComposer> */}
    </>;
};

export default Experience;
