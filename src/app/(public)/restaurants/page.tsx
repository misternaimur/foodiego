'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Heart,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react';

import { useApp } from '@/context/AppContext';

const PROMO_SLIDES = [
  {
    id: 1,
    title: '50% OFF Your First Order',
    description: 'Use promo code WELCOME50 at checkout.',
    tag: 'Limited Time Offer',
    bgGradient: 'from-[#15462D] to-[#1e5d3c]',
    buttonText: 'Claim Discount',
    buttonLink: '/offers',
    badgeColor: 'bg-[#F6A429] text-gray-900',
  },
  {
    id: 2,
    title: 'Free Delivery Weekend',
    description: 'Enjoy $0 delivery fee on orders over $15.',
    tag: 'Weekend Special',
    bgGradient: 'from-amber-600 to-amber-800',
    buttonText: 'Explore Spots',
    buttonLink: '/restaurants',
    badgeColor: 'bg-white text-amber-900',
  },
  {
    id: 3,
    title: 'Discover AI Recommendations',
    description: 'Get personalized meal suggestions tailored to your taste.',
    tag: 'Smart Assistant',
    bgGradient: 'from-emerald-900 via-slate-900 to-emerald-950',
    buttonText: 'Try AI Assistant',
    buttonLink: '/ai-assistant',
    badgeColor: 'bg-emerald-400 text-slate-950',
  },
];

type SortOption = 'relevance' | 'fastest' | 'rating';

const getValidImage = (
  logoUrl: unknown,
  imageUrl: unknown,
): string => {
  if (typeof logoUrl === 'string' && logoUrl.trim().length > 0) {
    return logoUrl;
  }

  if (typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
    return imageUrl;
  }

  return '/default-banner.png';
};

