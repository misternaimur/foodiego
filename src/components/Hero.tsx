'use client';

import React from "react";
import Image from "next/image";
import { ShoppingCart, Utensils, Star } from "lucide-react";

const FOOD_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80", alt: "Salad bowl" },
  { id: 2, src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", alt: "Pizza slice" },
  { id: 3, src: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80", alt: "Pancakes" },
  { id: 4, src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", alt: "Chicken wings" },
  { id: 5, src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", alt: "Healthy bowl" },
  { id: 6, src: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80", alt: "Fresh veggies" },
  { id: 7, src: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80", alt: "Dessert cake" },
];

export default function HeroSection() {
  // Duplicated 4x for a perfectly seamless endless loop
  const marqueeImages = [...FOOD_IMAGES, ...FOOD_IMAGES, ...FOOD_IMAGES, ...FOOD_IMAGES];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6">
      <style>{`
        @keyframes custom-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } 
        }
        .animate-custom-marquee {
          display: flex;
          width: max-content;
          animation: custom-marquee 40s linear infinite;
        }
        .animate-custom-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Container - overflow-hidden is key to clipping the bottoms perfectly */}
      <section className="relative overflow-hidden bg-[#15462D] text-white rounded-[2.5rem] pt-12 md:pt-16 shadow-2xl flex flex-col justify-between">
        
        {/* Top Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs sm:text-sm mb-6 border border-white/15">
            <div className="flex -space-x-2 overflow-hidden">
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-[#15462D] bg-gray-300" />
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-[#15462D] bg-gray-400" />
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-[#15462D] bg-gray-500" />
            </div>
            <span className="font-medium">Loved By 2.4m Users with 4.8 Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-[1.15]">
            Fresh, Delicious &amp; Delivered To Your Door!
          </h1>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-emerald-100/90 max-w-xl leading-relaxed">
            Explore a wide selection of fresh groceries, gourmet ingredients, and ready-to-eat meals. Hassle-free online ordering with fast and reliable delivery.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#F6A429] hover:bg-[#e0931f] text-gray-900 font-semibold px-7 py-3 rounded-full transition-all duration-200 shadow-md">
              <ShoppingCart className="w-4 h-4" />
              SHOP NOW
            </button>
            
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 font-semibold px-7 py-3 rounded-full transition-all duration-200 shadow-md">
              <Utensils className="w-4 h-4" />
              EXPLORE MENU
            </button>
          </div>
        </div>

        {/* Marquee Track aligned flush to the bottom */}
        <div className="mt-14 relative w-full flex items-end">
          <div className="animate-custom-marquee items-end">
            {marqueeImages.map((img, index) => {
              // 1. Sine Wave Rotation: Creates a smooth, continuous ribbon effect 
              // that loops flawlessly without any sharp V-shape jumps.
              const waveCycle = (index / FOOD_IMAGES.length) * Math.PI * 2;
              const rotateDeg = Math.sin(waveCycle) * 4.5; // Max tilt is 4.5 degrees
              
              return (
                <div
                  key={`${img.id}-${index}`}
                  className="mx-2 flex-shrink-0"
                  style={{
                    // 2. Downward Push: translateY(16px) forces the lifted corners below the 
                    // container's bounding box, so the green gap never shows.
                    transform: `translateY(16px) rotate(${rotateDeg}deg)`,
                    transformOrigin: "bottom center",
                  }}
                >
                  {/* Inner div handles the hover pop-up effect without breaking the layout */}
                  <div className="relative w-[160px] h-[220px] sm:w-[200px] sm:h-[280px] md:w-[230px] md:h-[310px] rounded-t-3xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:-translate-y-4 cursor-pointer">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>
    </div>
  );
}