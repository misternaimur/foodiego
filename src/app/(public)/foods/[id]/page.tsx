'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Clock, Truck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

// UPDATE (real food-catalog fix): this page used to be a literal
// placeholder ("single food details"). It now looks up the real menu item
// by id from AppContext's `catalogFoodItems` (sourced from MongoDB) and
// shows its real name/price/restaurant, with a working add-to-cart.
export default function FoodDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { catalogFoodItems, isRestaurantsLoading, addToCart, toggleFavorite, favorites } = useApp();

  const food = catalogFoodItems.find((f) => f.id === id);

  if (isRestaurantsLoading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-96 animate-pulse rounded-3xl bg-gray-100" />
      </main>
    );
  }

  if (!food) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-lg font-bold text-gray-800">Dish not found</p>
        <p className="mt-2 text-sm text-gray-500">This item may no longer be available.</p>
        <Link href="/foods" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#15462D]">
          <ArrowLeft size={15} /> Back to all foods
        </Link>
      </main>
    );
  }

  const isFavorite = favorites.includes(food.id);

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/foods" className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-[#15462D]">
          <ArrowLeft size={15} /> Back to all foods
        </Link>

        <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
          <div className="relative h-72 w-full bg-gray-100 sm:h-96">
            {food.imageUrl ? (
              <Image src={food.imageUrl} alt={food.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">🍽️</div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{food.restaurantName}</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{food.name}</h1>
              </div>
              <p className="text-2xl font-extrabold text-[#15462D]">${food.price.toFixed(2)}</p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-gray-600">{food.description}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Star size={15} className="fill-amber-400 text-amber-400" /> {food.rating.toFixed(1)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} /> {food.deliveryTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck size={15} /> {food.deliveryFee}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">{food.cuisine}</span>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => addToCart(food)}
                className="flex-1 rounded-xl bg-[#15462D] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0e3320] sm:flex-none"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleFavorite(food.id)}
                className={`rounded-xl border px-6 py-3.5 text-sm font-bold transition ${
                  isFavorite ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isFavorite ? '♥ Saved' : '♡ Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
