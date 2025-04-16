import { usePlane } from "@react-three/cannon";
import * as THREE from "three";
import { useMemo } from "react";

const SCALE = 2;

export default function Floor() {
  // 画像テクスチャの代わりにシェーダーマテリアルでタイル模様を作成
  const stoneTiledMaterial = useMemo(() => {
    // 継ぎ目の色（ライトグレー）- 画像に合わせて明るめの色に
    const groutColor = new THREE.Color(0xd3d5d2);

    // タイルの色（ダークグレー）- 画像のような暗めの色に
    const tileColor = new THREE.Color(0x707173);

    // タイルの質感用のハイライト（少し明るめのダークグレー）
    const highlightColor = new THREE.Color(0xc0c0c0);

    // カスタムシェーダーマテリアル
    return new THREE.ShaderMaterial({
      uniforms: {
        groutColor: { value: groutColor },
        tileColor: { value: tileColor },
        highlightColor: { value: highlightColor },
        numTiles: { value: 80.0 }, // タイルの数を調整
        groutWidth: { value: 0.015 }, // 継ぎ目の幅を画像に合わせて調整
        noiseScale: { value: 50.0 }, // ノイズのスケール
        noiseStrength: { value: 0.2 }, // ノイズの強さを調整
        time: { value: 0.0 },
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
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // 簡易的なノイズ関数
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // 値をブレンドするための関数
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          // ブレンド用の4点をサンプリング
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          
          // スムーズな補間
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          // 4点の値をブレンド
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        // 連続した継ぎ目を作成するための関数
        float continuousGrout(vec2 uv, float numTiles, float width) {
          // タイルのグリッド線を計算
          vec2 gridLines = abs(fract(uv * numTiles) - 0.5) * 2.0;
          
          // X方向とY方向の継ぎ目のマスク（値が小さいほど継ぎ目に近い）
          float xGrout = smoothstep(0.0, width * 2.0, gridLines.x);
          float yGrout = smoothstep(0.0, width * 2.0, gridLines.y);
          
          // どちらかの方向が継ぎ目に近ければ、継ぎ目として扱う
          return min(xGrout, yGrout);
        }
        
        void main() {
          // 新しい継ぎ目のマスク (0=継ぎ目, 1=タイル)
          float mask = continuousGrout(vUv, numTiles, groutWidth);
          
          // 各タイルごとに異なるノイズ値を生成
          vec2 tileId = floor(vUv * numTiles);
          float noiseValue = noise(tileId * 0.5) * noiseStrength;
          
          // タイル内の位置に基づいた微妙な変化
          float inTileNoise = noise(vUv * noiseScale) * 0.1;
          
          // 遠近感を強調するための距離に基づく効果
          float distanceFromCenter = length(vPosition.xz) / 200.0;
          float perspectiveEffect = clamp(distanceFromCenter, 0.0, 1.0) * 0.2;
          
          // タイルの端に近いほどハイライトを軽く付ける（控えめに）
          vec2 gridUv = fract(vUv * numTiles);
          float edgeHighlight = (1.0 - distance(gridUv, vec2(0.5))) * 0.15;
          
          // 継ぎ目とタイルの色を混合
          vec3 stoneColor = mix(tileColor, highlightColor, noiseValue + inTileNoise + edgeHighlight + perspectiveEffect);
          vec3 finalColor = mix(groutColor, stoneColor, mask);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, []);

  // 床は xz 平面に対して静的な平面ボディとして定義
  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <>
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[200 * SCALE, 200 * SCALE]} />
        <primitive object={stoneTiledMaterial} attach="material" />
      </mesh>
    </>
  );
}
