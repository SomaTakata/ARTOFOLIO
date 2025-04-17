"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Room from "@/components/Room";
import {
  useEffect,
  useRef,
  useState,
  createContext,
  useCallback,
  useMemo,
} from "react";
import { Vector3 } from "three";
import { Physics, useSphere } from "@react-three/cannon";
import { ProfileWithTypedSkills } from "@/server/models/user.schema";
import CombinedControls from "@/components/CombinedControls";

// Teleport locations definition
const LOCATIONS = {
  HOME: {
    position: new Vector3(80, 14, 90),
    label: "Home",
    icon: "Home",
    yaw: Math.PI / 2, // East
  },
  SKILLS: {
    position: new Vector3(-60, 14, 60),
    label: "Skills",
    icon: "BookOpen",
    yaw: Math.PI, // South
  },
  WORKS: {
    position: new Vector3(-30, 14, -90),
    label: "Works",
    icon: "Briefcase",
    yaw: Math.PI / 2, // East
  },
  LINKS: {
    position: new Vector3(30, 14, 30),
    label: "Links",
    icon: "LinkIcon",
    yaw: -Math.PI / 2, // West
  },
};

type LocationKey = keyof typeof LOCATIONS;

// Teleport context for function sharing
interface TeleportContextType {
  teleport: (locationKey: LocationKey) => void;
  currentLocation: LocationKey | null;
}

const TeleportContext = createContext<TeleportContextType>({
  teleport: () => {},
  currentLocation: null,
});

// Custom hook for keyboard input
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
  onPositionChange: (position: { x: number; y: number; z: number }) => void;
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
  const resetRequested = useRef(false);
  const yawRef = useRef(savedState?.rotation ?? LOCATIONS.HOME.yaw);

  // Use saved position if available, otherwise use initial
  const startPosition =
    savedState?.position?.clone() ?? initialPosition.clone();
  const positionRef = useRef(startPosition);

  // Physics sphere for collision detection
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

  // Expose teleport function to parent component
  useEffect(() => {
    // Teleport handler function
    const handleTeleport = (locationKey: LocationKey) => {
      console.log(`Teleporting to: ${locationKey}`);

      const targetPosition = LOCATIONS[locationKey].position;
      const targetYaw = LOCATIONS[locationKey].yaw;

      // Mark reset as requested
      resetRequested.current = true;

      // Pause physics engine
      api.sleep();

      // Reset velocities
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);

      // Set orientation based on location
      yawRef.current = targetYaw;

      // Reset walk cycle
      walkCycle.current = 0;

      // Reset position directly
      api.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

      // Update position reference directly
      positionRef.current.copy(targetPosition);

      // Resume physics engine
      api.wakeUp();

      console.log(
        `Teleport complete: ${locationKey}, orientation: ${targetYaw}`,
        targetPosition
      );
    };

    // Pass teleport function to parent component
    onTeleportReady(handleTeleport);
  }, [api, onTeleportReady]);

  // Subscribe to position changes from physics engine
  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => {
      positionRef.current.set(p[0], p[1], p[2]);

      // Report current position to parent
      onPositionChange({
        x: p[0],
        y: p[1],
        z: p[2],
      });
    });
    return unsubscribe;
  }, [api.position, onPositionChange]);

  useFrame((state, delta) => {
    // If reset is requested, update camera immediately
    if (resetRequested.current) {
      // Set camera directly to player position
      state.camera.position.copy(positionRef.current);

      // Set camera orientation to the specified initial value
      state.camera.rotation.order = "YXZ";
      state.camera.rotation.y = yawRef.current;
      state.camera.rotation.x = 0;
      state.camera.rotation.z = 0;

      // Clear reset request flag
      resetRequested.current = false;

      console.log(
        "Camera position reset complete:",
        positionRef.current,
        "orientation:",
        yawRef.current
      );
      return; // Skip other processing
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

    // Apply velocity to physics body
    if (velocity.length() > 0) {
      // Apply velocity directly through physics API
      api.velocity.set(velocity.x / delta, 0, velocity.z / delta);
    } else {
      // Stop if no keys are pressed
      api.velocity.set(0, 0, 0);
    }

    // Apply head bobbing if moving (and not in reset)
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

      // Apply bobbing to y position via physics API
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

    // Update first-person camera position immediately
    state.camera.position.copy(positionRef.current);

    // Update camera orientation
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
  // Reference to OrbitControls instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current && target) {
      // Access OrbitControls target property
      controlsRef.current.target.copy(target);

      // Set initial position higher (around 40)
      if (controlsRef.current.object) {
        const currentPos = controlsRef.current.object.position;
        controlsRef.current.object.position.set(
          currentPos.x,
          Math.max(currentPos.y, 240),
          currentPos.z
        );
      }
    }
  }, [target]);

  if (cameraMode !== "orbit") return null;

  return <OrbitControls ref={controlsRef} />;
}

