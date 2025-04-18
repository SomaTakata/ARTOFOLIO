import { env } from "@/env.mjs";

export const GALLARY = [
  {
    title: "This is Yuta's museum.",
    desc: "I'm a beginner frontend engineer.",
    image: "/showcase-1.png",
    link: `${env.NEXT_PUBLIC_APP_URL}/museum/y_ta`,
  },
  {
    title: "This is Soma's museum.",
    desc: "I’m conducting research on VR at university.",
    image: "/showcase-2.png",
    link: `${env.NEXT_PUBLIC_APP_URL}/museum/soma`
  }
]

