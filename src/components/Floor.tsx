import { usePlane } from "@react-three/cannon";
import * as THREE from "three";
import { useMemo } from "react";
import { SpotLight } from "@react-three/drei";

const SCALE = 2;

export default function Floor() {
  // 石タイル風のシェーダーマテリアルを作成
  const stoneTileMaterial = useMemo(() => {
    // 継ぎ目の色（明るめのグレー）
    const groutColor = new THREE.Color(0xe0e0e0);

    // タイルの色（ダークグレー）
    const tileColor = new THREE.Color(0x666666);

    // ハイライト色（少し明るめのタイルの色）
    const highlightColor = new THREE.Color(0x888888);

    // カスタムシェーダーマテリアル
    return new THREE.ShaderMaterial({
      uniforms: {
        groutColor: { value: groutColor },
        tileColor: { value: tileColor },
        highlightColor: { value: highlightColor },
        numTiles: { value: 40.0 }, // タイルの数
        groutWidth: { value: 0.03 }, // 継ぎ目の幅
        noiseScale: { value: 50.0 }, // ノイズのスケール（石の質感）
        noiseStrength: { value: 0.2 }, // ノイズの強さ
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 groutColor;
        uniform vec3 tileColor;
        uniform vec3 highlightColor;
        uniform float numTiles;
        uniform float groutWidth;
        uniform float noiseScale;
        uniform float noiseStrength;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // 乱数生成関数
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // 値をブレンドするノイズ関数
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          // 4点をサンプリングして補間
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          
          // スムーズ補間
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        // 石タイルのグリッド描画
        float stoneTileGrid(vec2 uv, float numTiles, float lineWidth) {
          // グリッド座標
          vec2 gridUv = fract(uv * numTiles);
          
          // 線の太さを持つX方向とY方向のマスク
          float xLine = step(0.0, gridUv.x) * step(gridUv.x, lineWidth) + 
                       step(1.0 - lineWidth, gridUv.x) * step(gridUv.x, 1.0);
          float yLine = step(0.0, gridUv.y) * step(gridUv.y, lineWidth) + 
                       step(1.0 - lineWidth, gridUv.y) * step(gridUv.y, 1.0);
          
          // どちらかの線が存在する場所を1.0として返す
          return max(xLine, yLine);
        }
        
        void main() {
          // タイルグリッドのマスク（1.0=継ぎ目, 0.0=タイル）
          float gridMask = stoneTileGrid(vUv, numTiles, groutWidth);
          
          // タイルごとのノイズ（石の個性を表現）
          vec2 tileId = floor(vUv * numTiles);
          float tileNoise = noise(tileId * 0.5) * noiseStrength;
          
          // タイル内の細かいノイズ（石の質感）
          float detailNoise = noise(vUv * noiseScale) * 0.1;
          
          // タイルのフラクチャ（石のひび割れや不均一さ）
          float fracture = noise(vUv * 5.0 + tileId) * 0.05;
          
          // タイル内の位置（エッジ効果用）
          vec2 fromCenter = abs(fract(vUv * numTiles) - 0.5);
          float edgeDistance = max(fromCenter.x, fromCenter.y);
          float edgeEffect = smoothstep(0.4, 0.5, edgeDistance) * 0.1;
          
          // 中心からの距離による効果（遠近感）
          float distanceEffect = length(vPosition.xz) / 200.0;
          distanceEffect = min(distanceEffect, 0.2);
          
          // 色調整の効果をすべて組み合わせる
          float combinedEffect = tileNoise + detailNoise + fracture + edgeEffect + distanceEffect;
          
          // タイルの色（ベース色とハイライト色の混合）
          vec3 stoneColor = mix(tileColor, highlightColor, combinedEffect);
          
          // 最終的な色（タイルか継ぎ目か）
          vec3 finalColor = mix(stoneColor, groutColor, gridMask);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, []);

  // 床の物理ボディ
  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <>
      {/* 床メッシュ */}
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[90 * SCALE, 120 * SCALE]} />
        <primitive object={stoneTileMaterial} attach="material" />
      </mesh>

      {/* 床を照らすライト */}
      <SpotLight
        position={[50, 40, 50]}
        angle={0.6}
        penumbra={0.5}
        intensity={2.5}
        color="#ffffff"
        distance={150}
        castShadow
      />

      <SpotLight
        position={[-30, 40, -30]}
        angle={0.6}
        penumbra={0.6}
        intensity={2.0}
        color="#fffaf0"
        distance={150}
        castShadow
      />
    </>
  );
}
