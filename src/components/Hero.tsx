import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Delicious Food <span className="text-pink-600">Delivered Fast</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 sm:text-xl">
              Order from your favorite local restaurants and get fresh meals delivered to your doorstep in minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/menu"
                className="inline-flex items-center justify-center rounded-full bg-pink-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                Order Now
              </a>
              <a
                href="#categories"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Browse Menu
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-xl">
              <Image
                src="/images/hero.jpg"
                alt="Delicious food"
                width={800}
                height={600}
                className="rounded-3xl shadow-2xl object-cover"
                priority
              />
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-lg">🍕</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Fast Delivery</p>
                    <p className="text-xs text-gray-500">Avg. 25 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
