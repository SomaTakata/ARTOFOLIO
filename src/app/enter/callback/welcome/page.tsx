import { auth } from "@/auth";
import WelocomeWrapper from "@/components/not-musium/welocomeWrapper";
import { env } from "@/env.mjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user?.id) {
    redirect("/");
  }

  const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/me/username`, {
    method: "GET",
    headers: await headers()
  })

  const { username } = await res.json();

  if (username) {
    redirect(`/${username}`);
  }

  return (
    <>
      <WelocomeWrapper />
    </>
  );
}
