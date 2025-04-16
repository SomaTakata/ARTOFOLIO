"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";
import Room from "@/components/Room";
import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Vector3 } from "three";
import { Physics, useSphere } from "@react-three/cannon";
import { ProfileWithTypedSkills } from "@/server/models/user.schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Orbit,
  Crosshair,
  BookOpen,
  Briefcase,
  Link as LinkIcon,
} from "lucide-react";

// 各テレポート地点の定義（位置と初期向きを含む）
const LOCATIONS = {
  HOME: {
    position: new Vector3(80, 14, 90),
    label: "Home",
    icon: Home,
    yaw: Math.PI / 2, // 東向き
  },
  SKILLS: {
    position: new Vector3(-60, 14, 60),
    label: "Skills",
    icon: BookOpen,
    yaw: Math.PI, // 南向き
  },
  WORKS: {
    position: new Vector3(-30, 14, -90),
    label: "Works",
    icon: Briefcase,
    yaw: Math.PI / 2, // 東向き
  },
  LINKS: {
    position: new Vector3(30, 14, 30),
    label: "Links",
    icon: LinkIcon,
    yaw: -Math.PI / 2, // 西向き
  },
};

type LocationKey = keyof typeof LOCATIONS;

// テレポート機能用のコンテキスト
interface TeleportContextType {
  teleport: (locationKey: LocationKey) => void;
  currentLocation: LocationKey | null;
}

const TeleportContext = createContext<TeleportContextType>({
  teleport: () => { },
  currentLocation: null,
});

// カスタムフックでテレポートコンテキストを使用
function useTeleport() {
  return useContext(TeleportContext);
}

// キーボード入力を監視するカスタムフック
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

type CameraMode = "player" | "orbit";

type PlayerState = {
  position: Vector3;
  rotation: number;
};

interface PlayerProps {
  cameraMode: CameraMode;
  onStateChange: (state: PlayerState) => void;
  savedState: PlayerState | null;
  initialPosition: Vector3;
  onPositionChange: (offset: { x: number; y: number }) => void;
  onTeleportReady: (handler: (locationKey: LocationKey) => void) => void;
}

