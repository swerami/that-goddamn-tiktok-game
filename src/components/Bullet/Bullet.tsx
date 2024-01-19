import { useEffect, useRef } from "react";
import * as THREE from "three";

const Bullet = ({ position }: { position: THREE.Vector3 }) => {
    const bulletRef = useRef<THREE.Mesh>(null!);

    useEffect(() => {
        const geometry = bulletRef.current.geometry;

        if (geometry) {
            const disposeBullet = setTimeout(() => {
                const parent = bulletRef.current.parent;
                if (parent) {
                    parent.remove(bulletRef.current);
                }

                geometry.dispose();
            }, 400);
            return () => {
                clearTimeout(disposeBullet);
            };
        }
    }, []);



    return (
        <mesh ref={bulletRef} position={[position?.x, position?.y, position?.z - 6.0]}>
            <sphereGeometry args={[0.1, 0.1, 16]} attach="geometry" />
            <meshStandardMaterial color="red" />
        </mesh>
    );
};

export default Bullet;
