// Wall.tsx の修正版

import { useBox } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { RepeatWrapping } from "three";

type WallProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  receiveShadow?: boolean;
  castShadow?: boolean;
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
  castShadow = false, // デフォルトで影を落とさないように変更
  textureRepeat = [1, 1],
  color = "#ffffff",
  backColor = "#ffffff",
  isBlack = false,
  isBackBlack = false,
}: WallProps) {
  // displacementMap のロードを削除
  const textures = useTexture({
    map: "/textures/Plaster001_2K-JPG_Color.jpg",
    normalMap: "/textures/Plaster001_2K-JPG_NormalGL.jpg",
    roughnessMap: "/textures/Plaster001_2K-JPG_Roughness.jpg",
  });

  useEffect(() => {
    Object.values(textures).forEach((texture) => {
      if (texture) {
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.repeat.set(textureRepeat[0], textureRepeat[1]);
      }
    });
  }, [textures, textureRepeat]);

  const [ref] = useBox(() => ({
    type: "Static",
    position,
    rotation,
    args: [width, height, depth],
  }));

  // displacementScale を削除, テクスチャを明示的に設定
  const frontSettings = {
    color: color,
    roughness: isBlack ? 0.7 : 0.8,
    metalness: isBlack ? 0.08 : 0.02,
    map: textures.map,
    normalMap: textures.normalMap,
    normalScale: isBlack
      ? new THREE.Vector2(0.8, 0.8)
      : new THREE.Vector2(0.6, 0.6),
    roughnessMap: textures.roughnessMap,
    // displacementScale: isBlack ? 0.05 : 0.03, // 削除
    aoMapIntensity: isBlack ? 1.0 : 0.7,
    envMapIntensity: isBlack ? 1.5 : 0.8,
  };

  // displacementScale を削除, テクスチャを明示的に設定
  const backSettings = {
    color: backColor,
    roughness: isBackBlack ? 0.7 : 0.8,
    metalness: isBackBlack ? 0.08 : 0.02,
    map: textures.map,
    normalMap: textures.normalMap,
    normalScale: isBackBlack
      ? new THREE.Vector2(0.8, 0.8)
      : new THREE.Vector2(0.6, 0.6),
    roughnessMap: textures.roughnessMap,
    // displacementScale: isBackBlack ? 0.05 : 0.03, // 削除
    aoMapIntensity: isBackBlack ? 1.0 : 0.7,
    envMapIntensity: isBackBlack ? 1.5 : 0.8,
  };

  return (
    <group>
      {/* 物理ボディ用 */}
      <mesh ref={ref} position={position} rotation={rotation} visible={false}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>
      {/* 表面 - 細分化と clearcoat を削除 */}
      <mesh
        position={position}
        rotation={rotation}
        receiveShadow={receiveShadow}
        castShadow={castShadow}
      >
        <planeGeometry args={[width, height]} /> {/* 細分化を削除 */}
        <meshPhysicalMaterial
          {...frontSettings}
        />
      </mesh>
      {/* 裏面 - 細分化と clearcoat を削除 */}
      <mesh
        position={position}
        rotation={[rotation[0], rotation[1] + Math.PI, rotation[2]]}
        receiveShadow={receiveShadow}
        castShadow={castShadow}
      >
        <planeGeometry args={[width, height]} /> {/* 細分化を削除 */}
        <meshPhysicalMaterial
          {...backSettings}
        />
      </mesh>
    </group>
  );
}