function Player({
  cameraMode,
  onStateChange,
  savedState,
  initialPosition,
  onPositionChange,
  onTeleportReady,
}: PlayerProps) {
  const keyState = useKeyboardInput();
  const walkCycle = useRef(0);

  // テレポート要求を処理するための参照
  const resetRequested = useRef(false);

  // Use saved yaw if available, otherwise default
  const yawRef = useRef(savedState?.rotation ?? LOCATIONS.HOME.yaw);

  // Use saved position if available, otherwise use initial
  const startPosition =
    savedState?.position?.clone() ?? initialPosition.clone();
  const positionRef = useRef(startPosition);

  // Calculate room center
  const roomCenter = useRef(new Vector3(80, 0, 80));

  // Use a dynamic sphere instead of kinematic for proper collision detection
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [startPosition.x, startPosition.y, startPosition.z],
    args: [0.5], // Collision radius
    fixedRotation: true,
    linearDamping: 0.95,
    onCollide: (e) => {
      console.log("Collision detected:", e.body);
    },
  }));

  // テレポート機能を親コンポーネントに公開
  useEffect(() => {
    // テレポート処理関数
    const handleTeleport = (locationKey: LocationKey) => {
      console.log(`テレポート開始: ${locationKey}`);

      const targetPosition = LOCATIONS[locationKey].position;
      const targetYaw = LOCATIONS[locationKey].yaw;

      // リセット要求をフラグで記録
      resetRequested.current = true;

      // 物理エンジンを一時停止
      api.sleep();

      // 速度をゼロに
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);

      // 各地点に応じた向きをセット
      yawRef.current = targetYaw;

      // 歩行サイクルをリセット
      walkCycle.current = 0;

      // 位置を直接リセット
      api.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

      // 参照位置を直接更新
      positionRef.current.copy(targetPosition);

      // 物理エンジンを再開
      api.wakeUp();

      console.log(
        `テレポート完了: ${locationKey}, 向き: ${targetYaw}`,
        targetPosition
      );
    };

    // テレポート関数を親コンポーネントに渡す
    onTeleportReady(handleTeleport);
  }, [api, onTeleportReady]);

  // Subscribe to position changes from the physics engine
  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => {
      positionRef.current.set(p[0], p[1], p[2]);

      // Calculate and report offset from center
      const offset = {
        x: p[0] - roomCenter.current.x,
        y: p[2] - roomCenter.current.z,
      };
      onPositionChange(offset);

      // Report current position
      window.dispatchEvent(
        new CustomEvent("playerPositionUpdate", {
          detail: { x: p[0], y: p[1], z: p[2] },
        })
      );
    });
    return unsubscribe;
  }, [api.position, onPositionChange]);

  useFrame((state, delta) => {
    // リセットが要求されている場合はカメラを即座に更新
    if (resetRequested.current) {
      // カメラを直接プレイヤー位置に設定
      state.camera.position.copy(positionRef.current);

      // カメラの向きも設定された初期値に
      state.camera.rotation.order = "YXZ";
      state.camera.rotation.y = yawRef.current;
      state.camera.rotation.x = 0;
      state.camera.rotation.z = 0;

      // リセット要求フラグをクリア
      resetRequested.current = false;

      console.log(
        "カメラ位置をリセット完了:",
        positionRef.current,
        "向き:",
        yawRef.current
      );
      return; // 他の処理をスキップ
    }

    // Skip updates if in orbit mode
    if (cameraMode !== "player") {
      // Save current state when switching to orbit mode
      onStateChange({
        position: positionRef.current.clone(),
        rotation: yawRef.current,
      });
      return;
    }

    const movementSpeed = 10 * 3;
    const rotationSpeed = Math.PI;

    // Update yaw from keyboard input
    let yaw = yawRef.current;
    if (keyState.current.ArrowLeft) {
      yaw += rotationSpeed * delta;
    }
    if (keyState.current.ArrowRight) {
      yaw -= rotationSpeed * delta;
    }
    yawRef.current = yaw;

    // Calculate forward vector based on current yaw
    const forward = new Vector3(0, 0, -1)
      .applyAxisAngle(new Vector3(0, 1, 0), yaw)
      .normalize();

    // Calculate desired velocity based on input
    const velocity = new Vector3();
    if (keyState.current.ArrowUp) {
      velocity.add(forward.clone().multiplyScalar(movementSpeed * delta));
    }
    if (keyState.current.ArrowDown) {
      velocity.add(forward.clone().multiplyScalar(-movementSpeed * delta));
    }

    // Apply velocity to the physics body
    if (velocity.length() > 0) {
      // Apply velocity directly through physics API
      api.velocity.set(velocity.x / delta, 0, velocity.z / delta);
    } else {
      // Stop if no keys are pressed
      api.velocity.set(0, 0, 0);
    }

    // Apply head bobbing if moving (リセット中は行わない)
    let bobbingOffset = 0;
    if (
      (keyState.current.ArrowUp || keyState.current.ArrowDown) &&
      !resetRequested.current
    ) {
      walkCycle.current += delta * movementSpeed;
      const bobbingAmplitude = 0.07;
      const bobbingFrequency = 1;
      bobbingOffset =
        Math.sin(walkCycle.current * bobbingFrequency) * bobbingAmplitude;

      // Apply bobbing to the y position using the physics API
      api.position.set(
        positionRef.current.x,
        initialPosition.y + bobbingOffset,
        positionRef.current.z
      );
    } else {
      walkCycle.current = 0;
      // Reset height when not moving
      api.position.set(
        positionRef.current.x,
        initialPosition.y,
        positionRef.current.z
      );
    }

    // ファーストパーソン視点のためのカメラ位置を即座に更新
    state.camera.position.copy(positionRef.current);

    // カメラの向きを更新
    state.camera.rotation.order = "YXZ";
    state.camera.rotation.y = yaw;
    state.camera.rotation.x = 0;
    state.camera.rotation.z = 0;
  });

  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[0.5, 32, 32]} />
    </mesh>
  );
}

interface OrbitControlsProps {
  cameraMode: CameraMode;
  target: Vector3 | null;
}

// Custom OrbitControls that maintains camera state
function CustomOrbitControls({ cameraMode, target }: OrbitControlsProps) {
  // OrbitControlsのインスタンスを参照
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current && target) {
      // OrbitControlsのtargetプロパティにアクセス
      controlsRef.current.target.copy(target);
    }
  }, [target]);

  if (cameraMode !== "orbit") return null;

  return <OrbitControls ref={controlsRef} />;
}

interface ControlsUIProps {
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  playerPosition: { x: number; y: number; z: number };
}

