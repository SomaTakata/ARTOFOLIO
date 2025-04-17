import Link from "next/link";
import { Button } from "../ui/button";
import { env } from "@/env.mjs";
import Image from "next/image";

type Props = {
  username: string;
}

export default function WelcomeMessage({ username }: Props) {
  return (
    <div className="h-screen grid place-items-center">
      <div>
        <Image src="/museum-logo.png" alt="" width={70} height={70} className="mx-auto mb-[20px]" />
        <p className="justify-center items-center mb-[20px] flex text-sm font-bold border px-5 text-gray-600 bg-gray-200 py-2 rounded-3xl">
          https://artofolio.vercel.app/museum/{username}
        </p>
        <div className="flex justify-center">
          <Button asChild>
            <Link href={`${env.NEXT_PUBLIC_APP_URL}/museum/${username}`}>Enter your museum</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
