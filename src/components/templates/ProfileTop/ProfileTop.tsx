"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";
import Room from "@/components/Room";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { Physics, useSphere } from "@react-three/cannon";
import { profileSchemaType } from "@/server/models/user.schema";

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
  const yawRef = useRef(Math.PI / 2);
  const initialPosition = new Vector3(80, 14, 90);
  const positionRef = useRef(initialPosition.clone());

  // Use a dynamic sphere instead of kinematic for proper collision detection
  const [ref, api] = useSphere(() => ({
    mass: 1, // Give it mass so it responds to physics
    position: [initialPosition.x, initialPosition.y, initialPosition.z],
    args: [0.5], // Collision radius
    fixedRotation: true, // Prevent rolling
    linearDamping: 0.95, // Add some drag to stop sliding
    onCollide: (e) => {
      // Optional: Handle collision events (e.g. play sound, visual feedback)
      console.log("Collision detected:", e.body);
    },
  }));

  // Subscribe to position changes from the physics engine
  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => {
      positionRef.current.set(p[0], p[1], p[2]);
    });
    return unsubscribe;
  }, [api.position]);

  useFrame((state, delta) => {
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

    // Apply head bobbing if moving
    let bobbingOffset = 0;
    if (keyState.current.ArrowUp || keyState.current.ArrowDown) {
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

    // Update camera to follow player position with smooth lerp
    state.camera.position.lerp(
      new Vector3(
        positionRef.current.x,
        positionRef.current.y,
        positionRef.current.z
      ),
      0.2
    );

    // Update camera rotation
    state.camera.rotation.order = "YXZ";
    state.camera.rotation.y = yaw;
    state.camera.rotation.x = 0;
    state.camera.rotation.z = 0;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5 * 10, 32, 32]} />
    </mesh>
  );
}

type Props = {
  username: string;
  portofolio: profileSchemaType;
};

const ProfileTop = ({ username, portofolio }: Props) => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        camera={{
          position: [80, 14, 90],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={0.5} />
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport />
        </GizmoHelper>
        {/* <OrbitControls /> */}

        {/* 物理シミュレーション用のラッパー */}
        <Physics>
          <Room
            username={username}
            portofolio={portofolio}
          />
          <Player />
        </Physics>
      </Canvas>
    </div>
  );
};

export default ProfileTop;
