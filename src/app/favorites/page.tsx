    'use client';

    import React, { useEffect, useState } from 'react';
    import Link from 'next/link';
    import { FoodCard, FoodItem } from '@/components/FoodCard';
    import { useApp } from '@/context/AppContext';

    export default function FavoritesPage() {
    const { favorites, addToCart, toggleFavorite } = useApp();
    const [foods, setFoods] = useState<FoodItem[]>([]);

    useEffect(() => {
        fetch('/data/foods.json')
        .then((res) => res.json())
        .then((data: FoodItem[]) => setFoods(data));
    }, []);

    const favoriteFoods = foods.filter((food) => favorites.includes(food.id));

    return (
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Your Favorites ❤️</h1>
        <p className="text-gray-500 mb-8">Quickly order your saved dishes.</p>

        {favoriteFoods.length === 0 ? (
            <div className="text-center py-16">
            <p className="text-gray-500 mb-6">You haven't saved any favorites yet.</p>
            <Link
                href="/"
                className="inline-block bg-[#c83214] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#a6280f] transition-colors"
            >
                Find Foods
            </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteFoods.map((food) => (
                <FoodCard
                key={food.id}
                food={{
                    ...food,
                    isFavorite: true,
                }}
                onAddToCart={() => addToCart(food)}
                onToggleFavorite={() => toggleFavorite(food.id)}
                />
            ))}
            </div>
        )}
        </main>
    );
    }