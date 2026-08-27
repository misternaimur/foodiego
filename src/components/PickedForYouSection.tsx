'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FoodCard, FoodItem } from './FoodCard';
import { useApp } from '@/context/AppContext';

export const PickedForYouSection: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { addToCart, toggleFavorite, favorites } = useApp();

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
    <section className="relative w-full bg-white py-20 lg:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-50/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-50/60 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-2 mb-4">
              <span className="text-orange-500 text-sm">✨</span>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">For You</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Picked for you
            </h2>
            <p className="mt-2 text-base text-gray-500 max-w-lg">
              Foodiego learns what you love and finds your next favorite meal.
            </p>
          </div>

          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-orange-200 text-gray-700 hover:text-orange-700 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-md shrink-0"
          >
            See more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Cards Grid / Skeletons / Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div 
                key={n} 
                className="w-full h-96 bg-gray-100 rounded-3xl animate-pulse" 
              />
            ))}
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">No food items available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  onAddToCart={() => addToCart(food)}
                  onToggleFavorite={() => toggleFavorite(food.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PickedForYouSection;
