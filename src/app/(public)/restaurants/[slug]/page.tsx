'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Clock, ArrowLeft, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import FoodCard from '@/components/FoodCard';
import { RestaurantReviews } from '@/components/RestaurantReviews';
import { FoodDetailsModal } from '@/components/FoodDetailsModal';

export default function RestaurantDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { getRestaurantBySlug, addToCart, favorites, toggleFavorite } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<any>(null);

  const restaurant = getRestaurantBySlug(slug as string);

  // Dynamic ratings synced directly with the review list
  const [dynamicRating, setDynamicRating] = useState<number>(4.5);
  const [dynamicReviewCount, setDynamicReviewCount] = useState<number>(1);

  // Set initial fallback values when restaurant loads
  useEffect(() => {
    if (restaurant) {
      setDynamicRating(4.5);
      setDynamicReviewCount(1);
    }
  }, [restaurant]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] flex items-center justify-center p-4">
        <button
          onClick={() => router.push('/restaurants')}
          className="bg-[#15462D] text-white text-xs font-bold px-5 py-2.5 rounded-full"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(restaurant.id);
  const activeCategory = selectedCategory || restaurant.menuCategories[0]?.category;

  return (
    <div className="min-h-screen bg-[#FAF7EE] pb-20">
      {/* Banner */}
      <div className="relative w-full h-64 sm:h-80 bg-slate-900">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          priority
          className="object-cover opacity-60"
        />
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 p-3 rounded-full bg-white/80 backdrop-blur-md text-gray-900 hover:bg-white transition-all"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        {/* Restaurant Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {restaurant.cuisines.join(' • ')}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {restaurant.name}
              </h1>
            </div>

            <button
              onClick={() => toggleFavorite(restaurant.id)}
              className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : ''} />
              <span>{isFav ? 'Favorited' : 'Add to favorites'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6 text-xs sm:text-sm font-semibold text-gray-700">
            {/* Real-time Dynamic Star Badge */}
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-900">{dynamicRating}</span>
              <span className="text-gray-500">
                ({dynamicReviewCount} {dynamicReviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-[#15462D]" />
              <span>{restaurant.deliveryTime} delivery</span>
            </div>

            <div>
              <span>
                Min. order: <strong className="text-slate-900">Tk {restaurant.minOrder}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="sticky top-20 bg-[#FAF7EE]/95 backdrop-blur-md py-4 z-20 border-b border-[#E8E2D5] mb-8 overflow-x-auto flex gap-2 scrollbar-none">
          {restaurant.menuCategories.map((cat: any) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.category
                  ? 'bg-[#15462D] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-[#E8E2D5] hover:bg-gray-50'
              }`}
            >
              {cat.category} ({cat.items.length})
            </button>
          ))}
        </div>

        {/* Menu Section Rendered via FoodCard */}
        <div className="space-y-12">
          {restaurant.menuCategories
            .filter((cat: any) => !selectedCategory || cat.category === selectedCategory)
            .map((cat: any) => (
              <div key={cat.category}>
                <h3 className="text-xl font-black text-slate-900 mb-6">{cat.category}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.items.map((item: any) => (
                    <FoodCard
                      key={item.id}
                      food={{
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        rating: item.rating || 4.5,
                        deliveryTime: item.deliveryTime || restaurant.deliveryTime,
                        deliveryFee: item.deliveryFee || `Tk ${restaurant.deliveryFee}`,
                        restaurantName: item.restaurantName || restaurant.name,
                        cuisine: item.cuisine || restaurant.cuisines[0],
                        dietary: item.dietary,
                        matchPercentage: item.matchPercentage,
                        // FIX: Ensure FoodCard gets imageUrl even if JSON uses image
                        imageUrl: item.imageUrl || item.image,
                        sizes: item.sizes,
                        addons: item.addons,
                      }}
                      onAddToCart={(food) => addToCart(food)}
                      onToggleFavorite={(id) => toggleFavorite(id)}
                      onCardClick={(food) => setSelectedFoodForModal(food)}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Dynamic Sync Reviews Component */}
        <RestaurantReviews
          restaurantId={restaurant.id}
          onRatingUpdate={(newAvg, newCount) => {
            setDynamicRating(newAvg);
            setDynamicReviewCount(newCount);
          }}
        />
      </div>

      {/* Item Modal Popup */}
      <FoodDetailsModal
        food={selectedFoodForModal}
        onClose={() => setSelectedFoodForModal(null)}
      />
    </div>
  );
}