import { auth } from "@/auth";
import WelocomeWrapper from "@/components/not-musium/welocomeWrapper";
import { env } from "@/env.mjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  // ヘッダーを一度だけ取得して変数に保存
  const headerData = await headers();

  const session = await auth.api.getSession({
    headers: headerData,
  });

  if (!session || !session.user?.id) {
    return redirect("/");
  }

  // 同じヘッダー変数を再利用
  const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/me/username`, {
    method: "GET",
    headers: headerData,
  });
  const data = await res.json();

  if (data.username) {
    return redirect(`/${data.username}`);
  }

  return (
    <>
      <WelocomeWrapper />
    </>
  );
}
