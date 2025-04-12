import ProfileTop from "@/components/templates/ProfileTop/ProfileTop";
import { env } from "@/env.mjs";

type Props = {
  params: Promise<{
    username: string;
  }>
}

export default async function Page({ params }: Props) {

  const { username } = await params;
  const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/profile/${username}`, {
    method: "GET",
  });

  if (!res.ok) {
    if (res.status === 404) {
      return <div>ユーザーが見つかりません</div>;
    }
    return <div>エラーが発生しました</div>;
  }

  const portofolio = await res.json();

  return (
    <>
      <ProfileTop
        username={username}
        portofolio={portofolio}
      />
    </>
  );
}
