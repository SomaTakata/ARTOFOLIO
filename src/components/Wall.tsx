type WallProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  width?: number;
  height?: number;
  depth?: number;
};

export default function Wall({
  position,
  rotation,
  color,
  width,
  height,
  depth,
}: WallProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
