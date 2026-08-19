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
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
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
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: '4',
        name: 'Protein Packed',
        slug: 'protein-packed',
        imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=400&q=80',
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
        <section className="w-full bg-[#faf9f6] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
            
            {/* Title & Subtitle Section */}
            <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight">
                {title}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#6b7280] font-normal">
                {subtitle}
            </p>
            </div>

            {/* Categories Circle Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 justify-items-center">
            {categories.map((item) => {
                const content = (
                <div className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:-translate-y-1">
                    {/* Circular Image Wrapper */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#eee] p-1 shadow-sm border-2 border-white group-hover:border-[#c83214]/20 group-hover:shadow-md transition-all">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 112px, 128px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    </div>

                    {/* Category Label */}
                    <span className="mt-3 text-sm sm:text-base font-semibold text-[#222222] text-center group-hover:text-[#c83214] transition-colors">
                    {item.name}
                    </span>
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