'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FoodCard, FoodItem } from '@/components/FoodCard';
import { useApp } from '@/context/AppContext';

export default function FavoritesPage() {
  const { favorites, addToCart, toggleFavorite } = useApp();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/foods.json')
      .then((res) => res.json())
      .then((data: FoodItem[]) => {
        setFoods(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const favoriteFoods = foods.filter((food) => favorites.includes(food.id));

  return (
    <main className="min-h-screen w-full bg-white flex flex-col">
      {/* Full-width container wrapper */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-10 transition-all">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Your Favorites <span className="text-rose-500 animate-pulse">❤️</span>
            </h1>
            <p className="text-gray-500 mt-1.5 text-base">
              Quickly access and reorder your saved dishes anytime.
            </p>
          </div>
          {!isLoading && favoriteFoods.length > 0 && (
            <div className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-full bg-rose-50 text-rose-700 text-sm font-semibold border border-rose-100">
              {favoriteFoods.length} {favoriteFoods.length === 1 ? 'item' : 'items'} saved
            </div>
          )}
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : favoriteFoods.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 mt-4 max-w-4xl mx-auto w-full">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              💔
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8 text-base">
              You haven&apos;t saved any dishes to your favorites list yet. Explore our menu and tap the heart icon to save items.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#c83214] text-white font-semibold px-8 py-3.5 rounded-xl shadow-sm hover:bg-[#a6280f] hover:shadow-md transition-all duration-200 active:scale-95 text-base"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {favoriteFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={{
                  ...food,
                  isFavorite: true,
                }}
                onAddToCart={() => addToCart(food)}
                onToggleFavorite={() => toggleFavorite(food.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}