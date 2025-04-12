import { usePlane } from "@react-three/cannon";
import { SCALE, wallHeight } from "./Room";

export function Ceiling() {
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
