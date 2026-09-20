'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Clock, ArrowLeft, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import FoodCard, { FoodItem } from '@/components/FoodCard';
import { RestaurantReviews } from '@/components/RestaurantReviews';
import { FoodDetailsModal } from '@/components/FoodDetailsModal';

type MenuItemData = {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: string;
  restaurantName?: string;
  cuisine?: string;
  dietary?: string;
  matchPercentage?: number | null;
  imageUrl?: string;
  sizes?: FoodItem['sizes'];
  addons?: FoodItem['addons'];
};

type MenuCategoryData = {
  id: string;
  name: string;
  items: MenuItemData[];
};

export default function RestaurantDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { getRestaurantBySlug, addToCart, favorites, toggleFavorite } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);

  const [fetchedMenuItems, setFetchedMenuItems] = useState<MenuItemData[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState<boolean>(true);

  const restaurant = getRestaurantBySlug(slug as string);

  const [dynamicRating, setDynamicRating] = useState<number>(restaurant?.rating || 4.5);
  const [dynamicReviewCount, setDynamicReviewCount] = useState<number>(restaurant?.reviewCount || 1);

  useEffect(() => {
    const loadRestaurantMenu = async () => {
      const restId = (restaurant as any)?._id || restaurant?.id;
      if (!restId) return;
      
      try {
        setIsMenuLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_URL}/api/menu/restaurant/${restId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch restaurant menu');
        }

        const data = await res.json();
        const items = data.data || [];

        const formattedItems = items.map((item: any) => ({
          ...item,
          id: item._id || item.id,
          imageUrl: item.image || item.imageUrl || '/default-food.png',
        }));

        setFetchedMenuItems(formattedItems);
      } catch (error) {
        console.error('Failed to load menu from backend:', error);
      } finally {
        setIsMenuLoading(false);
      }
    };

    loadRestaurantMenu();
  }, [restaurant]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] flex items-center justify-center p-4">
        <button
          onClick={() => router.push('/restaurants')}
          className="bg-[#15462D] text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  const targetRestaurantId = (restaurant as any)._id || restaurant.id;
  const isFav = favorites.includes(targetRestaurantId);

  const validBannerImage =
    restaurant.image && restaurant.image.trim() !== ''
      ? restaurant.image
      : '/default-banner.png';

  const validLogoImage =
    restaurant.logo && restaurant.logo.trim() !== ''
      ? restaurant.logo
      : '/default-logo.png';

  const displayedCategories: MenuCategoryData[] =
    fetchedMenuItems.length > 0
      ? [
          {
            id: 'all-items',
            name: 'All Items',
            items: fetchedMenuItems,
          },
        ]
      : restaurant.menuCategories || [];

  const activeCategory = selectedCategory || displayedCategories[0]?.name;

  return (
    <div className="min-h-screen bg-[#FAF7EE] pb-20">
      <div className="relative w-full h-64 sm:h-80 bg-slate-900">
        <Image
          src={validBannerImage}
          alt={restaurant.restaurantName}
          fill
          priority
          className="object-cover opacity-60"
        />
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 p-3 rounded-full bg-white/80 backdrop-blur-md text-gray-900 hover:bg-white transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#E8E2D5] shadow-md bg-gray-50 shrink-0">
                <Image
                  src={validLogoImage}
                  alt={restaurant.restaurantName}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {restaurant.cuisines?.join(' • ') || restaurant.cuisineType || 'Various Cuisines'}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {restaurant.restaurantName}
                </h1>
              </div>
            </div>

            <button
              onClick={() => toggleFavorite(targetRestaurantId)}
              className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shrink-0"
            >
              <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : ''} />
              <span>{isFav ? 'Favorited' : 'Add to favorites'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6 text-xs sm:text-sm font-semibold text-gray-700">
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

        <div className="sticky top-20 bg-[#FAF7EE]/95 backdrop-blur-md py-4 z-20 border-b border-[#E8E2D5] mb-8 overflow-x-auto flex gap-2 scrollbar-none">
          {displayedCategories.map((cat: MenuCategoryData) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.name
                  ? 'bg-[#15462D] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-[#E8E2D5] hover:bg-gray-50'
              }`}
            >
              {cat.name} ({cat.items.length})
            </button>
          ))}
        </div>

        {isMenuLoading ? (
          <div className="text-center py-12 text-sm font-semibold text-gray-600">
            Loading backend menu items...
          </div>
        ) : (
          <div className="space-y-12">
            {displayedCategories
              .filter((cat: MenuCategoryData) => !selectedCategory || cat.name === selectedCategory)
              .map((cat: MenuCategoryData) => (
                <div key={cat.id || cat.name}>
                  <h3 className="text-xl font-black text-slate-900 mb-6">{cat.name}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cat.items.map((item: MenuItemData) => {
                      const itemTargetId = item._id || item.id;
                      return (
                        <FoodCard
                          key={itemTargetId}
                          food={{
                            id: itemTargetId,
                            name: item.name,
                            description: item.description,
                            price: item.price,
                            rating: item.rating || 4.5,
                            deliveryTime: item.deliveryTime || restaurant.deliveryTime,
                            deliveryFee: item.deliveryFee || `Tk ${restaurant.deliveryFee}`,
                            restaurantName: item.restaurantName || restaurant.restaurantName,
                            cuisine: item.cuisine || restaurant.cuisines?.[0] || 'General',
                            dietary: item.dietary,
                            matchPercentage: item.matchPercentage,
                            imageUrl: item.imageUrl || item.image || '/default-food.png',
                            sizes: item.sizes,
                            addons: item.addons,
                            isFavorite: favorites.includes(itemTargetId),
                          }}
                          onAddToCart={(food) => addToCart(food)}
                          onToggleFavorite={(id) => toggleFavorite(id)}
                          onCardClick={(food) => setSelectedFoodForModal(food)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}

        <RestaurantReviews
          restaurantId={targetRestaurantId}
          onRatingUpdate={(newAvg, newCount) => {
            setDynamicRating(newAvg);
            setDynamicReviewCount(newCount);
          }}
        />
      </div>

      <FoodDetailsModal
        food={selectedFoodForModal}
        onClose={() => setSelectedFoodForModal(null)}
      />
    </div>
  );
}