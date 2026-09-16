'use client';

import React from 'react';
import { Utensils } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF7EE] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Icon Badge */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#15462D]/10 text-[#15462D] shadow-sm">
          <Utensils size={32} className="animate-spin" />
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Preparing delicious content...
          </h3>
          <p className="text-xs font-medium text-gray-500">
            Please wait a moment while we load your page.
          </p>
        </div>

        {/* Bouncing Pulse Dots */}
        <div className="flex items-center space-x-1.5 pt-2">
          <div className="w-2 h-2 rounded-full bg-[#15462D] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-[#15462D] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-[#15462D] animate-bounce" />
        </div>
      </div>
    </div>
  );
}