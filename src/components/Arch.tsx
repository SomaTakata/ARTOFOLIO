import { useTexture } from "@react-three/drei";
import { SCALE, wallThick } from "./Room"; // Roomからインポート想定
import * as THREE from "three"; // THREEをインポート
import { useMemo } from "react"; // useMemoをインポート

// TopBoardコンポーネント: マテリアルのプロパティを受け取るように変更
function TopBoard({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  logoRotation = [0, 0, 0],
  logoPosition = [0, 0, 0],
  lightPosition = [0, 0, 0],
  materialProps, // マテリアルの設定を受け取る
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  logoRotation?: [number, number, number];
  logoPosition?: [number, number, number];
  lightPosition?: [number, number, number];
  materialProps: object; // マテリアル設定の型 (より具体的にしても良い)
}) {
  // ロゴ画像のテクスチャ
  const logoTexture = useTexture({ map: "/vercel.svg" });

  return (
    <group>
      {/* ロゴ表示用のメッシュ */}
      <mesh position={logoPosition} rotation={logoRotation}>
        <planeGeometry args={[(173 / 50) * SCALE, (150 / 50) * SCALE]} />
        {/* ロゴはテクスチャがメインなので StandardMaterial のまま */}
        <meshStandardMaterial map={logoTexture.map} transparent={true} />
      </mesh>

      <pointLight intensity={200} position={lightPosition} rotation={logoRotation} />

      {/* アーチ上部のボード本体 - 受け取ったマテリアル設定を適用 */}
      <mesh position={position} rotation={rotation} castShadow receiveShadow>
        <boxGeometry args={[30 * SCALE, 8 * SCALE, wallThick * SCALE]} />
        {/* meshPhysicalMaterial を使用し、渡されたプロパティを展開 */}
        <meshPhysicalMaterial {...materialProps} />
      </mesh>
    </group>
  );
}

// Archコンポーネント: テクスチャ読み込みとマテリアル設定を追加
export default function Arch({
  lPosition = [0, 0, 0],
  lRotation = [0, 0, 0],
  rPosition = [0, 0, 0],
  rRotation = [0, 0, 0],
  tPositon = [0, 0, 0],
  tRotation = [0, 0, 0],
  logoRotation = [0, 0, 0],
  logoPosition = [0, 0, 0],
  lightPosition = [0, 0, 0],
}: {
  lPosition?: [number, number, number];
  lRotation?: [number, number, number];
  rPosition?: [number, number, number];
  rRotation?: [number, number, number];
  tPositon?: [number, number, number];
  tRotation?: [number, number, number];
  logoRotation?: [number, number, number];
  logoPosition?: [number, number, number];
  lightPosition?: [number, number, number];
}) {
  // Wall と同じテクスチャをロード (displacementMap は不要)
  const textures = useTexture({
    map: "/textures/Plaster001_2K-JPG_Color.jpg",
    normalMap: "/textures/Plaster001_2K-JPG_NormalGL.jpg",
    roughnessMap: "/textures/Plaster001_2K-JPG_Roughness.jpg",
  });

  // アーチ用のマテリアル設定 (Wall の isBlack=true 相当)
  // useMemo を使って再計算を防ぐ
  const archMaterialSettings = useMemo(
    () => ({
      color: "#1a1a1a", // Wall で isBlack 時に使われていた色に近い暗いグレー
      roughness: 0.7,
      metalness: 0.08,
      map: textures.map,
      normalMap: textures.normalMap,
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughnessMap: textures.roughnessMap,
      aoMapIntensity: 1.0,
      envMapIntensity: 1.5,
    }),
    [textures]
  ); // textures が変わった時だけ再計算

  return (
    <group>
      {/* 上部ボード: マテリアル設定を渡す */}
      <TopBoard
        position={tPositon}
        rotation={tRotation}
        logoRotation={logoRotation}
        logoPosition={logoPosition}
        lightPosition={lightPosition}
        materialProps={archMaterialSettings} // 設定を渡す
      />

      {/* 左脚: マテリアル設定を適用 */}
      <mesh position={lPosition} rotation={lRotation} castShadow receiveShadow>
        <boxGeometry args={[8 * SCALE, 16 * SCALE, wallThick * SCALE]} />
        <meshPhysicalMaterial {...archMaterialSettings} />
      </mesh>

      {/* 右脚: マテリアル設定を適用 */}
      <mesh position={rPosition} rotation={rRotation} castShadow receiveShadow>
        <boxGeometry args={[8 * SCALE, 16 * SCALE, wallThick * SCALE]} />
        <meshPhysicalMaterial {...archMaterialSettings} />
      </mesh>
    </group>
  );
}
