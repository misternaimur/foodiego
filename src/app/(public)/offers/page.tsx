'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tag,
  Copy,
  Check,
  Percent,
  Truck,
  Gift,
  Clock,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  category: 'discount' | 'delivery' | 'bundle' | 'new-user';
  discountLabel: string;
  minOrder?: string;
  expiresAt: string;
  bgGradient: string;
  restaurantSlug?: string;
  restaurantName?: string;
}

const OFFERS: Offer[] = [
  {
    id: 'off-1',
    title: 'Welcome Bonus for New Users',
    description: 'First time ordering with Foodiego? Get 50% off, up to $10, on your very first order.',
    code: 'WELCOME50',
    category: 'new-user',
    discountLabel: '50% OFF',
    minOrder: 'Min. order $15',
    expiresAt: 'No expiry',
    bgGradient: 'from-[#15462D] to-[#1e5d3c]',
  },
  {
    id: 'off-2',
    title: 'Free Delivery Weekend',
    description: 'Enjoy $0 delivery fee on all orders above $15, every Friday to Sunday.',
    code: 'FREESHIP',
    category: 'delivery',
    discountLabel: 'FREE DELIVERY',
    minOrder: 'Min. order $15',
    expiresAt: 'Ends Oct 31, 2026',
    bgGradient: 'from-amber-600 to-amber-800',
  },
  {
    id: 'off-3',
    title: '20% Off Burger Joint Co.',
    description: 'Craving a juicy burger? Get 20% off your entire order from Burger Joint Co.',
    code: 'BURGER20',
    category: 'discount',
    discountLabel: '20% OFF',
    minOrder: 'Min. order $10',
    expiresAt: 'Ends Nov 15, 2026',
    bgGradient: 'from-orange-500 to-red-600',
    restaurantSlug: 'burger-joint-co',
    restaurantName: 'Burger Joint Co.',
  },
  {
    id: 'off-4',
    title: 'Buy 1 Get 1 Free — Sushi Master',
    description: 'Order any sushi platter and get a second one absolutely free, only at Sushi Master.',
    code: 'SUSHIBOGO',
    category: 'bundle',
    discountLabel: 'BOGO',
    minOrder: 'No minimum',
    expiresAt: 'Ends Nov 5, 2026',
    bgGradient: 'from-slate-700 to-slate-900',
    restaurantSlug: 'sushi-master',
    restaurantName: 'Sushi Master',
  },
  {
    id: 'off-5',
    title: 'Sweet Treats Bakery Combo',
    description: 'Get a free drink with any dessert order over $12 from Sweet Treats Bakery.',
    code: 'SWEETCOMBO',
    category: 'bundle',
    discountLabel: 'FREE DRINK',
    minOrder: 'Min. order $12',
    expiresAt: 'Ends Nov 20, 2026',
    bgGradient: 'from-pink-500 to-rose-600',
    restaurantSlug: 'sweet-treats-bakery',
    restaurantName: 'Sweet Treats Bakery',
  },
  {
    id: 'off-6',
    title: 'Flat $5 Off Weekday Lunch',
    description: 'Order between 12 PM–3 PM on weekdays and get a flat $5 discount on your meal.',
    code: 'LUNCH5',
    category: 'discount',
    discountLabel: '$5 OFF',
    minOrder: 'Min. order $20',
    expiresAt: 'Ongoing',
    bgGradient: 'from-emerald-600 to-teal-700',
  },
];

const FILTERS: { id: Offer['category'] | 'all'; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'all', label: 'All Offers', icon: Sparkles },
  { id: 'new-user', label: 'New User', icon: Gift },
  { id: 'discount', label: 'Discounts', icon: Percent },
  { id: 'delivery', label: 'Free Delivery', icon: Truck },
  { id: 'bundle', label: 'Combos', icon: Tag },
];

export default function OffersPage() {
  const { user } = useApp();
  const [activeFilter, setActiveFilter] = useState<Offer['category'] | 'all'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredOffers = useMemo(() => {
    if (activeFilter === 'all') return OFFERS;
    return OFFERS.filter((offer) => offer.category === activeFilter);
  }, [activeFilter]);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((current) => (current === code ? null : current)), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#15462D] py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs sm:text-sm mb-6 border border-white/15 text-white">
            <Tag className="w-4 h-4 text-amber-400" />
            <span className="font-medium">
              {user ? `Special deals just for you, ${user.name?.split(' ')[0] || 'friend'}!` : 'New deals added every week'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Offers &amp; Promotions
          </h1>
          <p className="text-sm sm:text-lg text-emerald-100/80 max-w-2xl mx-auto">
            Save more on every order with exclusive discounts, free delivery deals, and combo offers
            from your favorite restaurants.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#15462D] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-[#E8E2D5] hover:bg-gray-50'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-amber-300' : 'text-gray-400'} />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Offers Grid */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E2D5]">
            <Tag size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-base font-semibold text-gray-700">No offers in this category right now</p>
            <p className="text-xs text-gray-500 mt-1">Check back soon — new deals are added regularly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const isCopied = copiedCode === offer.code;
              return (
                <div
                  key={offer.id}
                  className="group bg-white rounded-3xl border border-[#E8E2D5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Gradient Banner */}
                  <div className={`relative bg-gradient-to-r ${offer.bgGradient} p-5 text-white`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <Clock size={10} />
                        {offer.expiresAt}
                      </span>
                      <span className="text-lg sm:text-xl font-black tracking-tight whitespace-nowrap">
                        {offer.discountLabel}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base sm:text-lg font-black leading-snug">{offer.title}</h3>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{offer.description}</p>

                      {offer.restaurantName && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#15462D]">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span>{offer.restaurantName}</span>
                        </div>
                      )}

                      {offer.minOrder && (
                        <p className="mt-2 text-[11px] font-medium text-gray-400">{offer.minOrder}</p>
                      )}
                    </div>

                    {/* Code + Action */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleCopyCode(offer.code)}
                        className="w-full flex items-center justify-between gap-2 rounded-xl border-2 border-dashed border-[#15462D]/30 bg-[#FAF7EE] px-4 py-2.5 transition-colors hover:bg-emerald-50 cursor-pointer"
                      >
                        <span className="text-sm font-black tracking-widest text-[#15462D]">
                          {offer.code}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500">
                          {isCopied ? (
                            <>
                              <Check size={13} className="text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy</span>
                            </>
                          )}
                        </span>
                      </button>

                      <Link
                        href={offer.restaurantSlug ? `/restaurants/${offer.restaurantSlug}` : '/restaurants'}
                        className="flex items-center justify-center gap-1.5 w-full bg-[#F6A429] hover:bg-[#e0931f] text-gray-900 text-xs font-extrabold uppercase tracking-wide px-4 py-2.5 rounded-xl transition-colors"
                      >
                        <span>{offer.restaurantSlug ? 'Order Now' : 'Browse Restaurants'}</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-[#15462D] p-8 sm:p-12 text-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="absolute -bottom-10 right-1/4 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="relative">
            <Gift className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
              Never miss a deal
            </h2>
            <p className="text-sm text-emerald-100/80 max-w-md mx-auto mb-6">
              {user
                ? "You're all set! We'll notify you whenever a new offer drops."
                : 'Create a free account to get notified about exclusive offers first.'}
            </p>
            {!user && (
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-[#F6A429] hover:bg-[#e0931f] text-gray-900 font-extrabold text-xs uppercase tracking-wide px-6 py-3 rounded-full transition-colors shadow-md"
              >
                <span>Sign Up Free</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}