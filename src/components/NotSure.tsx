import {
  Search,
  Sparkles,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import Image from "next/image";

export default function NotSure() {
  return (
    <section className="w-full bg-slate-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
            Not sure what to eat?
          </h2>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Just tell Foodiego what you&apos;re craving.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid items-center gap-6 lg:grid-cols-2">

          {/* AI Recommendation Box */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">

            {/* User Message */}
            <div className="mb-5 flex justify-end">
              <div className="max-w-[90%] rounded-xl bg-pink-500 px-4 py-3 text-sm font-medium text-white sm:text-base">
                I want something spicy, under ৳500, and fast.
              </div>
            </div>

            {/* AI Message */}
            <div className="mb-6 flex gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-pink-500">
                <Sparkles size={17} />
              </div>

              <div className="rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600 shadow-sm">
                I found 6 great options matching your craving!

                <br />

                The{" "}
                <span className="font-medium text-slate-800">
                  Spicy Chicken Bowl
                </span>{" "}
                from Urban Grill is a 95% match and can arrive in 20 mins.
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-2">

              <Search
                size={19}
                className="ml-2 shrink-0 text-slate-400"
              />

              <input
                type="text"
                placeholder="Type your craving..."
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                aria-label="Search food"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white transition hover:bg-pink-600"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>


          {/* Food Cards */}
          <div className="flex justify-center">

            <div className="grid w-full max-w-107.5 grid-cols-1 gap-10 sm:grid-cols-2">

              {/* Spicy Chicken Bowl */}
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

                {/* Image */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <Image
                    src="/images/food/Spicy-chicken-bowl.jpg"
                    alt="Spicy Chicken Bowl"
                    fill
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Content */}
                <div className="p-3">

                  {/* Match */}
                  <div className="flex items-center gap-1 text-blue-500">
                    <BarChart3
                      size={15}
                      strokeWidth={2}
                    />

                    <p className="text-[11px] font-semibold">
                      95% MATCH
                    </p>
                  </div>

                  <h3 className="mt-1 text-sm font-semibold text-slate-800">
                    Spicy Chicken Bowl
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    ৳450 • 20 min
                  </p>
                </div>
              </div>


              {/* Dragon Noodles */}
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

                {/* Image */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <Image
                    src="/images/food/Dragon-noodles.jpg"
                    alt="Dragon Noodles"
                    fill
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Content */}
                <div className="p-3">

                  {/* Match */}
                  <div className="flex items-center gap-1 text-blue-500">
                    <BarChart3
                      size={15}
                      strokeWidth={2}
                    />

                    <p className="text-[11px] font-semibold">
                      92% MATCH
                    </p>
                  </div>

                  <h3 className="mt-1 text-sm font-semibold text-slate-800">
                    Dragon Noodles
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    ৳480 • 25 min
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}