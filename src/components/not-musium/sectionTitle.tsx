type Props = {
  title: string;
  desc: string;
}

export default function SectionTitle({ title, desc }: Props) {
  return (
    <>
      <h2 className="text-4xl font-bold mb-[20px]">{title}</h2>
      <p className="text-xl text-gray-500">{desc}</p>
    </>
  );
}
