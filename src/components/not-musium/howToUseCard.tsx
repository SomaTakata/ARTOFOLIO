import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

type Props = {
  number: number;
  title: string;
  desc: string;
  image: string
}

export default function HowToUseCard({
  number,
  title,
  desc,
  image,
}: Props) {
  return (
    <>
      <div className="md:w-1/2 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="border bg-muted inline-flex items-center px-4 py-1 rounded-full text-sm text-foreground/70">
            STEP {number}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
          <p className="text-lg text-gray-500">{desc}</p>
        </div>
        <Button>
          <Link href="/login" className="w-full">
            Get Started
          </Link>
        </Button>
      </div>

      <div className="md:w-1/2">
        <div className="relative">
          <div className="aspect-video w-full rounded-xl overflow-hidden glass shadow-md">
            <Image
              src={image}
              alt={`${title}`}
              width={300}
              height={200}
              className="w-full h-full object-cover opacity-80 border-[2px] rounded-xl"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-2xl font-bold text-background">
            {number}
          </div>
        </div>
      </div>
    </>
  );
}
