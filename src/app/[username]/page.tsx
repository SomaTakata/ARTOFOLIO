"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport } from "@react-three/drei";
import Room from "@/components/Room";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { Physics, useSphere } from "@react-three/cannon";

const useKeyboardInput = () => {
  const keyState = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code in keyState.current) {
        keyState.current[e.code as keyof typeof keyState.current] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keyState.current) {
        keyState.current[e.code as keyof typeof keyState.current] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keyState;
};

function Player() {
  const keyState = useKeyboardInput();
  const walkCycle = useRef(0);
  const yawRef = useRef(0);
  const initialPosition = new Vector3(20, 12, 20);
  const positionRef = useRef(initialPosition.clone());

  // useSphere の ref をメッシュに割り当てるため、物理ボディと同期させる
  const [ref, api] = useSphere(() => ({
    type: "Kinematic",
    position: [initialPosition.x, initialPosition.y, initialPosition.z],
    args: [0.5], // 衝突判定用の半径。必要に応じてサイズ調整
    fixedRotation: true,
  }));

  useFrame((state, delta) => {
    const movementSpeed = 10;       // 移動速度（単位/秒）
    const rotationSpeed = Math.PI;  // 回転速度（ラジアン/秒）

    // キー入力から yaw（左右回転）の更新
    let yaw = yawRef.current;
    if (keyState.current.ArrowLeft) {
      yaw += rotationSpeed * delta;
    }
    if (keyState.current.ArrowRight) {
      yaw -= rotationSpeed * delta;
    }
    yawRef.current = yaw;

    // yaw を元に前方ベクトルを計算（水平移動用）
    const forward = new Vector3(0, 0, -1)
      .applyAxisAngle(new Vector3(0, 1, 0), yaw)
      .normalize();

    // 前進・後退の移動変位を算出
    const displacement = new Vector3();
    if (keyState.current.ArrowUp) {
      displacement.add(forward.clone().multiplyScalar(movementSpeed * delta));
    }
    if (keyState.current.ArrowDown) {
      displacement.add(forward.clone().multiplyScalar(-movementSpeed * delta));
    }

    // ヘッドボービングによる上下の微妙な揺れ
    const baseHeight = initialPosition.y;
    let bobbingOffset = 0;
    if (keyState.current.ArrowUp || keyState.current.ArrowDown) {
      walkCycle.current += delta * movementSpeed;
      const bobbingAmplitude = 0.07;
      const bobbingFrequency = 1;
      bobbingOffset = Math.sin(walkCycle.current * bobbingFrequency) * bobbingAmplitude;
    } else {
      walkCycle.current = 0;
    }

    // 自前で管理している位置に変位を加算（上下はヘッドボービングを反映）
    positionRef.current.add(displacement);
    positionRef.current.y = baseHeight + bobbingOffset;

    // 物理ボディの位置を更新
    api.position.set(
      positionRef.current.x,
      positionRef.current.y,
      positionRef.current.z
    );

    // カメラを物理ボディに合わせてなめらかに追従
    if (ref.current) {
      state.camera.position.lerp(positionRef.current, 0.2);
      state.camera.rotation.order = "YXZ";
      state.camera.rotation.y = yaw;
      state.camera.rotation.x = 0;
      state.camera.rotation.z = 0;
    }
  });

  // 物理ボディの参照をメッシュに渡すことで、衝突判定や描画の実態が生じます
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const Main = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        camera={{
          position: [20, 12, 20],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <gridHelper args={[50, 50]} />
        <ambientLight intensity={0.5} />
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport />
        </GizmoHelper>

        {/* 物理シミュレーション用のラッパー */}
        <Physics>
          <Room />
          <Player />
        </Physics>
      </Canvas>
    </div>
  );
};

export default Main;