export default function RestaurantsPage() {
  const {
    restaurants,
    isRestaurantsLoading,
    favorites,
    toggleFavorite,
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSort, setSelectedSort] =
    useState<SortOption>('relevance');
  const [minRating, setMinRating] = useState(0);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlide((previousSlide) => {
        return (previousSlide + 1) % PROMO_SLIDES.length;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentSlide(
      (previousSlide) => (previousSlide + 1) % PROMO_SLIDES.length,
    );
  };

  const previousSlide = () => {
    setCurrentSlide(
      (previousSlide) =>
        (previousSlide - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length,
    );
  };

  const allCuisines = useMemo(() => {
    const cuisines = new Set<string>();

    restaurants.forEach((restaurant) => {
      restaurant.cuisines?.forEach((cuisine) => {
        cuisines.add(cuisine);
      });
    });

    return ['All', ...Array.from(cuisines)];
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    return [...restaurants]
      .filter((restaurant) => {
        const matchesRating = restaurant.rating >= minRating;

        const matchesCuisine =
          selectedCuisine === 'All' ||
          restaurant.cuisines?.includes(selectedCuisine);

        return matchesRating && matchesCuisine;
      })
      .sort((firstRestaurant, secondRestaurant) => {
        if (selectedSort === 'rating') {
          return secondRestaurant.rating - firstRestaurant.rating;
        }

        if (selectedSort === 'fastest') {
          const firstTime = Number.parseInt(
            firstRestaurant.deliveryTime,
            10,
          ) || 999;

          const secondTime = Number.parseInt(
            secondRestaurant.deliveryTime,
            10,
          ) || 999;

          return firstTime - secondTime;
        }

        return 0;
      });
  }, [restaurants, minRating, selectedCuisine, selectedSort]);

  const resetFilters = () => {
    setSelectedSort('relevance');
    setMinRating(0);
    setSelectedCuisine('All');
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              All Restaurants
            </h1>

            <p className="mt-1 text-sm font-medium text-gray-600">
              Discover top kitchens near you delivered fast
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen((isOpen) => !isOpen)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#E8E2D5] bg-white px-4 py-2 text-xs font-bold text-[#15462D] shadow-xs lg:hidden"
          >
            <Filter size={14} />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
          {/* Filters */}
          <aside
            className={`${
              isMobileFilterOpen ? 'block' : 'hidden'
            } sticky top-24 z-10 rounded-3xl border border-[#E8E2D5] bg-white p-6 shadow-xs lg:block`}
          >
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Filters
              </h2>

              {(selectedSort !== 'relevance' ||
                minRating > 0 ||
                selectedCuisine !== 'All') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="cursor-pointer text-xs font-semibold text-emerald-800 hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Sort By
              </h3>

              <div className="space-y-2">
                {[
                  { id: 'relevance', label: 'Relevance' },
                  { id: 'fastest', label: 'Fastest Delivery' },
                  { id: 'rating', label: 'Top Rated' },
                ].map((option) => (
                  <label
                    key={option.id}
                    className="group flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="radio"
                      name="sort"
                      value={option.id}
                      checked={selectedSort === option.id}
                      onChange={() =>
                        setSelectedSort(option.id as SortOption)
                      }
                      className="h-4 w-4 accent-[#15462D]"
                    />

                    <span className="text-sm font-medium text-gray-700 group-hover:text-slate-900">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Rating
              </h3>

              <div className="flex flex-wrap gap-2">
                {[0, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setMinRating(rating)}
                    className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
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

            {/* Cuisine */}
            <div>
              <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                Cuisine
              </h3>

              <div className="max-h-60 space-y-2 overflow-y-auto pr-2">
                {allCuisines.map((cuisine) => (
                  <label
                    key={cuisine}
                    className="group flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="radio"
                      name="cuisine"
                      value={cuisine}
                      checked={selectedCuisine === cuisine}
                      onChange={() => setSelectedCuisine(cuisine)}
                      className="h-4 w-4 accent-[#15462D]"
                    />

                    <span className="text-sm font-medium text-gray-700 group-hover:text-slate-900">
                      {cuisine}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Promo Slider */}
            <div
              className="group relative mb-8 w-full overflow-hidden rounded-2xl shadow-md"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {PROMO_SLIDES.map((slide) => (
                  <div
                    key={slide.id}
                    className={`relative flex min-h-35 w-full shrink-0 items-center justify-between bg-gradient-to-r p-5 text-white sm:min-h-[160px] sm:p-6 ${slide.bgGradient}`}
                  >
                    <div className="relative z-10 max-w-lg">
                      <span
                        className={`mb-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${slide.badgeColor}`}
                      >
                        <Tag size={10} />
                        {slide.tag}
                      </span>

                      <h2 className="mb-1 text-lg font-black tracking-tight sm:text-2xl">
                        {slide.title}
                      </h2>

                      <p className="mb-3 line-clamp-1 text-xs font-medium text-white/80">
                        {slide.description}
                      </p>

                      <Link
                        href={slide.buttonLink}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-gray-900 shadow-xs transition-all hover:bg-gray-100"
                      >
                        {slide.buttonText}
                        <Sparkles size={12} className="text-amber-500" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-1.5 text-white transition-colors hover:bg-black/50"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/30 p-1.5 text-white transition-colors hover:bg-black/50"
              >
                <ChevronRight size={16} />
              </button>

              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
                {PROMO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-1.5 cursor-pointer rounded-full transition-all ${
                      currentSlide === index
                        ? 'w-5 bg-white'
                        : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Restaurant Cards */}
            {isRestaurantsLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-72 w-full animate-pulse rounded-3xl bg-white/70"
                  />
                ))}
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="rounded-3xl border border-[#E8E2D5] bg-white py-20 text-center">
                <p className="text-base font-semibold text-gray-700">
                  No restaurants found
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Try resetting your filters or selecting a different cuisine.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {filteredRestaurants.map((restaurant) => {
                  const isFavorite = favorites.includes(restaurant.id);

                  const imageUrl = getValidImage(
                    restaurant.logoUrl,
                    restaurant.image,
                  );

                  return (
                    <div
                      key={restaurant.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E8E2D5] bg-white transition-all duration-300 hover:shadow-xl"
                    >
                      <Link
                        href={`/restaurants/${restaurant.slug}`}
                        className="block"
                      >
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                          <Image
                            src={imageUrl}
                            alt={restaurant.restaurantName}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                          {restaurant.badge && (
                            <span className="absolute left-3 top-3 rounded-full bg-[#15462D] px-3 py-1 text-[10px] font-extrabold uppercase text-white shadow-xs">
                              {restaurant.badge}
                            </span>
                          )}

                          <button
                            type="button"
                            aria-label="Toggle favorite"
                            onClick={(event) => {
                              event.preventDefault();
                              toggleFavorite(restaurant.id);
                            }}
                            className="absolute right-3 top-3 cursor-pointer rounded-full bg-white/80 p-2 text-gray-700 shadow-xs backdrop-blur-md transition-colors hover:bg-white"
                          >
                            <Heart
                              size={16}
                              className={
                                isFavorite
                                  ? 'fill-red-500 text-red-500'
                                  : ''
                              }
                            />
                          </button>
                        </div>

                        <div className="p-5">
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <h3 className="truncate text-lg font-black text-slate-900 transition-colors group-hover:text-[#15462D]">
                              {restaurant.restaurantName}
                            </h3>

                            <div className="flex shrink-0 items-center gap-1 rounded-full border border-amber-200/50 bg-amber-50 px-2 py-0.5">
                              <Star
                                size={13}
                                className="fill-amber-400 text-amber-400"
                              />

                              <span className="text-xs font-bold text-gray-900">
                                {restaurant.rating}
                              </span>

                              <span className="text-[10px] text-gray-500">
                                ({restaurant.reviewCount})
                              </span>
                            </div>
                          </div>

                          <p className="mb-3 truncate text-xs font-medium text-gray-500">
                            {restaurant.cuisines?.join(' • ') ||
                              'Various Cuisines'}
                          </p>

                          <div className="flex items-center gap-4 border-t border-gray-100 pt-3 text-xs font-bold text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock
                                size={13}
                                className="text-emerald-800"
                              />
                              {restaurant.deliveryTime}
                            </span>
                            <span>•</span>
                            <span>
                              Tk {restaurant.deliveryFee} delivery
                            </span>
                          </div>
                        </div>
                      </Link>

                      {restaurant.offers?.length > 0 && (
                        <div className="flex items-center justify-between border-t border-[#E8E2D5] bg-[#FAF7EE] px-5 py-2.5 text-xs font-bold text-[#15462D]">
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