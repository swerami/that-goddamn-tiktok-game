
const Floor = ({ position, color }: { position: { x: number, y: number, z: number }, color?: string }) => {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[position.x, position.y, position.z]}>
            <planeGeometry args={[20, 10]} />
            <meshBasicMaterial color={color} />
        </mesh>
    );
};

export default Floor;
