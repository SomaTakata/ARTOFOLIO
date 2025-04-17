import ProfileTop from "@/components/templates/ProfileTop/ProfileTop";
import { env } from "@/env.mjs";
import { ProfileWithTypedSkills } from "@/server/models/user.schema";
import { headers } from "next/headers";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function Page({ params }: Props) {
  // ヘッダーを一度だけ取得
  const headerData = await headers();
  const { username } = await params;

  const res = await fetch(
    `${env.NEXT_PUBLIC_APP_URL}/api/profile/${username}`,
    {
      method: "GET",
      headers: headerData,
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      return <div>ユーザーが見つかりません</div>;
    }
    return <div>エラーが発生しました</div>;
  }

  const portofolio: ProfileWithTypedSkills = await res.json();

  return (
    <>
      <ProfileTop username={username} portofolio={portofolio} />
    </>
  );
}
