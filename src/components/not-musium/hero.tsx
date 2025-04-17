import Link from "next/link";
import { Button } from "../ui/button";
import { Safari } from "../magicui/safari";
import { AuroraText } from "../magicui/aurora-text";
import { GridPattern } from "../magicui/grid-pattern";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <div className="border-b pb-[80px] relative">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
        )}
      />
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-6xl font-bold mb-[30px]">Your own 3d <AuroraText>beautiful</AuroraText> museum
          <br /> on the web.</h2>
        <p className="text-xl mb-[30px] text-gray-500">
          Artofolio is a portfolio service for engineers that beautifully showcases your projects,
          technical skills, and social media links—just like an art museum.
        </p>
        <div className="mb-[30px] relative z-[100]">
          <Button asChild>
            <Link href="/login">
              Get Started
            </Link>
          </Button>
        </div>
        <Link href="/login">
          <Safari
            url="artofolio.vercel.app/museum/y_ta"
            imageSrc="/hero.png"
            className="size-full z-[100] relative shadow-2xl transition-transform duration-300 cursor-pointer hover:scale-[1.03]"
          />
        </Link>
      </div>
    </div>
  );
}
