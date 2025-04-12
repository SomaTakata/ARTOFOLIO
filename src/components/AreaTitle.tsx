import { Text } from "@react-three/drei";
import { SCALE, wallYPosition } from "./Room";

export default function AreaTitle({
  titlePositon = [0, 0, 0],
  titleRotation = [0, 0, 0],
  descPoisiton = [0, 0, 0],
  descRotation = [0, 0, 0],
  title = "Area Title",
  desc = "Description of the area.",
  color = "black",
}: {
  titlePositon?: [number, number, number];
  titleRotation?: [number, number, number];
  descPoisiton?: [number, number, number];
  descRotation?: [number, number, number];
  title?: string;
  desc?: string;
  color?: string;
}) {
  return (
    <group>
      <Text
        position={titlePositon}
        rotation={titleRotation}
        color={color}        // テキストの色
        fontSize={7}         // フォントサイズ
        maxWidth={100}
        fontWeight={700}       // 最大幅
        lineHeight={1.2}     // 行間
        anchorX="left"     // X方向のアンカー位置
        anchorY="middle"     // Y方向のアンカー位置
      >{title}</Text>

      <Text
        position={descPoisiton}
        rotation={descRotation}
        color={color}      // テキストの色
        fontSize={2}         // フォントサイズ
        maxWidth={100}
        fontWeight={400}       // 最大幅
        lineHeight={1.2}     // 行間
        anchorX="left"     // X方向のアンカー位置
        anchorY="middle"     // Y方向のアンカー位置
      >
        {desc}
      </Text>
    </group>
  );
}
