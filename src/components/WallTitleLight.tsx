import { useRef } from "react";
import { useHelper } from "@react-three/drei";
import { PointLightHelper, SpotLightHelper } from "three";

function WallTitleLight({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isWhiteHandle = false,
}) {
  // Handle color based on the parameter
  const handleColor = isWhiteHandle ? "#FFFFFF" : "#333333";

  return (
    <group position={position} rotation={rotation}>
      {/* Wall mount base - slimmer, more modern */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.15]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Sleek horizontal bar */}
      <mesh position={[2.5, 0, 0.35]}>
        <boxGeometry args={[40, 0.15, 0.1]} />
        <meshStandardMaterial
          color={handleColor}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Modern elongated light housing */}
      <group position={[2.5, 0, 0.5]}>
        {/* Main elongated housing */}
        <mesh>
          <boxGeometry args={[40, 0.25, 0.3]} />
          <meshStandardMaterial
            color="#111111"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Light diffuser - long strip */}
        <mesh position={[0, -0.135, 0]}>
          <boxGeometry args={[40, 0.02, 0.25]} />
          <meshStandardMaterial
            color="#fffdf0"
            emissive="#ffffaa"
            emissiveIntensity={0.7}
            transparent={true}
            opacity={0.9}
          />
        </mesh>

        {/* Light source */}
        <pointLight
          position={[-1.5, -10.5, 0]}
          intensity={400}
          distance={30}
          decay={2.5}
          color="#fffaf0"
        />
      </group>

      {/* Decorative end caps */}
      <mesh position={[0.1, 0, 0.5]}>
        <boxGeometry args={[40.2, 0.25, 0.3]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[4.9, 0, 0.5]}>
        <boxGeometry args={[40.2, 0.25, 0.3]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default WallTitleLight;
