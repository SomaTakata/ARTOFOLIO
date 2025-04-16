import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Painting({
  pictureUrl,
  framePostion = [0, 0, 0],
  frameRotation = [0, 0, 0],
  frameColor = "black",
  frameWidth = 24,
  frameHeight = 24,
  frameDepth = 1.5, // 額縁の厚み
  frameBorderWidth = 1, // 額縁の縁の幅
  useWallTexture = false, // 新しいパラメータ: 壁のテクスチャを使用するかどうか
}: {
  pictureUrl: string;
  framePostion?: [number, number, number];
  frameRotation?: [number, number, number];
  frameColor?: string;
  frameWidth?: number;
  frameHeight?: number;
  frameDepth?: number;
  frameBorderWidth?: number;
  useWallTexture?: boolean;
}) {
  const picture = useTexture({
    map: pictureUrl,
  });
  // 画像のテクスチャをロード
  const textures = useTexture({
    map: "/textures/Plaster001_2K-JPG_Color.jpg",
    normalMap: "/textures/Plaster001_2K-JPG_NormalGL.jpg",
    roughnessMap: "/textures/Plaster001_2K-JPG_Roughness.jpg",
    // displacementMap: "/textures/Plaster001_2K-JPG_Displacement.jpg", // 削除
  });

  // 内側のキャンバスサイズを計算
  const canvasWidth = frameWidth - frameBorderWidth * 2;
  const canvasHeight = frameHeight - frameBorderWidth * 2;

  return (
    <group position={framePostion} rotation={frameRotation}>
      {/** 外側の額縁 */}
      <mesh receiveShadow>
        <boxGeometry args={[frameWidth, frameHeight, frameDepth]} />
        <meshPhysicalMaterial
          color={frameColor}
          roughness={0.8}
          metalness={0.02}
          map={textures.map}
          normalMap={textures.normalMap}
          normalScale={new THREE.Vector2(0.6, 0.6)}
          roughnessMap={textures.roughnessMap}
          aoMapIntensity={0.7}
          envMapIntensity={0.8}
        />
      </mesh>

      {/** 内側のキャンバス部分（奥まったところに配置） */}
      <mesh position={[0, 0, frameDepth / 2 - 0.2]}>
        <boxGeometry args={[canvasWidth, canvasHeight, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/** 画像（キャンバスよりさらに手前に配置 - 距離を広げる） */}
      <mesh position={[0, 0, frameDepth / 2 + 0.5]}>
        <planeGeometry args={[canvasWidth - 0.3, canvasHeight - 0.3]} />
        <meshStandardMaterial map={picture.map} toneMapped={false} />
      </mesh>
    </group>
  );
}
