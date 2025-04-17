import { Text, useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Texture } from "three";
import EditWorksButton from "./EditWorksButton";
import { ProfileWithTypedSkills } from "@/server/models/user.schema";
import { ClickableLink } from "./ClickableLink";

/**
 * ワーク（作品）を表示するためのコンポーネント
 * 画像プレビューとタイトル・説明文を一括で表示します
 */
export default function Work({
  // 画像関連
  pictureUrl,
  framePosition = [0, 0, 0],
  picturePosition = [0, 0, 0],

  // 共通設定
  rotation = [0, 0, 0],
  color = "black",

  // テキスト関連
  title = "Work Title",
  description = "Work description goes here.",
  titlePosition = [0, 0, 0],
  descriptionPosition = [0, 0, 0],
  workIndex,
  portofolio,
  siteUrl,
}: {
  siteUrl: string;
  pictureUrl: string;
  framePosition?: [number, number, number];
  picturePosition?: [number, number, number];

  rotation?: [number, number, number];
  color?: string;

  title?: string;
  description?: string;
  titlePosition?: [number, number, number];
  descriptionPosition?: [number, number, number];
  workIndex: string;
  portofolio: ProfileWithTypedSkills;
}) {
  // 画像のテクスチャをロード
  const picture = useTexture({
    map: pictureUrl,
  });

  // 固定の横長フレームサイズ
  const FRAME_WIDTH = 36;
  const FRAME_HEIGHT = 24;
  const FRAME_PADDING = 2;

  // 画像のサイズと縦横比を管理する状態
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
    pictureScale: number;
    offsetX: number;
    offsetY: number;
  }>({
    width: 0,
    height: 0,
    pictureScale: 1,
    offsetX: 0,
    offsetY: 0,
  });

  // テクスチャがロードされたら縦横比を計算して適用
  useEffect(() => {
    if (picture.map) {
      calculateDimensions(picture.map);
    }
  }, [picture.map]);

  // 画像の縦横比に基づいて表示スケールとオフセットを計算
  const calculateDimensions = (texture: Texture) => {
    const image = texture.image;
    if (!image) return;

    const imgWidth = image.width;
    const imgHeight = image.height;
    const imgAspectRatio = imgWidth / imgHeight;
    const frameAspectRatio =
      (FRAME_WIDTH - FRAME_PADDING) / (FRAME_HEIGHT - FRAME_PADDING);

    let pictureScale = 1;
    let offsetX = 0;
    let offsetY = 0;

    // object-fit: cover のように振る舞うための計算
    if (imgAspectRatio >= frameAspectRatio) {
      // 画像が横長すぎる場合、高さに合わせる
      pictureScale = (FRAME_HEIGHT - FRAME_PADDING) / imgHeight;
      offsetX = 0; // 横方向のオフセットはなし
    } else {
      // 画像が縦長または正方形の場合、幅に合わせる
      pictureScale = (FRAME_WIDTH - FRAME_PADDING) / imgWidth;
      offsetY = 0; // 縦方向のオフセットはなし
    }

    setDimensions({
      width: imgWidth,
      height: imgHeight,
      pictureScale,
      offsetX,
      offsetY,
    });
  };

  return (
    <group rotation={rotation}>
      {/* 画像プレビュー部分 */}
      <group>
        {/* フレーム - 常に固定の横長サイズ */}
        <mesh castShadow receiveShadow position={framePosition}>
          <boxGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* 写真 - テクスチャをスケーリングして表示 */}
        <mesh castShadow receiveShadow position={picturePosition}>
          <planeGeometry
            args={[FRAME_WIDTH - FRAME_PADDING, FRAME_HEIGHT - FRAME_PADDING]}
          />
          <meshBasicMaterial map={picture.map} toneMapped={false} />
        </mesh>

        {portofolio.editable && (
          <EditWorksButton
            workIndex={workIndex}
            title={title}
            desc={description}
            siteUrl={siteUrl}
            position={[
              picturePosition[0],
              picturePosition[1] - 15,
              picturePosition[2],
            ]}
          />
        )}
      </group>

      {/* テキスト説明部分 */}
      <group>
        {/* タイトル */}
        {portofolio.works[Number(workIndex)].siteUrl && <ClickableLink
          url={portofolio.works[Number(workIndex)].siteUrl}
        >
          <Text
            position={titlePosition}
            color={color}
            fontSize={3}
            maxWidth={100}
            fontWeight={700}
            lineHeight={1.2}
            anchorX="left"
            anchorY="middle"
          >
            🔗{title}
          </Text>
        </ClickableLink>}

        {!portofolio.works[Number(workIndex)].siteUrl &&
          <Text
            position={titlePosition}
            color={color}
            fontSize={3}
            maxWidth={100}
            fontWeight={700}
            lineHeight={1.2}
            anchorX="left"
            anchorY="middle"
          >
            {title}
          </Text>}



        {/* 説明文 */}
        <Text
          position={descriptionPosition}
          color={color}
          fontSize={1.5}
          maxWidth={45}
          fontWeight={500}
          lineHeight={1.2}
          anchorX="left"
          anchorY="top"
        >
          {description}
        </Text>
      </group>
    </group>
  );
}
