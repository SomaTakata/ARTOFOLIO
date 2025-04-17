import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  desc: string;
  image: string;
  link: string;
}

export default function ShowcaseCard({
  title,
  desc,
  image,
  link
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-lg aspect-[3/2]">
      <Link href={link}>
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/80">{desc}</p>
        </div>
      </Link>
    </div>
  );
}
