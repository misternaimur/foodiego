import { Sparkles } from "lucide-react";

export default function HungryCTA() {
  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
          Hungry? Let Foodiego decide!
        </h2>

        {/* Buttons */}
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">

          {/* Find My Food */}
          <button
            type="button"
            className="rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-blue-500 hover:shadow-md"
          >
            Find My Food
          </button>

          {/* Ask Foodiego */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-slate-200 px-5 py-3 text-sm font-medium text-slate-900 transition duration-300 hover:bg-slate-300"
          >
            <Sparkles
              size={16}
              className="text-blue-500"
            />
            Ask Foodiego
          </button>

        </div>
      </div>
    </section>
  );
}