// UI Components for camera controls and teleport
function ControlsUI({
  cameraMode,
  setCameraMode,
  playerPosition,
}: ControlsUIProps) {
  // テレポート機能へのアクセス
  const { teleport, currentLocation } = useTeleport();

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-10">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant={cameraMode === "player" ? "default" : "outline"}
            size="sm"
            onClick={() => setCameraMode("player")}
            className="flex items-center gap-2"
          >
            <Crosshair size={16} /> Player
          </Button>
          <Button
            variant={cameraMode === "orbit" ? "default" : "outline"}
            size="sm"
            onClick={() => setCameraMode("orbit")}
            className="flex items-center gap-2"
          >
            <Orbit size={16} /> Orbit
          </Button>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-xs font-semibold opacity-70">テレポート</h3>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(LOCATIONS) as Array<LocationKey>).map((key) => {
              const location = LOCATIONS[key];
              const Icon = location.icon;
              return (
                <Button
                  key={key}
                  variant={currentLocation === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => teleport(key)}
                  className="flex items-center gap-1"
                >
                  <Icon size={14} /> {location.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="mt-2 text-sm">
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="flex justify-between">
              <span>X:</span> <span>{playerPosition.x.toFixed(2)}</span>
            </Badge>
            <Badge variant="outline" className="flex justify-between">
              <span>Z:</span> <span>{playerPosition.z.toFixed(2)}</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  username: string;
  portofolio: ProfileWithTypedSkills;
};

const ProfileTop = ({ username, portofolio }: Props) => {
  // カメラとプレイヤーの状態
  const [cameraMode, setCameraMode] = useState<CameraMode>("player");
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [cameraTarget, setCameraTarget] = useState<Vector3 | null>(null);
  const initialPosition = LOCATIONS.HOME.position.clone();
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({
    x: initialPosition.x,
    y: initialPosition.y,
    z: initialPosition.z,
  });

  // テレポート機能の状態
  const [teleportHandler, setTeleportHandler] = useState<
    ((locationKey: LocationKey) => void) | null
  >(null);
  const [currentLocation, setCurrentLocation] = useState<LocationKey | null>(
    "HOME"
  );

  // テレポート処理関数
  const handleTeleport = useCallback(
    (locationKey: LocationKey) => {
      if (teleportHandler) {
        teleportHandler(locationKey);
        setCurrentLocation(locationKey);
      } else {
        console.warn("テレポートハンドラーが設定されていません");
      }
    },
    [teleportHandler]
  );

  // プレイヤーからテレポートハンドラを受け取る
  const handleSetTeleportHandler = useCallback(
    (handler: (locationKey: LocationKey) => void) => {
      setTeleportHandler(() => handler);
    },
    []
  );

  // Listen for player position updates
  useEffect(() => {
    const handlePositionUpdate = (
      e: CustomEvent<{ x: number; y: number; z: number }>
    ) => {
      setCurrentPosition(e.detail);
    };

    window.addEventListener(
      "playerPositionUpdate",
      handlePositionUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "playerPositionUpdate",
        handlePositionUpdate as EventListener
      );
    };
  }, []);

  // When switching to orbit mode, save the player position as target for OrbitControls
  useEffect(() => {
    if (cameraMode === "orbit" && playerState) {
      setCameraTarget(playerState.position);
    }
  }, [cameraMode, playerState]);

  // 現在地から最も近い地点を特定する処理
  useEffect(() => {
    // 各地点との距離を計算
    let closestLocation: LocationKey | null = null;
    let minDistance = Infinity;

    Object.entries(LOCATIONS).forEach(([key, location]) => {
      const pos = location.position;
      const distance = Math.sqrt(
        Math.pow(currentPosition.x - pos.x, 2) +
        Math.pow(currentPosition.z - pos.z, 2)
      );

      // 一定範囲内で最も近い地点を記録
      if (distance < minDistance && distance < 20) {
        minDistance = distance;
        closestLocation = key as LocationKey;
      }
    });

    // 最も近い地点があれば現在地を更新
    if (closestLocation && closestLocation !== currentLocation) {
      setCurrentLocation(closestLocation);
    } else if (!closestLocation && currentLocation !== null) {
      // どの地点にも近くない場合は現在地をnullに
      setCurrentLocation(null);
    }
  }, [currentPosition, currentLocation]);

  // テレポートコンテキスト値
  const teleportContextValue = useMemo(
    () => ({
      teleport: handleTeleport,
      currentLocation,
    }),
    [handleTeleport, currentLocation]
  );

  return (
    <TeleportContext.Provider value={teleportContextValue}>
      <div className="relative w-full h-screen overflow-hidden">
        <ControlsUI
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
          playerPosition={currentPosition}
        />

        <Canvas
          // shadows
          camera={{
            position: [initialPosition.x, initialPosition.y, initialPosition.z],
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
        >
          <ambientLight intensity={0.2} />
          <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
            <GizmoViewport />
          </GizmoHelper>

          <CustomOrbitControls cameraMode={cameraMode} target={cameraTarget} />

          {/* 物理シミュレーション用のラッパー */}
          <Physics>
            <Room username={username} portofolio={portofolio} />
            <Player
              cameraMode={cameraMode}
              onStateChange={setPlayerState}
              savedState={playerState}
              initialPosition={initialPosition}
              onPositionChange={setCurrentOffset}
              onTeleportReady={handleSetTeleportHandler}
            />
          </Physics>
        </Canvas>
      </div>
    </TeleportContext.Provider>
  );
};

export default ProfileTop;
