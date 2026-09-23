'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { FoodCard, FoodItem } from './FoodCard';
import { FoodDetailsModal } from './FoodDetailsModal';
import { useApp } from '@/context/AppContext';

// UPDATE (real food-catalog fix): this section used to fetch static demo
// JSON (public/api/foods.json) — items unrelated to any real restaurant,
// so "Add to cart" here could add a dish that didn't exist anywhere in
// the real catalog. It now picks from AppContext's `catalogFoodItems`,
// which is the same real menu data (from MongoDB) already flattened once
// for every page that needs a flat food list.
export const PickedForYouSection: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const { addToCart, toggleFavorite, favorites, catalogFoodItems, isRestaurantsLoading } = useApp();

  // Highest-rated items first, so "picked for you" leans on the one real
  // quality signal available (restaurant rating).
  const foods = useMemo(
    () => [...catalogFoodItems].sort((a, b) => b.rating - a.rating).slice(0, 6),
    [catalogFoodItems]
  );

  const loading = isRestaurantsLoading;

  return (
    <section className="w-full bg-transparent py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-left">
          <div>
            <p className="text-xs font-bold text-pink-800 tracking-widest uppercase mb-2">
              CURATED, NOT CROWDED
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 tracking-tight mb-2">
              Restaurants worth discovering
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-normal">
              A short list of kitchens we&apos;d happily send our own friends to.
            </p>
          </div>

          <Link
            href="/restaurants"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-pink-800 hover:text-green-600 transition-colors shrink-0 mb-1"
          >
            View All Restaurants
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards Grid / Skeletons / Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div 
                key={n} 
                className="w-full h-105 bg-white/60 rounded-3xl animate-pulse" 
              />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-16 bg-white/40 rounded-3xl border border-gray-200/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">No food items available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food, index) => (
              <div
                key={food.id}
                style={{ animation: `fadeSlideIn 0.5s ease-out ${index * 0.08}s both` }}
              >
                <FoodCard
                  food={{
                    ...food,
                    isFavorite: favorites.includes(food.id),
                  }}
                  onCardClick={(selected) => setSelectedFood(selected)}
                  // UPDATE (cart-quantity bug fix): this used to both add
                  // the item to the cart AND open the customization modal
                  // on the same click. The modal already has its own real
                  // "Add to Cart" button, so a customer who then confirmed
                  // there silently added the item twice (cart quantity 2
                  // from what looked like one click). The footer button
                  // now only adds once, matching how the same FoodCard is
                  // wired everywhere else it's used (src/app/(public)/foods/page.tsx,
                  // src/app/(public)/restaurants/[slug]/page.tsx) — clicking
                  // the card itself opens the modal to customize instead.
                  onAddToCart={(selected) => addToCart(selected)}
                  onToggleFavorite={(id) => toggleFavorite(id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Food Customization Modal Overlay */}
        <FoodDetailsModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      </div>
    </section>
  );
};

export default PickedForYouSection;