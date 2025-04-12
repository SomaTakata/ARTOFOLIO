import { useTexture } from "@react-three/drei";
import { SCALE, wallThick } from "./Room";

function TopBoard({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  logoRotation = [0, 0, 0],
  logoPosition = [0, 0, 0],
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  logoRotation?: [number, number, number];
  logoPosition?: [number, number, number];
}) {
  const picture = useTexture({ map: "/vercel.svg" })
  const texture = picture.map

  return (
    <group>
      <mesh
        position={logoPosition}
        rotation={logoRotation}
      >
        <planeGeometry args={[173 / 50 * SCALE, 150 / 50 * SCALE]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[30 * SCALE, 8 * SCALE, wallThick * SCALE]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  )
}

export default function Arch({
  lPosition = [0, 0, 0],
  lRotation = [0, 0, 0],
  rPosition = [0, 0, 0],
  rRotation = [0, 0, 0],
  tPositon = [0, 0, 0],
  tRotation = [0, 0, 0],
  logoRotation = [0, 0, 0],
  logoPosition = [0, 0, 0],
}: {
  lPosition?: [number, number, number];
  lRotation?: [number, number, number];
  rPosition?: [number, number, number];
  rRotation?: [number, number, number];
  tPositon?: [number, number, number];
  tRotation?: [number, number, number];
  logoRotation?: [number, number, number];
  logoPosition?: [number, number, number];
}) {
  return (
    <group>
      <TopBoard
        position={tPositon}
        rotation={tRotation}
        logoRotation={logoRotation}
        logoPosition={logoPosition}
      />
      {/*left foot*/}
      <mesh position={lPosition} rotation={lRotation}>
        <boxGeometry args={[8 * SCALE, 16 * SCALE, wallThick * SCALE]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/*right foot*/}
      <mesh position={rPosition} rotation={rRotation}>
        <boxGeometry args={[8 * SCALE, 16 * SCALE, wallThick * SCALE]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}
