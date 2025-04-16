import Recommend from "@/components/not-musium/recommend";
import HowToUse from "@/components/not-musium/howToUse";
import Showcase from "@/components/not-musium/showcase";
import Hero from "@/components/not-musium/hero";



export default function Page() {
  return (
    <div className="relative">
      <header className="h-[80px]"></header>

      <Hero />
      <HowToUse />
      <Showcase />
      <Recommend />

      <footer className="h-[50px] flex items-center justify-center">
        <p className="font-bold">Artofolio 2025</p>
      </footer>
    </div>
  );
}
