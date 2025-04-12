import Wall from "./Wall";
import { usePlane } from "@react-three/cannon";

const SCALE = 2;

function Floor() {
  // 床は xz 平面に対して静的な平面ボディとして定義
  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref}>
      <planeGeometry args={[50 * SCALE, 50 * SCALE]} />
      <meshStandardMaterial color="lightseagreen" />
    </mesh>
  );
}

function Ceiling() {
  // 天井は下を向いている平面ボディ
  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [Math.PI / 2, 0, 0],
    position: [0, 16 * SCALE, 0],
  }));

  return (
    <mesh ref={ref}>
      <planeGeometry args={[50 * SCALE, 50 * SCALE]} />
      <meshStandardMaterial color="lightseagreen" />
    </mesh>
  );
}

export default function Room() {
  return (
    <>
      {/* 床 */}
      <Floor />

      {/* 左壁 */}
      <Wall
        position={[0, 8 * SCALE, -25 * SCALE]}
        color="red"
        width={50 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 右壁 */}
      <Wall
        position={[0, 8 * SCALE, 25 * SCALE]}
        rotation={[0, -Math.PI, 0]}
        color="red"
        width={50 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 前壁 */}
      <Wall
        position={[-25 * SCALE, 8 * SCALE, 0]}
        rotation={[0, Math.PI * 0.5, 0]}
        color="blue"
        width={50 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 後壁 */}
      <Wall
        position={[25 * SCALE, 8 * SCALE, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="blue"
        width={50 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 最初の壁 */}
      <Wall
        position={[5 * SCALE, 8 * SCALE, 15 * SCALE]}
        rotation={[0, -Math.PI, 0]}
        color="yellow"
        width={40 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* スキルの壁 */}
      <Wall
        position={[-15 * SCALE, 8 * SCALE, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="pink"
        width={30 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 作品 */}
      <Wall
        position={[5 * SCALE, 8 * SCALE, -10 * SCALE]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="orange"
        width={30 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />

      {/* 天井 */}
      <Ceiling />
    </>
  );
}
