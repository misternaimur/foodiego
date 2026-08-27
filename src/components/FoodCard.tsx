'use client';

import React from 'react';
import Image from 'next/image';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  restaurantName: string;
  cuisine: string;
  dietary?: string;
  matchPercentage?: number | null;
  imageUrl: string;
  isFavorite?: boolean;
}

interface FoodCardProps {
  food: FoodItem;
  onAddToCart?: (food: FoodItem) => void;
  onToggleFavorite?: (id: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onAddToCart,
  onToggleFavorite,
}) => {
  return (
    <div 
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between hover:-translate-y-1"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      <div>
        {/* Top Image Container */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={food.imageUrl}
            alt={food.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* AI Match Badge */}
          {food.matchPercentage && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-orange-100 text-[11px] font-bold text-orange-700 flex items-center gap-1.5 shadow-lg">
              <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z" />
              </svg>
              <span>{food.matchPercentage}% MATCH</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            type="button"
            onClick={() => onToggleFavorite && onToggleFavorite(food.id)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-all duration-300 shadow-lg hover:scale-110 active:scale-95"
            aria-label="Add to favorites"
          >
            <svg
              className="w-4 h-4"
              fill={food.isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-1.282-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-orange-700 transition-colors">
              {food.name}
            </h3>
            <span className="text-base font-black text-gray-900">
              ${food.price.toFixed(0)}
            </span>
          </div>

          <p className="text-xs text-gray-500 font-medium">
            {food.restaurantName} • {food.cuisine} • {food.deliveryTime}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-amber-500 font-bold">★</span>
              <span className="font-bold text-gray-800">{food.rating}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-medium">{food.deliveryFee} delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Add Button */}
      {onAddToCart && (
        <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-gray-50 mt-2">
          {food.dietary ? (
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              {food.dietary}
            </span>
          ) : <div />}

          <button
            type="button"
            onClick={() => onAddToCart(food)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};