type Props = {
  username: string;
  portofolio: ProfileWithTypedSkills;
};

const ProfileTop = ({ username, portofolio }: Props) => {
  // Camera and player state
  const [cameraMode, setCameraMode] = useState<CameraMode>("player");
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [cameraTarget, setCameraTarget] = useState<Vector3 | null>(null);
  const initialPosition = LOCATIONS.HOME.position.clone();
  const [currentPosition, setCurrentPosition] = useState({
    x: initialPosition.x,
    y: initialPosition.y,
    z: initialPosition.z,
  });

  // Teleport functionality state
  const [teleportHandler, setTeleportHandler] = useState<
    ((locationKey: LocationKey) => void) | null
  >(null);
  const [currentLocation, setCurrentLocation] = useState<LocationKey | null>(
    "HOME"
  );

  // Teleport handler function
  const handleTeleport = useCallback(
    (locationKey: LocationKey) => {
      if (teleportHandler) {
        teleportHandler(locationKey);
        setCurrentLocation(locationKey);
      } else {
        console.warn("Teleport handler not set");
      }
    },
    [teleportHandler]
  );

  // Get teleport handler from player
  const handleSetTeleportHandler = useCallback(
    (handler: (locationKey: LocationKey) => void) => {
      setTeleportHandler(() => handler);
    },
    []
  );

  // When switching to orbit mode, save player position as target for OrbitControls
  useEffect(() => {
    if (cameraMode === "orbit" && playerState) {
      setCameraTarget(playerState.position);
    }
  }, [cameraMode, playerState]);

  // Identify the closest location to the current position
  useEffect(() => {
    // Calculate distance to each location
    let closestLocation: LocationKey | null = null;
    let minDistance = Infinity;

    Object.entries(LOCATIONS).forEach(([key, location]) => {
      const pos = location.position;
      const distance = Math.sqrt(
        Math.pow(currentPosition.x - pos.x, 2) +
          Math.pow(currentPosition.z - pos.z, 2)
      );

      // Record the closest location within range
      if (distance < minDistance && distance < 20) {
        minDistance = distance;
        closestLocation = key as LocationKey;
      }
    });

    // Update current location if closest location has changed
    if (closestLocation && closestLocation !== currentLocation) {
      setCurrentLocation(closestLocation);
    } else if (!closestLocation && currentLocation !== null) {
      // If not near any location, set current location to null
      setCurrentLocation(null);
    }
  }, [currentPosition, currentLocation]);

  // Teleport context value
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
        {/* Combined controls UI */}
        <CombinedControls
          cameraMode={cameraMode}
          setCameraMode={setCameraMode}
          teleport={handleTeleport}
          currentLocation={currentLocation}
          portofolio={portofolio}
        />

        <Canvas
          camera={{
            position: [initialPosition.x, initialPosition.y, initialPosition.z],
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
        >
          <CustomOrbitControls cameraMode={cameraMode} target={cameraTarget} />

          {/* Physics simulation wrapper */}
          <Physics>
            <Room username={username} portofolio={portofolio} />
            <Player
              cameraMode={cameraMode}
              onStateChange={setPlayerState}
              savedState={playerState}
              initialPosition={initialPosition}
              onPositionChange={setCurrentPosition}
              onTeleportReady={handleSetTeleportHandler}
            />
          </Physics>
        </Canvas>
      </div>
    </TeleportContext.Provider>
  );
};

export default ProfileTop;
