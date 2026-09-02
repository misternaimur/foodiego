'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, ShoppingBag, Heart, Filter, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function RestaurantsPage() {
  const { restaurants, isRestaurantsLoading, favorites, toggleFavorite } = useApp();

  // Filter & Sort States
  const [selectedSort, setSelectedSort] = useState<'relevance' | 'fastest' | 'rating'>('relevance');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract all unique cuisines
  const allCuisines = useMemo(() => {
    const cuisinesSet = new Set<string>();
    restaurants.forEach((r) => r.cuisines?.forEach((c) => cuisinesSet.add(c)));
    return ['All', ...Array.from(cuisinesSet)];
  }, [restaurants]);

  // Filter & Sort Logic
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        const matchesRating = r.rating >= minRating;
        const matchesCuisine = selectedCuisine === 'All' || r.cuisines.includes(selectedCuisine);
        return matchesRating && matchesCuisine;
      })
      .sort((a, b) => {
        if (selectedSort === 'rating') return b.rating - a.rating;
        if (selectedSort === 'fastest') {
          const timeA = parseInt(a.deliveryTime) || 999;
          const timeB = parseInt(b.deliveryTime) || 999;
          return timeA - timeB;
        }
        return 0; // Relevance (default JSON order)
      });
  }, [restaurants, minRating, selectedCuisine, selectedSort]);

  return (
    <div className="min-h-screen bg-[#FAF7EE] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Mobile Filter Trigger */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              All Restaurants
            </h1>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              Discover top kitchens near you delivered fast
            </p>
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden inline-flex items-center gap-2 bg-white border border-[#E8E2D5] px-4 py-2 rounded-full text-xs font-bold text-[#15462D] shadow-xs"
          >
            <Filter size={14} />
            <span>Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter (Simplified Foodpanda Style) */}
          <aside className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'} bg-white border border-[#E8E2D5] p-6 rounded-3xl h-fit sticky top-24 shadow-xs z-10`}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Filters</h3>
              {(selectedSort !== 'relevance' || minRating > 0 || selectedCuisine !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedSort('relevance');
                    setMinRating(0);
                    setSelectedCuisine('All');
                  }}
                  className="text-xs font-semibold text-emerald-800 hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">
                Sort By
              </h4>
              <div className="space-y-2">
                {[
                  { id: 'relevance', label: 'Relevance' },
                  { id: 'fastest', label: 'Fastest Delivery' },
                  { id: 'rating', label: 'Top Rated' },
                ].map((sort) => (
                  <label key={sort.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      checked={selectedSort === sort.id}
                      onChange={() => setSelectedSort(sort.id as any)}
                      className="w-4 h-4 text-[#15462D] focus:ring-[#15462D] accent-[#15462D]"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-slate-900">
                      {sort.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">
                Rating
              </h4>
              <div className="flex flex-wrap gap-2">
                {[0, 4.0, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      minRating === rating
                        ? 'bg-[#15462D] text-white'
                        : 'bg-[#FAF7EE] text-gray-700 hover:bg-gray-200/60'
                    }`}
                  >
                    {rating === 0 ? 'All Ratings' : `${rating}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine Filter */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-3">
                Cuisine
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {allCuisines.map((cuisine) => (
                  <label key={cuisine} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="cuisine"
                      checked={selectedCuisine === cuisine}
                      onChange={() => setSelectedCuisine(cuisine)}
                      className="w-4 h-4 text-[#15462D] focus:ring-[#15462D] accent-[#15462D]"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-slate-900">
                      {cuisine}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Area: Restaurant Card Grid */}
          <main className="lg:col-span-3">
            {isRestaurantsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="w-full h-72 bg-white/70 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E2D5]">
                <p className="text-base font-semibold text-gray-700">No restaurants found</p>
                <p className="text-xs text-gray-500 mt-1">Try resetting your filters or selecting a different cuisine.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredRestaurants.map((restaurant) => {
                  const isFav = favorites.includes(restaurant.id);
                  return (
                    <div
                      key={restaurant.id}
                      className="group bg-white rounded-3xl border border-[#E8E2D5] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <Link href={`/restaurants/${restaurant.slug}`} className="block relative">
                        {/* Image Banner */}
                        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                          <Image
                            src={restaurant.image}
                            alt={restaurant.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          
                          {/* Badge */}
                          {restaurant.badge && (
                            <span className="absolute top-3 left-3 bg-[#15462D] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-xs">
                              {restaurant.badge}
                            </span>
                          )}

                          {/* Favorite Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(restaurant.id);
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-gray-700 transition-colors shadow-xs"
                          >
                            <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                          </button>
                        </div>

                        {/* Card Info */}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-lg font-black text-slate-900 group-hover:text-[#15462D] transition-colors truncate">
                              {restaurant.name}
                            </h3>
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50 shrink-0">
                              <Star size={13} className="fill-amber-400 text-amber-400" />
                              <span className="text-xs font-bold text-gray-900">{restaurant.rating}</span>
                              <span className="text-[10px] text-gray-500">({restaurant.reviewCount})</span>
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 font-medium truncate mb-3">
                            {restaurant.cuisines.join(' • ')}
                          </p>

                          <div className="flex items-center gap-4 text-xs font-bold text-gray-600 pt-3 border-t border-gray-100">
                            <span className="flex items-center gap-1">
                              <Clock size={13} className="text-emerald-800" />
                              {restaurant.deliveryTime}
                            </span>
                            <span>•</span>
                            <span>Tk {restaurant.deliveryFee} delivery</span>
                          </div>
                        </div>
                      </Link>

                      {/* Offers Tag */}
                      {restaurant.offers.length > 0 && (
                        <div className="bg-[#FAF7EE] px-5 py-2.5 border-t border-[#E8E2D5] flex items-center justify-between text-xs font-bold text-[#15462D]">
                          <span>🏷️ {restaurant.offers[0].title}</span>
                          <ChevronRight size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
}