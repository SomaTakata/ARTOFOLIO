import { GALLARY } from "./const/gallary";
import SectionTitle from "./sectionTitle";
import ShowcaseCard from "./showcaseCard";

export default function Showcase() {
  return (
    <div className="py-[80px] border-b">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-[50px]">
          <SectionTitle
            title="ShowCased Gallaries"
            desc="Please take a look at the wonderful museums created by others."
          />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {GALLARY.map((gallary, i) => (
            <ShowcaseCard
              link={gallary.link}
              image={gallary.image}
              title={gallary.title}
              desc={gallary.desc}
              key={i}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
