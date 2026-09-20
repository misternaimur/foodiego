'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Clock3, Bike } from 'lucide-react';

export interface SelectedOption {
  name: string;
  price: number;
}

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
  sizes?: SelectedOption[];
  addons?: SelectedOption[];
}

interface FoodCardProps {
  food: FoodItem;
  onAddToCart?: (food: FoodItem) => void;
  onToggleFavorite?: (id: string) => void;
  onCardClick?: (food: FoodItem) => void;
}

// UPDATE (food-card redesign): rebuilt to match the compact, Foodpanda-style
// listing card the user asked for — one photo, then three tight info rows
// (name + rating, time + cuisine, delivery fee), instead of the previous
// looser 3D-tilt card. Every value shown is still real data already on
// FoodItem; no "Ad"/"free for first order" style label is added since
// there's no real sponsored-listing or promo-code concept behind it.
export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onAddToCart,
  onToggleFavorite,
  onCardClick,
}) => {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(food);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-gray-100">
        {food.imageUrl ? (
          <Image
            src={food.imageUrl}
            alt={food.name}
            fill
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl">🍽️</div>
        )}

        {food.matchPercentage && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-orange-700 shadow-sm sm:left-3 sm:top-3 sm:px-2.5">
            <svg className="h-3 w-3 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z" />
            </svg>
            <span>{food.matchPercentage}%</span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(food.id);
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-400 shadow-sm transition-colors hover:text-red-500 sm:right-3 sm:top-3"
          aria-label="Add to favorites"
        >
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            fill={food.isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className={food.isFavorite ? 'text-red-500' : ''}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-1.282-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-sm font-bold text-gray-900 sm:text-base">
            {food.name}
          </h3>
          <span className="shrink-0 text-sm font-black text-gray-900 sm:text-base">
            ${food.price.toFixed(0)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="font-bold text-gray-800">{food.rating}</span>
          <span className="text-gray-300">&middot;</span>
          <span className="min-w-0 truncate">{food.restaurantName}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-semibold text-gray-500 sm:text-xs">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={12} className="text-emerald-700" />
            {food.deliveryTime}
          </span>
          <span className="text-gray-300">&middot;</span>
          <span className="min-w-0 truncate">{food.cuisine}</span>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 sm:text-xs">
            <Bike size={13} className="text-emerald-700" />
            {food.deliveryFee} delivery
          </span>
          {food.dietary && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              {food.dietary}
            </span>
          )}
        </div>
      </div>

      {/* Footer Add Button */}
      {onAddToCart && (
        <div className="mt-auto border-t border-gray-50 px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(food);
            }}
            className="w-full rounded-xl bg-linear-to-r from-orange-500 to-red-500 py-2 text-xs font-bold text-white shadow-sm transition-all hover:from-orange-600 hover:to-red-600 hover:shadow-md active:scale-95 sm:text-sm"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodCard;
