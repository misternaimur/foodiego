"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import FoodCard from "@/components/FoodCard";

interface BackendRestaurant {
  _id: string;
  id?: string;
  restaurantName?: string;
  name?: string;
  slug?: string;
  logoUrl?: string;
  logo?: string;
  image?: string;
  cuisineType?: string;
  cuisines?: string[];
  openingTime?: string;
  closingTime?: string;
  deliveryTime?: string;
  rating?: number;
}

interface BackendMenuItem {
  _id: string;
  id?: string;
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  image?: string;
}

export default function ClientFavoritesPage() {
  const { favorites, toggleFavorite, addToCart } = useApp();

  const [restaurants, setRestaurants] = useState<BackendRestaurant[]>([]);
  const [foodItems, setFoodItems] = useState<BackendMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const [resRestaurants, resMenu] = await Promise.all([
          fetch(`${API_URL}/api/restaurants`),
          fetch(`${API_URL}/api/menu`),
        ]);

        const restaurantsData = await resRestaurants.json();
        const menuData = await resMenu.json();

        const rawRestaurants = Array.isArray(restaurantsData)
          ? restaurantsData
          : restaurantsData.restaurants || restaurantsData.data || [];

        const rawMenu = Array.isArray(menuData)
          ? menuData
          : menuData.menuItems || menuData.data || [];

        setRestaurants(rawRestaurants);
        setFoodItems(rawMenu);
      } catch (error) {
        console.error("Failed to load favorites data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const favoriteRestaurants = restaurants.filter((r) => {
    const itemId = r._id || r.id;
    return itemId && favorites.includes(itemId);
  });

  const favoriteFoods = foodItems.filter((f) => {
    const itemId = f._id || f.id;
    return itemId && favorites.includes(itemId);
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-4 sm:p-8">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-screen bg-[#FAF7EE] p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Your Favorites
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 font-medium">
          Saved restaurants and dishes for fast reordering.
        </p>
      </div>

      {/* Favorite Restaurants */}
      <div>
        <h2 className="mb-4 text-base font-bold text-slate-900">
          Favorite Restaurants ({favoriteRestaurants.length})
        </h2>
        {favoriteRestaurants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E2D5] bg-white p-8 text-center">
            <Heart size={28} className="mx-auto text-gray-300" />
            <p className="mt-2 text-sm text-gray-500 font-medium">
              No favorite restaurants saved yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteRestaurants.map((r) => {
              const targetId = r._id || r.id || "";
              const name = r.restaurantName || r.name || "Restaurant";
              const slug = r.slug || targetId;
              const imageSrc =
                r.logoUrl || r.logo || r.image || "/default-banner.png";

              return (
                <Link
                  key={targetId}
                  href={`/restaurants/${slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-[#E8E2D5] bg-white p-4 shadow-xs transition-all hover:shadow-md"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={imageSrc}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900 group-hover:text-[#15462D]">
                      {name}
                    </p>
                    <p className="truncate text-xs text-gray-500 font-medium">
                      {r.cuisines?.join(" • ") || r.cuisineType || "Various Cuisines"}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-0.5 font-bold text-slate-900">
                        <Star size={12} className="fill-amber-400 text-amber-400" />{" "}
                        {r.rating || 4.5}
                      </span>
                      <span>&middot;</span>
                      <span className="inline-flex items-center gap-0.5 text-xs text-gray-500 font-medium">
                        <Clock size={12} className="text-[#15462D]" />{" "}
                        {r.deliveryTime || "30-40 min"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(targetId);
                    }}
                    className="shrink-0 p-2 text-rose-500 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Heart size={18} className="fill-rose-500 text-rose-500" />
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Favorite Dishes */}
      <div>
        <h2 className="mb-4 text-base font-bold text-slate-900">
          Favorite Dishes ({favoriteFoods.length})
        </h2>
        {favoriteFoods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E2D5] bg-white p-8 text-center">
            <Heart size={28} className="mx-auto text-gray-300" />
            <p className="mt-2 text-sm text-gray-500 font-medium">
              No favorite dishes saved yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteFoods.map((food) => {
              const targetId = food._id || food.id || "";
              return (
                <FoodCard
                  key={targetId}
                  food={{
                    id: targetId,
                    name: food.name,
                    price: food.price,
                    description: food.description || "",
                    imageUrl: food.imageUrl || food.image || "/default-food.png",
                    isFavorite: true,
                  }}
                  onAddToCart={(item) =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.imageUrl,
                    })
                  }
                  onToggleFavorite={(id) => toggleFavorite(id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}