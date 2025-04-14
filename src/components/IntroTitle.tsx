import { Text } from "@react-three/drei";
import EditIntroButton from "./EditIntroButton";
import { ProfileWithTypedSkills } from "@/server/models/user.schema";

export default function IntroTitle({
  titlePositon = [0, 0, 0],
  titleRotation = [0, 0, 0],
  descPoisiton = [0, 0, 0],
  descRotation = [0, 0, 0],
  title = "Area Title",
  desc = "Description of the area.",
  color = "black",
  portofolio,
}: {
  titlePositon?: [number, number, number];
  titleRotation?: [number, number, number];
  descPoisiton?: [number, number, number];
  descRotation?: [number, number, number];
  title?: string;
  desc?: string;
  color?: string;
  portofolio: ProfileWithTypedSkills
}) {
  return (
    <group>
      {portofolio.editable &&
        <EditIntroButton currentIntro={portofolio.intro} />
      }
      <Text
        position={titlePositon}
        rotation={titleRotation}
        color={color}        // テキストの色
        fontSize={5}         // フォントサイズ
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
        maxWidth={50}
        fontWeight={400}       // 最大幅
        lineHeight={1.2}     // 行間
        anchorX="left"     // X方向のアンカー位置
        anchorY="top"     // Y方向のアンカー位置
      >
        {desc}
      </Text>
    </group>
  );
}
