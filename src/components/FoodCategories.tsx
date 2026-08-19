import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Poached Egg", image: "/images/foodiesfeed.com_breakfast-sandwich-with-poached-eggs-and-sprouts.jpg", count: 120 },
  { name: "Sandwich", image: "/images/foodiesfeed.com_delicious-blt-sandwich-with-coffee.jpg", count: 85 },
  { name: "Sushi", image: "/images/foodiesfeed.com_assorted-sushi-platter-with-shrimp-and-salmon.jpg", count: 45 },
  { name: "Salads", image: "/images/foodiesfeed.com_delicious-hearty-breakfast-platter-with-coffee.jpg", count: 60 },
  { name: "Desserts", image: "/images/foodiesfeed.com_bowl-of-ice-cream-with-chocolate.jpg", count: 90 },
  { name: "Tea", image: "/images/foodiesfeed.com_refreshing-ginger-lemonade-drink.jpg", count: 110 },
  { name: "Beef", image: "/images/foodiesfeed.com_hearty-beef-stew-with-vegetables.jpg", count: 55 },
  { name: "Drinks", image: "/images/foodiesfeed.com_refreshing-tomato-juice-in-glass.jpg", count: 38 },
];

export default function FoodCategories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-4 mb-6">
        <Image src="/images/logo1.png.png" alt="Foodiego" width={120} height={40} className="h-10 w-auto object-contain" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Food Categories</h2>
          <p className="mt-2 text-gray-600">Explore meals by what you are craving</p>
        </div>
        <Link href="/menu" className="hidden sm:inline-flex text-sm font-semibold text-pink-600 hover:text-pink-500">
          View all
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
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
  );
}
