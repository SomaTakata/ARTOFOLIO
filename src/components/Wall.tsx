import { useBox } from "@react-three/cannon";

type WallProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  backColor?: string;
  width?: number;
  height?: number;
  depth?: number;
};

export default function Wall({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = "white",
  backColor = "white",
  width = 1,
  height = 1,
  depth = 0.1,
}: WallProps) {
  // useBox で静的な物理ボディを生成
  const [ref] = useBox(() => ({
    type: "Static",
    position,
    rotation,
    args: [width, height, depth],
  }));

  // 深さの半分の値
  const halfDepth = depth / 2;

  return (
    <group>
      {/* 物理ボディ用の不可視のボックス */}
      <mesh ref={ref} position={position} rotation={rotation} visible={false}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* 表面の平面 */}
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* 裏面の平面 - 表面から180度回転させる */}
      <mesh
        position={position}
        rotation={[rotation[0], rotation[1] + Math.PI, rotation[2]]}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={backColor} />
      </mesh>
    </group>
  );
}
