import React, { useEffect } from "react";
import { extend, useThree } from "@react-three/fiber";
import { PCFSoftShadowMap, RectAreaLight } from "three";

// make <rectAreaLight /> available in JSX
extend({ RectAreaLight });

function WallTitleLight({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  isWhiteHandle = false,
}) {

  // enure the renderer supports shadows
  const { gl } = useThree();
  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = PCFSoftShadowMap;
  }, [gl]);

  const handleColor = isWhiteHandle ? "#FFFFFF" : "#333333";

  return (
    <group position={position} rotation={rotation}>
      {/* Wall mount base */}
      <mesh
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.4, 0.3, 0.15]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arm */}
      <mesh
        position={[2.5, 0, 0.35]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[40, 0.15, 0.1]} />
        <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Housing */}
      <group position={[2.5, 0, 0.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[40, 0.25, 0.3]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.135, 0]} castShadow receiveShadow>
          <boxGeometry args={[40, 0.02, 0.25]} />
          <meshStandardMaterial
            color="#fffdf0"
            emissive="#ffffaa"
            emissiveIntensity={0.7}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>

      {/* Rectangular area light shining directly down onto the wall */}
      <rectAreaLight
        width={40}
        height={3.0}
        intensity={8}
        color="#fffaf0"
        // position it just in front of the diffuser
        position={[2.5, 0, 0.55]}
        // rotate so that its "face" points along -Z (towards the wall)
        rotation={[-Math.PI / 2, 0, 0]}
        // NOTE: RectAreaLight does not cast shadows by default
      />

      {/* End caps */}
      <mesh position={[0.1, 0, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[40.2, 0.25, 0.3]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[4.9, 0, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[40.2, 0.25, 0.3]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default WallTitleLight;
