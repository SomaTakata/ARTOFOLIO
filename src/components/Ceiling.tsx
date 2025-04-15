import { usePlane } from "@react-three/cannon";
import { SCALE, wallHeight } from "./Room";

export function Ceiling() {
  // 天井は下を向いている平面ボディ
  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [Math.PI / 2, 0, 0],
    position: [0, wallHeight * SCALE, 0],
  }));

  // 天井の寸法
  const ceilingWidth = 90 * SCALE;
  const ceilingLength = 120 * SCALE;

  // 天井ライトの配置設定 - より多くのライトを配置
  const rowCount = 7; // 横方向のライト数を増加
  const colCount = 7; // 縦方向のライト数を増加
  const xSpacing = ceilingWidth / rowCount;
  const zSpacing = ceilingLength / colCount;
  const xOffset = -ceilingWidth / 2 + xSpacing / 2;
  const zOffset = -ceilingLength / 2 + zSpacing / 2;

  // ライトグリッドを生成
  const lights = [];
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      const x = xOffset + row * xSpacing;
      const z = zOffset + col * zSpacing;

      lights.push(
        <group
          key={`ceiling-light-${row}-${col}`}
          position={[x, wallHeight * SCALE - 0.2, z]}
        >
          {/* ライトフレーム */}
          <mesh receiveShadow>
            <boxGeometry args={[2.5, 0.1, 2.5]} />
            <meshStandardMaterial
              color="#e0e0e0"
              metalness={0.4}
              roughness={0.5}
            />
          </mesh>

          {/* 発光部分 */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[2.3, 0.05, 2.3]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#fffaea"
              emissiveIntensity={1.0}
              toneMapped={false}
            />
          </mesh>

          {/* 光源 - 明るさと範囲を少し調整 */}
          <pointLight
            position={[0, -0.5, 0]}
            intensity={0.6} // 少し暗く（ライトが多いため）
            distance={15} // 範囲を少し狭く
            decay={2}
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          />
        </group>
      );
    }
  }

  return (
    <>
      {/* 天井本体 - テクスチャなし */}
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[ceilingWidth, ceilingLength]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* 天井ライト */}
      {lights}

      {/* 全体の環境光 */}
      <ambientLight intensity={0.35} />
    </>
  );
}
