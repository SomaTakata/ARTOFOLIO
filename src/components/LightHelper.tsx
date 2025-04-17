type Props = {
  position: [number, number, number];
  rotation: [number, number, number];
  isWhiteHandle?: boolean;
}

function WallMuseumLight({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isWhiteHandle = false,
}: Props) {
  // Handle color based on the new parameter
  const handleColor = isWhiteHandle ? "#FFFFFF" : "#333333";

  return (
    <group position={position} rotation={rotation}>
      {/* Wall mount base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <mesh position={[0, 0, 1.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 2.4, 16]} />
        <meshStandardMaterial
          color={handleColor}
          metalness={isWhiteHandle ? 0.3 : 0.7}
          roughness={isWhiteHandle ? 0.5 : 0.3}
        />
      </mesh>

      <mesh position={[0, 0, 2.4]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={handleColor}
          metalness={isWhiteHandle ? 0.3 : 0.7}
          roughness={isWhiteHandle ? 0.5 : 0.2}
        />
      </mesh>

      <mesh position={[0, -0.5, 2.8]} rotation={[Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.2, 16]} />
        <meshStandardMaterial
          color={handleColor}
          metalness={isWhiteHandle ? 0.3 : 0.7}
          roughness={isWhiteHandle ? 0.5 : 0.3}
        />
      </mesh>

      <group position={[0, -1.1, 3.2]} rotation={[-Math.PI / 4, 0, 0]}>
        {/* Main housing body */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.6, 32]} />
          <meshStandardMaterial
            color="#111111"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.3, 0.3, 32]} />
          <meshStandardMaterial
            color="white"
            emissive="yellow"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="white"
            emissive="yellow"
            emissiveIntensity={1}
          />
        </mesh>

        <pointLight
          position={[0, -11, -7]}
          intensity={150}
          distance={40}
          decay={1.5}
          color="#FFDCA9" 
        />
      </group>
    </group>
  );
}

export default WallMuseumLight;
