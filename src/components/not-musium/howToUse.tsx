import { STEP } from "./const/step";
import HowToUseCard from "./howToUseCard";
import SectionTitle from "./sectionTitle";

export default function HowToUse() {
  return (
    <div className="py-[80px] border-b">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-[50px]">
          <SectionTitle
            title="How To Use"
            desc="Creating your virtual art museum portfolio is simple and intuitive. Just follow
                     these steps to build your immersive 3D showcase."
          />
        </div>

        <div className="space-y-24">
          {STEP.map((step, i) => (
            <div key={step.number} className={`flex gap-8 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <HowToUseCard
                title={step.title}
                desc={step.desc}
                image={step.image}
                number={step.number}
              />
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}
