'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface CravingCategory {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  imageUrl: string;
}

export interface WhatAreYouCravingProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  categories?: CravingCategory[];
  onSelectCategory?: (slug: string) => void;
}

const defaultCategories: CravingCategory[] = [
  {
    id: '1',
    name: 'Comfort',
    subtitle: 'Warm & satisfying',
    slug: 'comfort',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    name: 'Spicy',
    subtitle: 'Bold & flavorful',
    slug: 'spicy',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    name: 'Fresh',
    subtitle: 'Light & refreshing',
    slug: 'fresh',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    name: 'Quick',
    subtitle: 'Fast & convenient',
    slug: 'quick',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    name: 'Sweet',
    subtitle: 'Something indulgent',
    slug: 'sweet',
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '6',
    name: 'Sharing',
    subtitle: 'Made for together',
    slug: 'sharing',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '7',
    name: 'Late Night',
    subtitle: 'After-hours cravings',
    slug: 'late-night',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
  },
];

export const WhatAreYouCraving: React.FC<WhatAreYouCravingProps> = ({
  badge = 'CRAVING SHORTCUTS',
  title = 'Not sure what to eat?',
  subtitle = "Start with how you feel \u2014 we'll handle the deciding.",
  categories = defaultCategories,
  onSelectCategory,
}) => {
  return (
    <section className="w-full bg-[#FAF7EE] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section (Left Aligned) */}
        <div className="mb-10 text-left">
          <p className="text-xs font-bold text-emerald-800 tracking-widest uppercase mb-2">
            {badge}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal">
            {subtitle}
          </p>
        </div>

        {/* Categories Grid (7-column layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 lg:gap-5">
          {categories.map((item) => {
            const content = (
              <div className="group flex flex-col cursor-pointer">
                {/* Image Container with pill rounded corners */}
                <div className="relative aspect-[4/5] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-200 mb-3 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Text Labels below card */}
                <div className="text-left px-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 leading-tight">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );

            if (onSelectCategory) {
              return (
                <div key={item.id} onClick={() => onSelectCategory(item.slug)}>
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