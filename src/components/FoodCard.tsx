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
        <div className="group relative bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
        <div>
            {/* Top Image Container */}
            <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
            <Image
                src={food.imageUrl}
                alt={food.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* AI Match Badge */}
            {food.matchPercentage && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-purple-200 text-[11px] font-bold text-indigo-600 flex items-center gap-1 shadow-2xs">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z" />
                </svg>
                <span>{food.matchPercentage}% MATCH</span>
                </div>
            )}

            {/* Favorite Button */}
            <button
                type="button"
                onClick={() => onToggleFavorite && onToggleFavorite(food.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors shadow-2xs"
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
            <div className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                {food.name}
                </h3>
                <span className="text-base font-bold text-gray-900">
                ${food.price.toFixed(0)}
                </span>
            </div>

            <p className="text-xs text-gray-500 font-medium">
                {food.restaurantName} • {food.cuisine} • {food.deliveryTime}
            </p>

            <div className="flex items-center gap-1.5 text-xs pt-1">
                <span className="text-amber-500">★</span>
                <span className="font-bold text-gray-800">{food.rating}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 font-medium">{food.deliveryFee}</span>
            </div>
            </div>
        </div>

        {/* Footer Add Button */}
        {onAddToCart && (
            <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-gray-50 mt-2">
            {food.dietary ? (
                <span className="text-xs font-semibold text-teal-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                {food.dietary}
                </span>
            ) : <div />}

            <button
                type="button"
                onClick={() => onAddToCart(food)}
                className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4338ca] text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
                Add
            </button>
            </div>
        )}
        </div>
    );
    };