import { RigidBody } from "@react-three/rapier";

const Floor = ({ position, color }: { position: { x: number, y: number, z: number }, color?: string }) => {
    return (
        <RigidBody
            rotation={[-Math.PI / 2, 0, 0]}
            position={[position.x, position.y, position.z]}

        >
            <mesh
            >
                <planeGeometry args={[20, 10]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </RigidBody>
    );
};

export default Floor;
