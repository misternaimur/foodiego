'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Clock, ShoppingBag, ArrowLeft, Heart, Tag } from 'lucide-react';
import { useApp, RestaurantMenuItem } from '@/context/AppContext';
import { FoodDetailsModal } from '@/components/FoodDetailsModal';
import { RestaurantReviews } from '@/components/RestaurantReviews';


export default function RestaurantDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { getRestaurantBySlug, addToCart, favorites, toggleFavorite } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<any>(null);

  const restaurant = getRestaurantBySlug(slug as string);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-[#E8E2D5] max-w-sm">
          <p className="text-base font-bold text-gray-800 mb-4">Restaurant not found.</p>
          <button
            onClick={() => router.push('/restaurants')}
            className="bg-[#15462D] text-white text-xs font-bold px-5 py-2.5 rounded-full"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(restaurant.id);
  const activeCategory = selectedCategory || restaurant.menuCategories[0]?.category;

  return (
    <div className="min-h-screen bg-[#FAF7EE] pb-20">
      
      {/* Top Banner & Header Header */}
      <div className="relative w-full h-64 sm:h-80 bg-slate-900">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7EE] via-black/20 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 p-3 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-gray-900 transition-colors shadow-sm z-10"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {/* Restaurant Header Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {restaurant.cuisines.join(' • ')}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {restaurant.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleFavorite(restaurant.id)}
                className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                <span>{isFav ? 'Favorited' : 'Add to favorites'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-6 pt-6 text-xs sm:text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-900">{restaurant.rating}</span>
              <span className="text-gray-500">({restaurant.reviewCount}+ reviews)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-[#15462D]" />
              <span>{restaurant.deliveryTime} delivery</span>
            </div>

            <div>
              <span>Min. order: <strong className="text-slate-900">Tk {restaurant.minOrder}</strong></span>
            </div>
          </div>
        </div>

        {/* Available Deals Section */}
        {restaurant.offers.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-600 mb-3">
              Available Deals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurant.offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-amber-50 border border-amber-200/70 rounded-2xl p-4 flex items-start gap-3"
                >
                  <Tag className="text-[#F6A429] shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">{offer.title}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{offer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Category Sticky Bar */}
        <div className="sticky top-20 bg-[#FAF7EE]/95 backdrop-blur-md py-4 z-20 border-b border-[#E8E2D5] mb-8 overflow-x-auto">
          <div className="flex items-center gap-2">
            {restaurant.menuCategories.map((cat) => (
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
        </div>

        {/* Dish Items Grid */}
        <div className="space-y-12">
          {restaurant.menuCategories
            .filter((cat) => !selectedCategory || cat.category === selectedCategory)
            .map((cat) => (
              <div key={cat.category}>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <span>{cat.category}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.items.map((item: RestaurantMenuItem) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        setSelectedFoodForModal({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          description: item.description,
                          image: item.image,
                          rating: 4.8,
                          category: cat.category,
                        })
                      }
                      className="group bg-white rounded-3xl p-5 border border-[#E8E2D5] hover:shadow-lg transition-all duration-300 cursor-pointer flex justify-between gap-4"
                    >
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          {item.popular && (
                            <span className="inline-block text-[10px] font-extrabold text-[#F6A429] uppercase tracking-wider mb-1">
                              ★ Popular
                            </span>
                          )}
                          <h4 className="text-base font-bold text-slate-900 group-hover:text-[#15462D] transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <p className="text-sm font-extrabold text-[#15462D] mt-3">
                          Tk {item.price}
                        </p>
                      </div>

                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

      </div>

      {/* Food Details Modal Overlay */}
      <FoodDetailsModal
        food={selectedFoodForModal}
        onClose={() => setSelectedFoodForModal(null)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Insert Reviews Component here */}
      <RestaurantReviews restaurantId={restaurant.id} />
    </div>
    </div>
  );
}