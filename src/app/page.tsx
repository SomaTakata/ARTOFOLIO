"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={() => signIn()} type="button" variant="outline">
        Sign In With Google
      </Button>
    </div>
  );
}
