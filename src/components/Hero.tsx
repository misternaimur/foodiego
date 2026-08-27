    'use client';

    import React, { useState } from 'react';
    import Image from 'next/image';

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
        <section className="w-full bg-[#faf9f6] py-12 lg:py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Headline & AI Prompt Input */}
            <div className="flex flex-col space-y-6 max-w-xl">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] tracking-tight leading-[1.15]">
                Good food.
                <span className="block text-[#c83214] mt-1">Smarter delivery.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6b7280] leading-relaxed">
                Discover great food, get personalized recommendations, and track every delivery in real time.
            </p>

            {/* AI Prompt Input Bar */}
            <form onSubmit={handleSubmit} className="pt-2">
                <div className="relative flex items-center bg-white rounded-2xl border border-gray-200/90 shadow-sm p-2 transition-all focus-within:border-gray-400 focus-within:shadow-md">
                
                {/* Sparkles AI Icon */}
                <div className="pl-3 pr-2 text-indigo-500 shrink-0">
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
                    className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none px-2"
                />

                {/* Action Button */}
                <button
                    type="submit"
                    className="bg-[#f04423] hover:bg-[#d83819] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-sm hover:cursor-pointer"
                >
                    <span>Ask Foodiego</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
                </div>
            </form>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {defaultTags.map((tag) => (
                <button
                    key={tag.label}
                    type="button"
                    onClick={() => handleTagClick(tag.label)}
                    className="flex items-center gap-1.5 bg-white border border-gray-200/80 hover:border-gray-300 text-xs font-semibold text-gray-700 rounded-full px-3.5 py-1.5 shadow-2xs transition-all hover:bg-gray-50 hover:cursor-pointer"
                >
                    <span>{tag.emoji}</span>
                    <span>{tag.label}</span>
                </button>
                ))}
            </div>

            </div>

            {/* Right Column: Hero Visual Container */}
            <div className="relative w-full aspect-4/3 sm:aspect-14/11 lg:aspect-square rounded-4xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
            
            {/* Main Food Image */}
            <Image
                src={heroImageUrl}
                alt="Delicious sushi platter"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
            />

            {/* Bottom Floating Delivery Card */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/60 flex items-center justify-between gap-4">
                
                <div className="flex items-center gap-3.5 min-w-0">
                {/* Delivery Bike Icon Container */}
                <div className="w-10 h-10 rounded-full bg-[#ebe7fd] flex items-center justify-center text-[#6342e8] shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="w-12 sm:w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden shrink-0">
                <div className="h-full bg-[#f04423] rounded-full w-[75%]" />
                </div>

            </div>

            </div>

        </div>
        </section>
    );
    };

    export default Hero;