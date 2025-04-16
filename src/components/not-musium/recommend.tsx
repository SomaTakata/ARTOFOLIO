import { WordRotate } from "../magicui/word-rotate";

export default function Recommend() {
  return (
    <div className="p-[80px] border-b">
      <div className="max-w-[1000px] mx-auto">
        <h3 className="font-bold text-4xl text-center mb-[5px]">Let's create your museum.</h3>
        <p className="text-lg text-center mb-[25px] text-gray-500">You'll get your own unique URL.</p>
        <div className="items-center mb-[20px] flex text-3xl font-bold border px-5 text-gray-600 bg-gray-200 py-2 rounded-3xl">
          https://artofolio.vercel.app/museum/<WordRotate words={["y_ta", "soma"]} />
        </div>
      </div>
    </div>
  );
}
