"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { FoodCard, FoodItem } from "@/components/FoodCard";

export default function ClientFavoritesPage() {
  const { favorites, restaurants, addToCart, toggleFavorite } = useApp();
  const [foods, setFoods] = useState<FoodItem[]>([]);

  useEffect(() => {
    fetch("/api/foods.json")
      .then((res) => res.json())
      .then((data: FoodItem[]) => setFoods(data))
      .catch(() => setFoods([]));
  }, []);

  const favoriteFoods = foods.filter((food) => favorites.includes(food.id));
  const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Your Favorites</h1>
        <p className="mt-1 text-sm text-gray-500">Everything you&apos;ve saved for quick reordering.</p>
      </div>

      {/* Favorite Restaurants */}
      <div>
        <h2 className="mb-4 text-base font-bold text-gray-900">Favorite Restaurants</h2>
        {favoriteRestaurants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <Heart size={24} className="mx-auto text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No favorite restaurants yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteRestaurants.map((r) => (
              <Link
                key={r.id}
                href={`/restaurants/${r.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <Image src={r.image} alt={r.restaurantName} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900 group-hover:text-[#15462D]">{r.restaurantName}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-0.5">
                      <Star size={12} className="fill-amber-400 text-amber-400" /> {r.rating}
                    </span>
                    <span>&middot;</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Clock size={12} /> {r.deliveryTime}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(r.id);
                  }}
                  className="shrink-0 text-rose-500"
                  aria-label="Remove from favorites"
                >
                  <Heart size={18} className="fill-current" />
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Favorite Dishes */}
      <div>
        <h2 className="mb-4 text-base font-bold text-gray-900">Favorite Dishes</h2>
        {favoriteFoods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <Heart size={24} className="mx-auto text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No favorite dishes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={{ ...food, isFavorite: true }}
                onAddToCart={() => addToCart(food)}
                onToggleFavorite={() => toggleFavorite(food.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}