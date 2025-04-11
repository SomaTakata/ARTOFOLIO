"use client";

import { Canvas } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";
import Room from "@/components/Room";

// メイン
const Main = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Canvas camera={{ position: [10, 3, 10] }}>
        <gridHelper args={[50, 50]} />
        <OrbitControls />

        {/* 環境光 */}
        <ambientLight intensity={0.5} />

        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport />
        </GizmoHelper>

        <Room />
      </Canvas>
    </div>
  );
};

export default Main;
