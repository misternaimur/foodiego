'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FoodCard, FoodItem } from './FoodCard';
import { FoodDetailsModal } from './FoodDetailsModal';
import { useApp } from '@/context/AppContext';

export const PickedForYouSection: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const { toggleFavorite, favorites } = useApp();

  useEffect(() => {
    fetch('/data/foods.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch food items');
        }
        return res.json();
      })
      .then((data) => {
        setFoods(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load foods:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="w-full bg-[#faf9f6] py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Area */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <span>Picked for you</span>
              <span className="text-amber-400 text-xl">✨</span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Foodiego learns what you love and finds your next favorite meal.
            </p>
          </div>

          <Link
            href="/restaurants"
            className="text-xs sm:text-sm font-semibold text-[#c83214] hover:underline shrink-0"
          >
            See more ›
          </Link>
        </div>

        {/* Cards Grid / Skeletons / Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div 
                key={n} 
                className="w-full h-80 bg-gray-200/60 rounded-3xl animate-pulse" 
              />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No food items available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard
                key={food.id}
                food={{
                  ...food,
                  isFavorite: favorites.includes(food.id),
                }}
                onCardClick={(selected) => setSelectedFood(selected)}
                onAddToCart={(selected) => setSelectedFood(selected)}
                onToggleFavorite={(id) => toggleFavorite(id)}
              />
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