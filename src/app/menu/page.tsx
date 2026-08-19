import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Burgers", image: "/images/foodiesfeed.com_breakfast-sandwich-with-poached-eggs-and-sprouts.jpg", count: 120 },
  { name: "Pizza", image: "/images/foodiesfeed.com_delicious-blt-sandwich-with-coffee.jpg", count: 85 },
  { name: "Sushi", image: "/images/foodiesfeed.com_assorted-sushi-platter-with-shrimp-and-salmon.jpg", count: 45 },
  { name: "Salads", image: "/images/foodiesfeed.com_delicious-hearty-breakfast-platter-with-coffee.jpg", count: 60 },
  { name: "Desserts", image: "/images/foodiesfeed.com_bowl-of-ice-cream-with-chocolate.jpg", count: 90 },
  { name: "Drinks", image: "/images/foodiesfeed.com_refreshing-ginger-lemonade-drink.jpg", count: 110 },
  { name: "Noodles", image: "/images/foodiesfeed.com_hearty-beef-stew-with-vegetables.jpg", count: 55 },
  { name: "BBQ", image: "/images/foodiesfeed.com_refreshing-tomato-juice-in-glass.jpg", count: 38 },
];

export default function MenuPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Image src="/images/logo.png" alt="Foodiego" width={120} height={40} className="h-10 w-auto object-contain" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
            <p className="text-gray-600">Choose from our delicious selection</p>
          </div>
        </div>

        <div className="relative mb-10 h-64 w-full overflow-hidden rounded-2xl md:h-80 lg:h-96">
          <Image src="/images/hero.jpg" alt="Delicious food" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Fresh & Tasty</h2>
            <p className="mt-2 max-w-xl text-sm text-white/90 md:text-base">
              Explore our wide range of categories and find your next favorite meal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/menu?category=${category.name.toLowerCase()}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 text-center transition hover:border-pink-200 hover:shadow-md"
            >
              <div className="relative mb-3 h-24 w-full overflow-hidden rounded-xl">
                <Image src={category.image} alt={category.name} fill className="object-cover transition group-hover:scale-105" />
              </div>
              <span className="text-sm font-medium text-gray-900">{category.name}</span>
              <span className="text-xs text-gray-500">{category.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
