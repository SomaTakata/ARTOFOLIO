import { auth } from "@/auth";
import PostUserName from "@/components/templates/PostUserName/PostUserName";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user?.id) {
    redirect("/");
  }

  const res = await fetch("http://localhost:3000/api/me/username", {
    method: "GET",
    headers: await headers()
  })
  
  const { username } = await res.json();

  if (username) {
    redirect(`/${username}`);
  }

  return (
    <>
      <PostUserName />
    </>
  );
}
