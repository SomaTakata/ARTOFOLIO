import Wall from "./Wall";
import Arch from "./Arch";
import AreaTitle from "./AreaTitle";
import Floor from "./Floor";
import IntroTitle from "./IntroTitle";
import { ProfileWithTypedSkills } from "@/server/models/user.schema";
import { Ceiling } from "./Ceiling";
import EditIntroButton from "./EditIntroButton";
import EditSkillsButton from "./EditSkillsButton";
import Work from "./Work";
import EditLinksButton from "./EditLinksButton";

export const SCALE = 2;
export const wallHeight = 24;
export const wallYPosition = wallHeight / 2;
export const wallThick = 5;

type Props = {
  username: string;
  portofolio: ProfileWithTypedSkills;
};

export default function Room({ username, portofolio }: Props) {
  return (
    <>
      {/* 床 */}
      <Floor />

      {/* 左壁 */}
      <Wall
        position={[-30, wallYPosition * SCALE, -60 * SCALE]}
        color="white"
        width={60 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 左壁 LINK */}
      <Wall
        position={[60, wallYPosition * SCALE, -60 * SCALE]}
        color="black"
        width={30 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />

      {/* 右壁 */}
      <Wall
        position={[0, wallYPosition * SCALE, 60 * SCALE]}
        rotation={[0, -Math.PI, 0]}
        color="white"
        width={90 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />

      {/* 前壁 */}
      <Wall
        position={[-45 * SCALE, wallYPosition * SCALE, 0]}
        rotation={[0, Math.PI * 0.5, 0]}
        color="white"
        width={120 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />

      {/* 後壁 */}
      <Wall
        position={[45 * SCALE, wallYPosition * SCALE, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="white"
        width={120 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />

      {/* 最初の壁 */}
      <Wall
        position={[15 * SCALE, wallYPosition * SCALE, 30 * SCALE - 0.1]}
        rotation={[0, -Math.PI, 0]}
        color="white"
        width={60 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />

      {/* キルの壁 */}
      <Wall
        position={[-15 * SCALE, wallYPosition * SCALE, 0]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="black"
        backColor="black"
        width={60 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />

      {/* 作品 */}
      <Wall
        position={[15 * SCALE, wallYPosition * SCALE, -30 * SCALE]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="black"
        backColor="white"
        width={60 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />

      <IntroTitle
        title={`Who's ${username}?`}
        desc={portofolio.intro}
        titlePositon={[15 + 20, wallYPosition * SCALE + 4, 60 * SCALE - 0.3]}
        titleRotation={[0, -Math.PI, 0]}
        descPoisiton={[15 + 20, wallYPosition * SCALE - 2, 60 * SCALE - 0.3]}
        descRotation={[0, -Math.PI, 0]}
      />

      <EditIntroButton currentIntro={portofolio.intro} />

      {/* 作品１ */}
      <Work
        // 画像関連のプロパティ
        pictureUrl={portofolio.works[0].pictureUrl}
        framePosition={[-55, wallYPosition * SCALE, -60 * SCALE + 0.8]}
        picturePosition={[-55, wallYPosition * SCALE, -60 * SCALE + 1.5]}
        // 共通設定
        rotation={[0, 0, 0]}
        color="black"
        // テキスト関連のプロパティ
        title={portofolio.works[0].title}
        description={portofolio.works[0].desc}
        titlePosition={[-30, wallYPosition * SCALE + 10.5, -60 * SCALE + 0.8]}
        descriptionPosition={[
          -30,
          wallYPosition * SCALE + 6.5,
          -60 * SCALE + 0.8,
        ]}
        workIndex={"0"}
      />
      {/* 作品2 */}
      <Work
        // 画像関連のプロパティ
        pictureUrl={portofolio.works[1].pictureUrl}
        framePosition={[-85, wallYPosition * SCALE, -30 + 0.8]}
        picturePosition={[-85, wallYPosition * SCALE, -30 + 1.5]}
        // 共通設定
        rotation={[0, -Math.PI * 0.5, 0]}
        color="white"
        // テキスト関連のプロパティ
        title={portofolio.works[1].title}
        description={portofolio.works[1].desc}
        titlePosition={[-60, wallYPosition * SCALE + 10.5, -30 + 0.8]}
        descriptionPosition={[-60, wallYPosition * SCALE + 6.5, -30 + 0.8]}
        workIndex={"1"}
      />
      {/* 作品3 */}
      <Work
        // 画像関連のプロパティ
        pictureUrl={portofolio.works[2].pictureUrl}
        framePosition={[-25, wallYPosition * SCALE, -30 + 0.8]}
        picturePosition={[-25, wallYPosition * SCALE, -30 + 1.5]}
        // 共通設定
        rotation={[0, Math.PI * 0.5, 0]}
        color="white"
        // テキスト関連のプロパティ
        title={portofolio.works[2].title}
        description={portofolio.works[2].desc}
        titlePosition={[0, wallYPosition * SCALE + 10.5, -30 + 0.8]}
        descriptionPosition={[0, wallYPosition * SCALE + 6.5, -30 + 0.8]}
        workIndex={"2"}
      />
      {/* 作品4 */}
      <Work
        // 画像関連のプロパティ
        pictureUrl={portofolio.works[3].pictureUrl}
        framePosition={[-55, wallYPosition * SCALE, -60 + 0.8]}
        picturePosition={[-55, wallYPosition * SCALE, -60 + 1.5]}
        // 共通設定
        rotation={[0, Math.PI, 0]}
        color="black"
        // テキスト関連のプロパティ
        title={portofolio.works[3].title}
        description={portofolio.works[3].desc}
        titlePosition={[-30, wallYPosition * SCALE + 10.5, -60 + 0.8]}
        descriptionPosition={[-30, wallYPosition * SCALE + 6.5, -60 + 0.8]}
        workIndex={"3"}
      />

      <AreaTitle
        title="SKILLS"
        desc="This area showcases my strongest tech stack."
        titlePositon={[
          -67.5 + 7.5 + 20,
          wallYPosition * SCALE + 4,
          60 * SCALE - 0.3,
        ]}
        titleRotation={[0, -Math.PI, 0]}
        descPoisiton={[
          -67.5 + 7.5 + 20,
          wallYPosition * SCALE - 2,
          60 * SCALE - 0.3,
        ]}
        descRotation={[0, -Math.PI, 0]}
      />

      <AreaTitle
        title="WORKS"
        desc="This area showcases my works."
        titlePositon={[
          -45 * SCALE + 0.5,
          wallYPosition * SCALE + 4,
          -45 * SCALE + 20,
        ]}
        titleRotation={[0, Math.PI * 0.5, 0]}
        descPoisiton={[
          -45 * SCALE + 0.5,
          wallYPosition * SCALE - 2,
          -45 * SCALE + 20,
        ]}
        descRotation={[0, Math.PI * 0.5, 0]}
      />

      <AreaTitle
        title="LINKS"
        desc="This area showcases my social medias."
        titlePositon={[
          45 * SCALE - 0.5,
          wallYPosition * SCALE + 4,
          15 * SCALE - 20,
        ]}
        titleRotation={[0, -Math.PI * 0.5, 0]}
        descPoisiton={[
          45 * SCALE - 0.5,
          wallYPosition * SCALE - 2,
          15 * SCALE - 20,
        ]}
        descRotation={[0, -Math.PI * 0.5, 0]}
      />

      {/*青壁のスキル絵画 */}
      <EditSkillsButton
        skills={portofolio.skills}
        editNum={0}
        portofolio={portofolio}
      />

      <EditSkillsButton
        skills={portofolio.skills}
        editNum={1}
        portofolio={portofolio}
        framePosition={[
          -45 * SCALE + 0.5,
          wallYPosition * SCALE,
          120 - 26 - 24 - 23 - 12,
        ]}
        frameRotation={[0, Math.PI * 0.5, 0]}
        picturePosition={[
          -45 * SCALE + 1.1,
          wallYPosition * SCALE,
          120 - 26 - 24 - 23 - 12,
        ]}
        pictureRotation={[0, Math.PI * 0.5, 0]}
      />

      <EditSkillsButton
        skills={portofolio.skills}
        editNum={2}
        portofolio={portofolio}
        framePosition={[
          -45 * SCALE + 0.5,
          wallYPosition * SCALE,
          120 - 26 - 12,
        ]}
        frameRotation={[0, Math.PI * 0.5, 0]}
        picturePosition={[
          -45 * SCALE + 1.1,
          wallYPosition * SCALE,
          120 - 26 - 12,
        ]}
        pictureRotation={[0, Math.PI * 0.5, 0]}
      />

      {/*ピンク壁のスキル絵画 */}
      <EditSkillsButton
        skills={portofolio.skills}
        editNum={3}
        portofolio={portofolio}
        framePosition={[-15 * SCALE - 0.8, wallYPosition * SCALE, 60 - 21 - 12]}
        frameRotation={[0, -Math.PI * 0.5, 0]}
        picturePosition={[
          -15 * SCALE - 1.5,
          wallYPosition * SCALE,
          60 - 21 - 12,
        ]}
        pictureRotation={[0, -Math.PI * 0.5, 0]}
        color="white"
        textColor="black"
      />

      <EditSkillsButton
        skills={portofolio.skills}
        editNum={4}
        portofolio={portofolio}
        framePosition={[
          -15 * SCALE - 0.8,
          wallYPosition * SCALE,
          60 - 21 - 24 - 20 - 12,
        ]}
        frameRotation={[0, -Math.PI * 0.5, 0]}
        picturePosition={[
          -15 * SCALE - 1.5,
          wallYPosition * SCALE,
          60 - 21 - 24 - 20 - 12,
        ]}
        pictureRotation={[0, -Math.PI * 0.5, 0]}
        color="white"
        textColor="black"
      />

      {/* リンク 壁右側*/}
      <EditLinksButton
        skills={portofolio.skills}
        editNum={3}
        portofolio={portofolio}
        framePosition={[
          45 * SCALE - 0.5,
          wallYPosition * SCALE,
          -120 + 21 + 12,
        ]}
        frameRotation={[0, -Math.PI * 0.5, 0]}
        picturePosition={[
          45 * SCALE - 1.1,
          wallYPosition * SCALE,
          -120 + 21 + 12,
        ]}
        pictureRotation={[0, -Math.PI * 0.5, 0]}
        color="black"
        textColor="white"
      />

      <EditLinksButton
        skills={portofolio.skills}
        editNum={3}
        portofolio={portofolio}
        framePosition={[
          45 * SCALE - 0.5,
          wallYPosition * SCALE,
          -120 + 21 + 12 + 20 + 24,
        ]}
        frameRotation={[0, -Math.PI * 0.5, 0]}
        picturePosition={[
          45 * SCALE - 1.1,
          wallYPosition * SCALE,
          -120 + 21 + 12 + 20 + 24,
        ]}
        pictureRotation={[0, -Math.PI * 0.5, 0]}
        color="black"
        textColor="white"
      />
      {/* リンク 壁左側*/}
      <EditLinksButton
        skills={portofolio.skills}
        editNum={3}
        portofolio={portofolio}
        framePosition={[30 + 0.8, wallYPosition * SCALE, -120 + 21 + 12]}
        frameRotation={[0, Math.PI * 0.5, 0]}
        picturePosition={[30 + 1.5, wallYPosition * SCALE, -120 + 21 + 12]}
        pictureRotation={[0, Math.PI * 0.5, 0]}
        color="black"
        textColor="white"
      />

      <EditLinksButton
        skills={portofolio.skills}
        editNum={3}
        portofolio={portofolio}
        framePosition={[
          30 + 0.8,
          wallYPosition * SCALE,
          -120 + 21 + 12 + 20 + 24,
        ]}
        frameRotation={[0, Math.PI * 0.5, 0]}
        picturePosition={[
          30 + 1.5,
          wallYPosition * SCALE,
          -120 + 21 + 12 + 20 + 24,
        ]}
        pictureRotation={[0, Math.PI * 0.5, 0]}
        color="black"
        textColor="white"
      />

      {/* リンク 壁正面*/}
      <EditLinksButton
        skills={portofolio.skills}
        editNum={3}
        portofolio={portofolio}
        framePosition={[60, wallYPosition * SCALE, -120 + 0.8]}
        frameRotation={[0, 0, 0]}
        picturePosition={[60, wallYPosition * SCALE, -120 + 1.5]}
        pictureRotation={[0, 0, 0]}
        color="white"
        textColor="black"
      />

      <Arch
        lPosition={[
          (-45 + 8 / 2) * SCALE,
          8 * SCALE,
          -30 * SCALE + (wallThick / 2) * SCALE,
        ]}
        lRotation={[0, -Math.PI, 0]}
        rPosition={[
          (-15 - 8 / 2) * SCALE,
          8 * SCALE,
          -30 * SCALE + (wallThick / 2) * SCALE,
        ]}
        rRotation={[0, -Math.PI, 0]}
        tPositon={[
          -30 * SCALE,
          20 * SCALE,
          -30 * SCALE + (wallThick / 2) * SCALE,
        ]}
        tRotation={[0, -Math.PI, 0]}
        logoRotation={[0, 0, 0]}
        logoPosition={[
          -30 * SCALE,
          20 * SCALE,
          -30 * SCALE + (wallThick + 0.3) + (wallThick / 2) * SCALE,
        ]}
      />

      <Arch
        lPosition={[
          (45 - 8 / 2) * SCALE,
          8 * SCALE,
          0 * SCALE - (wallThick / 2) * SCALE,
        ]}
        lRotation={[0, -Math.PI, 0]}
        rPosition={[
          (15 + 8 / 2) * SCALE,
          8 * SCALE,
          0 * SCALE - (wallThick / 2) * SCALE,
        ]}
        rRotation={[0, -Math.PI, 0]}
        tPositon={[30 * SCALE, 20 * SCALE, 0 * SCALE - (wallThick / 2) * SCALE]}
        tRotation={[0, -Math.PI, 0]}
        logoRotation={[0, 0, 0]}
        logoPosition={[
          30 * SCALE,
          20 * SCALE,
          0 * SCALE + (wallThick + 0.3) - (wallThick / 2) * SCALE,
        ]}
      />

      {/*ロゴは厚みで埋もれないようにするために0.3分調整 */}
      <Arch
        lPosition={[
          -15 * SCALE + (wallThick / 2) * SCALE,
          8 * SCALE,
          (30 + 8 / 2) * SCALE,
        ]}
        lRotation={[0, -Math.PI * 0.5, 0]}
        rPosition={[
          -15 * SCALE + (wallThick / 2) * SCALE,
          8 * SCALE,
          (60 - 8 / 2) * SCALE,
        ]}
        rRotation={[0, -Math.PI * 0.5, 0]}
        tPositon={[
          -15 * SCALE + (wallThick / 2) * SCALE,
          20 * SCALE,
          45 * SCALE,
        ]}
        tRotation={[0, -Math.PI * 0.5, 0]}
        logoRotation={[0, Math.PI / 2, 0]}
        logoPosition={[
          -15 * SCALE + (wallThick + 0.3) + (wallThick / 2) * SCALE,
          20 * SCALE,
          45 * SCALE,
        ]}
      />
      <ambientLight intensity={6} />
      {/* 天井 */}
      <Ceiling />
    </>
  );
}
