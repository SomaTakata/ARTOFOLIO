import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

// Component that loads a GLB model of a potted plant.
export default function PlantModel2({
  url = '/plant2.glb',
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
}) {
  // Load GLB
  const gltf = useGLTF(url);
  const group = useRef(null);

  return (
    <group ref={group} position={position} scale={scale} dispose={null}> 
      <primitive object={gltf.scene} castShadow receiveShadow  />
    </group>
  );
}
