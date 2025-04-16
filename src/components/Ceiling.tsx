// Ceiling.tsx - 天井全体に均等に配置したライト
import { usePlane } from "@react-three/cannon";
import { useRef } from "react";
import { DirectionalLight } from "three";
import { SCALE, wallHeight } from "./Room";

export function Ceiling() {
  // 方向光源の参照
  const mainLightRef = useRef<DirectionalLight>(null);
  const secondaryLightRef = useRef<DirectionalLight>(null);

  // 天井の平面
  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [Math.PI / 2, 0, 0],
    position: [0, wallHeight * SCALE, 0],
  }));

  // 天井のサイズ
  const ceilingWidth = 90 * SCALE;
  const ceilingLength = 120 * SCALE;

  return (
    <>
      {/* 天井の平面 */}
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[ceilingWidth, ceilingLength]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} metalness={0.0} />
      </mesh>
    </>
  );
}
