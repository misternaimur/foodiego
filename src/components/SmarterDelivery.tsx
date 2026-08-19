import {
  Utensils,
  Bike,
  BrainCircuit,
} from "lucide-react";

export default function SmarterDelivery() {
  return (
    <section className="w-full bg-[#071B4A] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Smarter delivery starts behind the scenes.
          </h2>

          <p className="mt-2 text-xs text-blue-100 sm:text-sm">
            Our logistics engine optimizes every step of the journey.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Restaurant */}
          <div className="rounded-2xl border border-blue-300/20 bg-blue-500/20 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-blue-500/25">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-300/20 text-blue-100">
              <Utensils size={19} />
            </div>

            <h3 className="text-base font-semibold text-white">
              For Restaurants
            </h3>

            <p className="mt-2 text-xs leading-5 text-blue-100">
              Predictive demand forecasting helps kitchens
              prepare faster and reduce wait times.
            </p>
          </div>


          {/* Riders */}
          <div className="rounded-2xl border border-blue-300/20 bg-blue-500/20 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-blue-500/25">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-300/20 text-blue-100">
              <Bike size={19} />
            </div>

            <h3 className="text-base font-semibold text-white">
              For Riders
            </h3>

            <p className="mt-2 text-xs leading-5 text-blue-100">
              AI routing avoids traffic and batches orders
              efficiently to maximize earnings.
            </p>
          </div>


          {/* Foodiego AI */}
          <div className="rounded-2xl border border-blue-300/20 bg-blue-500/20 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-blue-500/25">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-300/20 text-blue-100">
              <BrainCircuit size={19} />
            </div>

            <h3 className="text-base font-semibold text-white">
              Foodiego AI
            </h3>

            <p className="mt-2 text-xs leading-5 text-blue-100">
              The brain connecting it all, learning your habits
              to deliver perfectly every time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}