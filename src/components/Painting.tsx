import { useTexture } from "@react-three/drei";
import { SCALE, wallYPosition } from "./Room";

export default function Painting({
  pictureUrl,
  framePostion = [0, 0, 0],
  frameRotation = [0, 0, 0],
  picturePosition = [0, 0, 0],
  pictureRotation = [0, 0, 0],
  frameColor = "black",
}: {
  pictureUrl: string;
  framePostion?: [number, number, number];
  frameRotation?: [number, number, number];
  picturePosition?: [number, number, number];
  pictureRotation?: [number, number, number];
  frameColor?: string;
}) {
  const picture = useTexture({
    map: pictureUrl,
  });

  return (
    <group>
      <mesh castShadow position={framePostion} rotation={frameRotation}>
        <boxGeometry args={[24, 24]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      <mesh castShadow position={picturePosition} rotation={pictureRotation}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial map={picture.map} />
      </mesh>
    </group>
  );
}
