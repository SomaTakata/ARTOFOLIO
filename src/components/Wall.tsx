import { useBox } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";
import { useEffect } from "react";
import { RepeatWrapping } from "three";

type WallProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  receiveShadow?: boolean;
  textureRepeat?: [number, number];
  color?: string;
  backColor?: string;
  isBlack?: boolean;
  isBackBlack?: boolean;
};

export default function Wall({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 1,
  height = 1,
  depth = 0.1,
  receiveShadow = true,
  textureRepeat = [1, 1],
  color = "#ffffff",
  backColor = "#ffffff",
  isBlack = false,
  isBackBlack = false,
}: WallProps) {
  // プラスターテクスチャをロード
  const textures = useTexture({
    map: "/textures/Plaster003_4K-JPG_Color.jpg",
    normalMap: "/textures/Plaster003_4K-JPG_NormalGL.jpg",
    roughnessMap: "/textures/Plaster003_4K-JPG_Roughness.jpg",
    displacementMap: "/textures/Plaster003_4K-JPG_Displacement.jpg",
  });

  // テクスチャの繰り返し設定
  useEffect(() => {
    Object.values(textures).forEach((texture) => {
      if (texture) {
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.repeat.set(textureRepeat[0], textureRepeat[1]);
      }
    });
  }, [textures, textureRepeat]);

  // useBox で静的な物理ボディを生成
  const [ref] = useBox(() => ({
    type: "Static",
    position,
    rotation,
    args: [width, height, depth],
  }));

  // 表面用の設定
  const frontSettings = {
    color: color,
    roughness: isBlack ? 0.6 : 0.9,
    metalness: isBlack ? 0.1 : 0.0,
    normalScale: isBlack
      ? ([0.2, 0.2] as [number, number])
      : ([0.4, 0.4] as [number, number]),
    displacementScale: isBlack ? 0.005 : 0.01,
    envMapIntensity: isBlack ? 0.8 : 0.4,
  };

  // 裏面用の設定
  const backSettings = {
    color: backColor,
    roughness: isBackBlack ? 0.6 : 0.9,
    metalness: isBackBlack ? 0.1 : 0.0,
    normalScale: isBackBlack
      ? ([0.2, 0.2] as [number, number])
      : ([0.4, 0.4] as [number, number]),
    displacementScale: isBackBlack ? 0.005 : 0.01,
    envMapIntensity: isBackBlack ? 0.8 : 0.4,
  };

  return (
    <group>
      {/* 物理ボディ用の不可視のボックス */}
      <mesh ref={ref} position={position} rotation={rotation} visible={false}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* 表面の平面 */}
      <mesh
        position={position}
        rotation={rotation}
        receiveShadow={receiveShadow}
      >
        <planeGeometry args={[width, height, 24, 24]} />
        <meshStandardMaterial {...textures} {...frontSettings} />
      </mesh>

      {/* 裏面の平面 */}
      <mesh
        position={position}
        rotation={[rotation[0], rotation[1] + Math.PI, rotation[2]]}
        receiveShadow={receiveShadow}
      >
        <planeGeometry args={[width, height, 24, 24]} />
        <meshStandardMaterial {...textures} {...backSettings} />
      </mesh>
    </group>
  );
}
