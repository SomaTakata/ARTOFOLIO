"use client"

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export default function Page() {
    return (
        <Button onClick={() => signIn()} type="button" variant="ghost">
          ボタン
        </Button>
    );
}
