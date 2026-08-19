import Link from "next/link";

const categories = [
  { name: "Burgers", icon: "🍔", count: 120 },
  { name: "Pizza", icon: "🍕", count: 85 },
  { name: "Sushi", icon: "🍣", count: 45 },
  { name: "Salads", icon: "🥗", count: 60 },
  { name: "Desserts", icon: "🍰", count: 90 },
  { name: "Drinks", icon: "🥤", count: 110 },
  { name: "Noodles", icon: "🍜", count: 55 },
  { name: "BBQ", icon: "🍖", count: 38 },
];

export default function FoodCategories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
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
            className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-5 text-center transition hover:border-pink-200 hover:shadow-md"
          >
            <span className="text-3xl transition group-hover:scale-110">{category.icon}</span>
            <span className="mt-2 text-sm font-medium text-gray-900">{category.name}</span>
            <span className="text-xs text-gray-500">{category.count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
