import { useLoader } from "@react-three/fiber";
import Wall from "./Wall";
import { usePlane } from "@react-three/cannon";
import { TextureLoader } from "three";
import { useTexture } from "@react-three/drei";
import { useEffect } from "react";
import Arch from "./Arch";

export const SCALE = 2;

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
    position: [0, wallHeight * SCALE, 0],
  }));

  return (
    <mesh ref={ref}>
      <planeGeometry args={[90 * SCALE, 120 * SCALE]} />
      <meshStandardMaterial color="#EDEDED" />
    </mesh>
  );
}

//壁の高さ
export const wallHeight = 24
export const wallYPosition = wallHeight / 2
export const wallThick = 5

function TopBoard({ SCALE }: { SCALE: number }) {
  const picture = useTexture({ map: "/vercel.svg" })
  const texture = picture.map

  return (
    <group>
      <mesh position={[-30 * SCALE, 20 * SCALE, -30 * SCALE + (wallThick + 0.3)]}>
        <planeGeometry args={[173 / 50 * SCALE, 150 / 50 * SCALE]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      <mesh position={[-30 * SCALE, 20 * SCALE, -30 * SCALE]} rotation={[0, -Math.PI, 0]}>
        <boxGeometry args={[30 * SCALE, 8 * SCALE, wallThick * SCALE]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  )
}

export default function Room() {
  return (
    <>
      {/* 床 */}
      <Floor />

      {/* 左壁 */}
      <Wall
        position={[0, wallYPosition * SCALE, -60 * SCALE]}
        color="red"
        width={90 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 右壁 */}
      <Wall
        position={[0, wallYPosition * SCALE, 60 * SCALE]}
        rotation={[0, -Math.PI, 0]}
        color="red"
        width={90 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 前壁 */}
      <Wall
        position={[-45 * SCALE, wallYPosition * SCALE, 0]}
        rotation={[0, Math.PI * 0.5, 0]}
        color="blue"
        width={120 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />

      {/*vercel arch*/}
      {/*top*/}
      {/* <mesh position={[-30 * SCALE, 20 * SCALE, - 30 * SCALE]} rotation={[0, -Math.PI, 0]}>
        <boxGeometry args={[30 * SCALE, 8 * SCALE, 0.1 * SCALE]} />
        <meshStandardMaterial color="black" />
      </mesh> */}
      {/* <TopBoard SCALE={SCALE} />

  
      <mesh position={[(-45 + 8 / 2) * SCALE, 8 * SCALE, - 30 * SCALE]} rotation={[0, -Math.PI, 0]}>
        <boxGeometry args={[8 * SCALE, 16 * SCALE, wallThick * SCALE]} />
        <meshStandardMaterial color="black" />
      </mesh>


      <mesh position={[(-15 - 8 / 2) * SCALE, 8 * SCALE, - 30 * SCALE]} rotation={[0, -Math.PI, 0]}>
        <boxGeometry args={[8 * SCALE, 16 * SCALE, wallThick * SCALE]} />
        <meshStandardMaterial color="black" />
      </mesh> */}

      <Arch
        lPosition={[(-45 + 8 / 2) * SCALE, 8 * SCALE, - 30 * SCALE + (wallThick/2 * SCALE)]}
        lRotation={[0, -Math.PI, 0]}
        rPosition={[(-15 - 8 / 2) * SCALE, 8 * SCALE, - 30 * SCALE + (wallThick/2 * SCALE)]}
        rRotation={[0, -Math.PI, 0]}
        tPositon={[-30 * SCALE, 20 * SCALE, -30 * SCALE + (wallThick/2 * SCALE)]}
        tRotation={[0, -Math.PI, 0]}
        logoRotation={[0, 0, 0]}
        logoPosition={[-30 * SCALE, 20 * SCALE, -30 * SCALE + (wallThick + 0.3) + (wallThick/2 * SCALE)]}
      />

      <Arch
        lPosition={[(45 - 8 / 2) * SCALE, 8 * SCALE, 0 * SCALE - (wallThick/2 * SCALE)]}
        lRotation={[0, -Math.PI, 0]}
        rPosition={[(15 + 8 / 2) * SCALE, 8 * SCALE, 0 * SCALE - (wallThick/2 * SCALE)]}
        rRotation={[0, -Math.PI, 0]}
        tPositon={[30 * SCALE, 20 * SCALE, 0 * SCALE - (wallThick/2 * SCALE)]}
        tRotation={[0, -Math.PI, 0]}
        logoRotation={[0, 0, 0]}
        logoPosition={[30 * SCALE, 20 * SCALE, 0 * SCALE + (wallThick + 0.3) - (wallThick/2 * SCALE)]}
      />

      {/*ロゴは厚みで埋もれないようにするために0.3分調整 */}
      <Arch
        lPosition={[-15 * SCALE + (wallThick/2 * SCALE), 8 * SCALE, (30 + 8/2) * SCALE]}
        lRotation={[0, -Math.PI * 0.5, 0]}
        rPosition={[-15 * SCALE + (wallThick/2 * SCALE), 8 * SCALE, (60 - 8/2) * SCALE]}
        rRotation={[0, -Math.PI * 0.5, 0]}
        tPositon={[-15 * SCALE + (wallThick/2 * SCALE), 20 * SCALE, 45 * SCALE]}
        tRotation={[0, -Math.PI * 0.5, 0]}
        logoRotation={[0, Math.PI/2, 0]}
        logoPosition={[-15 * SCALE + (wallThick + 0.3) + (wallThick/2 * SCALE), 20 * SCALE, 45 * SCALE]}
      />

      {/* 後壁 */}
      <Wall
        position={[45 * SCALE, wallYPosition * SCALE, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="blue"
        width={120 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 最初の壁 */}
      <Wall
        position={[15 * SCALE, wallYPosition * SCALE, 30 * SCALE]}
        rotation={[0, -Math.PI, 0]}
        color="yellow"
        width={60 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />
      {/* スキルの壁 */}
      <Wall
        position={[-15 * SCALE, wallYPosition * SCALE, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="pink"
        width={60 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 作品 */}
      <Wall
        position={[15 * SCALE, wallYPosition * SCALE, -30 * SCALE]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="orange"
        width={60 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />
      <ambientLight intensity={1} />
      {/* 天井 */}
      <Ceiling />
    </>
  );
}
