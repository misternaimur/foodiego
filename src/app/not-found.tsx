'use client';

import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, Compass, Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7EE] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2D5] shadow-xs text-center relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-100 rounded-full blur-2xl pointer-events-none" />

        {/* Floating Animated Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#15462D]/10 text-[#15462D] mb-6 shadow-inner">
          <UtensilsCrossed size={40} className="animate-bounce" />
        </div>

        {/* Main Error Heading */}
        <span className="block text-xs font-black tracking-widest text-emerald-800 uppercase mb-2">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Recipe Not Found
        </h1>
        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-8 leading-relaxed">
          Looks like this page got cooked up and eaten! The URL you’re looking for doesn’t exist or has moved.
        </p>

        {/* Quick Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-[#15462D] hover:bg-[#0f3321] text-white text-xs sm:text-sm font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-xs group cursor-pointer"
          >
            <Home size={16} />
            <span>Back to Home</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/restaurants"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-[#E8E2D5] text-xs sm:text-sm font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Search size={16} className="text-[#15462D]" />
            <span>Explore Restaurants</span>
          </Link>
        </div>

        {/* Footer help link */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-xs font-semibold text-gray-500 flex items-center justify-center gap-1.5">
          <Compass size={14} className="text-amber-500" />
          <span>Need help finding something? <Link href="/contact" className="text-[#15462D] underline">Contact support</Link></span>
        </div>

      </div>
    </div>
  );
}