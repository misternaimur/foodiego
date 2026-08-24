'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { FoodCard, FoodItem } from '@/components/FoodCard';
import { FoodDetailsModal } from '@/components/FoodDetailsModal';
import { useApp } from '@/context/AppContext';

export default function AllFoodsPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const { toggleFavorite, favorites } = useApp();

  useEffect(() => {
    fetch('/data/foods.json')
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load foods:', err);
        setLoading(false);
      });
  }, []);

  // Extract unique cuisines dynamically for the filter tabs
  const cuisines = useMemo(() => {
    const list = foods.map((item) => item.cuisine);
    return ['All', ...Array.from(new Set(list))];
  }, [foods]);

  // Filter foods by search query and selected cuisine category
  const filteredFoods = useMemo(() => {
    return foods.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCuisine =
        selectedCuisine === 'All' || item.cuisine === selectedCuisine;

      return matchesSearch && matchesCuisine;
    });
  }, [foods, searchQuery, selectedCuisine]);

  return (
    <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Explore All Foods 🍕
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse through all available dishes from top local kitchens.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes or restaurants..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c83214]/20 focus:border-[#c83214] transition-all"
          />
          <svg
            className="absolute left-3.5 top-3 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Cuisine Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => setSelectedCuisine(cuisine)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCuisine === cuisine
                ? 'bg-[#c83214] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {/* Foods Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="w-full h-80 bg-gray-200/60 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
          <p className="text-lg font-bold text-gray-800">No dishes found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCuisine('All');
            }}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
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

      {/* Details & Customization Modal */}
      <FoodDetailsModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </main>
  );
}