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
      <planeGeometry args={[90 * SCALE, 120 * SCALE]} />
      <meshStandardMaterial color="#4A4A4A" />
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
      <planeGeometry args={[90 * SCALE, 120 * SCALE]} />
      <meshStandardMaterial color="#EDEDED" />
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
        position={[0, 8 * SCALE, -60 * SCALE]}
        color="red"
        width={90 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 右壁 */}
      <Wall
        position={[0, 8 * SCALE, 60 * SCALE]}
        rotation={[0, -Math.PI, 0]}
        color="red"
        width={90 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 前壁 */}
      <Wall
        position={[-45 * SCALE, 8 * SCALE, 0]}
        rotation={[0, Math.PI * 0.5, 0]}
        color="blue"
        width={120 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 後壁 */}
      <Wall
        position={[45 * SCALE, 8 * SCALE, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="blue"
        width={120 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 最初の壁 */}
      <Wall
        position={[15 * SCALE, 8 * SCALE, 30 * SCALE]}
        rotation={[0, -Math.PI, 0]}
        color="yellow"
        width={60 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* スキルの壁 */}
      <Wall
        position={[-15 * SCALE, 8 * SCALE, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="pink"
        width={60 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 作品 */}
      <Wall
        position={[15 * SCALE, 8 * SCALE, -30 * SCALE]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="orange"
        width={60 * SCALE}
        height={16 * SCALE}
        depth={0.1 * SCALE}
      />
      <ambientLight intensity={1} />
      {/* 天井 */}
      <Ceiling />
    </>
  );
}
