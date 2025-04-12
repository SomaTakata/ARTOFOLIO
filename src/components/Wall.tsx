import { useBox } from "@react-three/cannon";

type WallProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  width?: number;
  height?: number;
  depth?: number;
};

export default function Wall({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = "white",
  width = 1,
  height = 1,
  depth = 1,
}: WallProps) {
  // useBox で静的な物理ボディを生成
  const [ref] = useBox(() => ({
    type: "Static",
    position,
    rotation,
    args: [width, height, depth],
  }));

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
