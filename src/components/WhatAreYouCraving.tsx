'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface CravingCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

export interface WhatAreYouCravingProps {
  title?: string;
  subtitle?: string;
  categories?: CravingCategory[];
  onSelectCategory?: (slug: string) => void;
}

const defaultCategories: CravingCategory[] = [
  {
    id: '1',
    name: 'Comfort Food',
    slug: 'comfort-food',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: 'Something Spicy',
    slug: 'something-spicy',
    imageUrl: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '3',
    name: 'Healthy Choice',
    slug: 'healthy-choice',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: 'Protein Packed',
    slug: 'protein-packed',
    imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    name: 'Sweet Cravings',
    slug: 'sweet-cravings',
    imageUrl: 'https://images.unsplash.com/photo-1640789126730-6145d0783e2f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '6',
    name: 'Coffee Break',
    slug: 'coffee-break',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export const WhatAreYouCraving: React.FC<WhatAreYouCravingProps> = ({
  title = "What's your craving?",
  subtitle = 'Explore food that matches your mood.',
  categories = defaultCategories,
  onSelectCategory,
}) => {
  return (
    <section className="relative w-full bg-gradient-to-b from-white to-gray-50 py-20 lg:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-50/50 to-red-50/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Subtitle Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-2 mb-6">
            <span className="text-orange-500 text-sm">🍽️</span>
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 font-normal max-w-lg mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Categories Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((item, index) => {
            const content = (
              <div 
                className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2"
                style={{ animation: `fadeSlideIn 0.5s ease-out ${index * 0.08}s both` }}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Hover icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-orange-600 shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category Label */}
                <div className="p-4 text-center">
                  <span className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </span>
                </div>
              </div>
            );

            if (onSelectCategory) {
              return (
                <div key={item.id} onClick={() => onSelectCategory(item.slug)} className="cursor-pointer">
                  {content}
                </div>
              );
            }

            return (
              <Link key={item.id} href={`/restaurants?craving=${item.slug}`}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatAreYouCraving;
