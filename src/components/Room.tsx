import Wall from "./Wall";
import Arch from "./Arch";
import AreaTitle from "./AreaTitle";
import Floor from "./Floor";
import IntroTitle from "./IntroTitle";
import { ProfileWithTypedSkills } from "@/server/models/user.schema";
import { Ceiling } from "./Ceiling";
import EditIntroButton from "./EditIntroButton";
import EditSkillsButton from "./EditSkillsButton";

export const SCALE = 2;
export const wallHeight = 24
export const wallYPosition = wallHeight / 2
export const wallThick = 5

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
        position={[0, wallYPosition * SCALE, -60 * SCALE]}
        color="white"
        width={90 * SCALE}
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
        position={[15 * SCALE, wallYPosition * SCALE, 30 * SCALE]}
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
        width={60 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />
      {/* 作品 */}
      <Wall
        position={[15 * SCALE, wallYPosition * SCALE, -30 * SCALE]}
        rotation={[0, -Math.PI * 0.5, 0]}
        color="black"
        width={60 * SCALE}
        height={wallHeight * SCALE}
        depth={0.1 * SCALE}
      />

      <IntroTitle
        title={`Who's ${username}?`}
        desc={portofolio.intro}
        titlePositon={[15 + 20, wallYPosition * SCALE + 8, 60 * SCALE - 0.3]}
        titleRotation={[0, -Math.PI, 0]}
        descPoisiton={[15 + 20, wallYPosition * SCALE + 3, 60 * SCALE - 0.3]}
        descRotation={[0, -Math.PI, 0]}
      />

      <EditIntroButton
        currentIntro={portofolio.intro}
      />

      <AreaTitle
        title="SKILLS"
        desc="This area showcases my strongest tech stack."
        titlePositon={[-67.5 + 7.5 + 20, wallYPosition * SCALE + 8, 60 * SCALE - 0.3]}
        titleRotation={[0, -Math.PI, 0]}
        descPoisiton={[-67.5 + 7.5 + 20, wallYPosition * SCALE + 3, 60 * SCALE - 0.3]}
        descRotation={[0, -Math.PI, 0]}
      />

      <AreaTitle
        title="WORKS"
        desc="This area showcases my works."
        titlePositon={[-45 * SCALE + 0.5, wallYPosition * SCALE + 4, -45 * SCALE + 20]}
        titleRotation={[0, Math.PI * 0.5, 0]}
        descPoisiton={[-45 * SCALE + 0.5, wallYPosition * SCALE - 2, -45 * SCALE + 20]}
        descRotation={[0, Math.PI * 0.5, 0]}
      />

      <AreaTitle
        title="LINKS"
        desc="This area showcases my social medias."
        titlePositon={[45 * SCALE - 0.5, wallYPosition * SCALE + 4, 15 * SCALE - 20]}
        titleRotation={[0, -Math.PI * 0.5, 0]}
        descPoisiton={[45 * SCALE - 0.5, wallYPosition * SCALE - 2, 15 * SCALE - 20]}
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
        framePosition={[-45 * SCALE + 0.5, wallYPosition * SCALE, 120 - 26 - 24 - 23 - 12]}
        frameRotation={[0, Math.PI * 0.5, 0]}
        picturePosition={[-45 * SCALE + 1.1, wallYPosition * SCALE, 120 - 26 - 24 - 23 - 12]}
        pictureRotation={[0, Math.PI * 0.5, 0]}
      />

      <EditSkillsButton
        skills={portofolio.skills}
        editNum={2}
        portofolio={portofolio}
        framePosition={[-45 * SCALE + 0.5, wallYPosition * SCALE, 120 - 26 - 12]}
        frameRotation={[0, Math.PI * 0.5, 0]}
        picturePosition={[-45 * SCALE + 1.1, wallYPosition * SCALE, 120 - 26 - 12]}
        pictureRotation={[0, Math.PI * 0.5, 0]}
      />

      {/*ピンク壁のスキル絵画 */}
      <EditSkillsButton
        skills={portofolio.skills}
        editNum={3}
        portofolio={portofolio}
        framePosition={[-15 * SCALE - 0.5, wallYPosition * SCALE, 60 - 21 - 12]}
        frameRotation={[0, -Math.PI * 0.5, 0]}
        picturePosition={[-15 * SCALE - 1.1, wallYPosition * SCALE, 60 - 21 - 12]}
        pictureRotation={[0, -Math.PI * 0.5, 0]}
        color="white"
        textColor="black"
      />

      <EditSkillsButton
        skills={portofolio.skills}
        editNum={4}
        portofolio={portofolio}
        framePosition={[-15 * SCALE - 0.5, wallYPosition * SCALE, 60 - 21 - 24 - 20 - 12]}
        frameRotation={[0, -Math.PI * 0.5, 0]}
        picturePosition={[-15 * SCALE - 1.1, wallYPosition * SCALE, 60 - 21 - 24 - 20 - 12]}
        pictureRotation={[0, -Math.PI * 0.5, 0]}
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
