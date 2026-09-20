'use client';

import React, { useMemo, useState } from 'react';
import { Search, UtensilsCrossed } from 'lucide-react';
import { FoodCard, FoodItem } from '@/components/FoodCard';
import { FoodDetailsModal } from '@/components/FoodDetailsModal';
import { useApp } from '@/context/AppContext';

// UPDATE (real food-catalog fix): this page used to be a literal
// placeholder ("food <menu></menu>") — never actually built. It now lists
// every real menu item across all approved restaurants (AppContext's
// `catalogFoodItems`, sourced from MongoDB), with search and add-to-cart,
// the same pattern used on the homepage's "Picked for You" section.
export default function FoodsPage() {
  const { catalogFoodItems, isRestaurantsLoading, addToCart, toggleFavorite, favorites } = useApp();
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return catalogFoodItems;
    return catalogFoodItems.filter(
      (food) =>
        food.name.toLowerCase().includes(query) ||
        food.restaurantName.toLowerCase().includes(query) ||
        food.cuisine.toLowerCase().includes(query)
    );
  }, [catalogFoodItems, search]);

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">All Foods</h1>
            <p className="mt-1.5 text-sm text-gray-500">Browse every dish available across our restaurants.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, restaurants, cuisine..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#15462D] focus:bg-white focus:ring-2 focus:ring-[#15462D]/10"
            />
          </div>
        </div>

        {isRestaurantsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 py-24 text-center">
            <UtensilsCrossed size={28} className="mx-auto text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-500">
              {catalogFoodItems.length === 0 ? 'No dishes available yet.' : 'No dishes match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((food) => (
              <FoodCard
                key={food.id}
                food={{ ...food, isFavorite: favorites.includes(food.id) }}
                onCardClick={(selected) => setSelectedFood(selected)}
                onAddToCart={(selected) => addToCart(selected)}
                onToggleFavorite={(id) => toggleFavorite(id)}
              />
            ))}
          </div>
        )}
      </div>

      <FoodDetailsModal food={selectedFood} onClose={() => setSelectedFood(null)} />
    </main>
  );
}
