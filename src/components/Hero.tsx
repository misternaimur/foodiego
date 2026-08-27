'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface HeroProps {
  onAiSearch?: (query: string) => void;
  heroImageUrl?: string;
}

const defaultTags = [
  { label: 'Spicy', emoji: '🔥' },
  { label: 'Healthy', emoji: '🥗' },
  { label: 'Comfort', emoji: '🍔' },
  { label: 'Sushi', emoji: '🍣' },
];

export const Hero: React.FC<HeroProps> = ({
  onAiSearch,
  heroImageUrl = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80',
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && onAiSearch) {
      onAiSearch(prompt.trim());
    }
  };

  const handleTagClick = (tagLabel: string) => {
    setPrompt(tagLabel);
    if (onAiSearch) {
      onAiSearch(tagLabel);
    }
  };

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-100 to-red-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-100 to-orange-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headline & AI Prompt Input */}
          <div className="flex flex-col space-y-8">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-full px-4 py-2 w-fit">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">AI-Powered Delivery</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]">
              Good food.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#b93815] to-[#d4622a] mt-2">
                Smarter delivery.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              Discover great food, get personalized recommendations, and track every delivery in real time with our AI assistant.
            </p>

            {/* AI Prompt Input Bar */}
            <form onSubmit={handleSubmit}>
              <div className="relative flex items-center bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 p-2 transition-all focus-within:border-orange-300 focus-within:shadow-xl focus-within:shadow-orange-100/50">
                
                {/* Sparkles AI Icon */}
                <div className="pl-3 pr-2 text-orange-500 shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z" />
                  </svg>
                </div>

                {/* Text Input */}
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Tell Foodiego what you're in the mood for..."
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none px-2 py-2"
                />

                {/* Action Button */}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#b93815] to-[#d4622a] hover:from-[#a33010] hover:to-[#b93815] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shrink-0 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  <span>Ask Foodiego</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center gap-3">
              {defaultTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleTagClick(tag.label)}
                  className="flex items-center gap-2 bg-white border border-gray-200 hover:border-orange-200 text-sm font-semibold text-gray-700 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:text-orange-700"
                >
                  <span>{tag.emoji}</span>
                  <span>{tag.label}</span>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-black text-gray-900">10K+</p>
                <p className="text-xs text-gray-500 font-medium">Restaurants</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <p className="text-2xl font-black text-gray-900">50K+</p>
                <p className="text-xs text-gray-500 font-medium">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <p className="text-2xl font-black text-gray-900">30min</p>
                <p className="text-xs text-gray-500 font-medium">Avg Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Container */}
          <div className="relative group" style={{ perspective: '1200px' }}>
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Main Food Image */}
              <div className="relative aspect-[4/3] sm:aspect-[3/4] lg:aspect-square bg-gray-100">
                <Image
                  src={heroImageUrl}
                  alt="Delicious food"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Bottom Floating Delivery Card */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/60">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Delivery Bike Icon Container */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-orange-600 shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>

                    {/* Order Status Info */}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        Your order is on the way
                      </p>
                      <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
                        Arriving in 18 min • AI Optimized Route
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar Indicator */}
                  <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full w-[75%] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
