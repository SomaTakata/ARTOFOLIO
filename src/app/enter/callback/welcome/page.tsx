import { auth } from "@/auth";
import WelocomeWrapper from "@/components/not-musium/welocomeWrapper";
import { env } from "@/env.mjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {

  const cookieHeader = cookies().toString();

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/me/username`, {
    method: "GET",
    headers: { cookie: cookieHeader },
  });

  const { username } = await res.json();

  if (username) {
    redirect(`/museum/${username}`);
  }

  return (
    <>
      <WelocomeWrapper />
    </>
  );
}
