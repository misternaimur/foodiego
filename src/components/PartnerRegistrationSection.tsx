'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Check, 
  MapPin, 
  Phone, 
  Search, 
  ShoppingBag, 
  Utensils, 
  Bike, 
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function PartnerRegistrationSection() {
  return (
    <section className="bg-[#FAF7EE] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-[#15462D]/10 text-[#15462D] text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full mb-3">
            BENEFITS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Win-win for restaurants & riders alike
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-2 leading-relaxed">
            Expand your kitchen operations or earn on your own schedule with FoodieGo&apos;s seamless delivery platform.
          </p>
        </div>

        {/* Two Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Restaurant Partner */}
          <div className="bg-white rounded-[32px] border border-[#E8E2D5] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300">
            <div>
              {/* Custom CSS Phone Mockup Banner */}
              <div className="relative w-full h-72 sm:h-80 rounded-[24px] bg-[#15462D] overflow-hidden mb-8 flex items-end justify-center p-4">
                
                {/* Phone Frame */}
                <div className="w-[210px] sm:w-[230px] h-[270px] sm:h-[300px] bg-slate-900 rounded-t-[36px] border-x-[6px] border-t-[6px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden">
                  {/* Phone Notch */}
                  <div className="w-24 h-4 bg-slate-900 mx-auto rounded-b-xl z-20 flex items-center justify-center">
                    <div className="w-8 h-1 bg-slate-700 rounded-full" />
                  </div>

                  {/* Phone Screen UI */}
                  <div className="bg-slate-50 flex-1 p-3 flex flex-col gap-2 font-sans select-none overflow-hidden">
                    {/* Header bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-black text-slate-800">FoodieGo Partner</span>
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">🍔</div>
                    </div>

                    {/* Headline in App */}
                    <p className="text-[11px] font-black text-slate-900 leading-tight">
                      Enjoy Our <br /><span className="text-[#15462D]">Delicious Foods</span>
                    </p>

                    {/* Mock Search Bar */}
                    <div className="bg-white border border-gray-200 rounded-full px-2 py-1 flex items-center gap-1 shadow-2xs">
                      <Search size={10} className="text-gray-400" />
                      <span className="text-[9px] text-gray-400 font-medium">Search Food...</span>
                    </div>

                    {/* Category Icons */}
                    <div className="grid grid-cols-4 gap-1.5 py-1">
                      {[
                        { name: 'Pizza', emoji: '🍕' },
                        { name: 'Burger', emoji: '🍔' },
                        { name: 'Chicken', emoji: '🍗' },
                        { name: 'Ramen', emoji: '🍜' },
                      ].map((cat, i) => (
                        <div key={i} className="bg-white p-1 rounded-lg border border-gray-100 flex flex-col items-center">
                          <span className="text-[12px]">{cat.emoji}</span>
                          <span className="text-[7px] font-bold text-gray-600">{cat.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* App Product Cards */}
                    <div className="grid grid-cols-2 gap-1.5 mt-0.5">
                      <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-2xs">
                        <div className="w-full h-10 bg-amber-100 rounded-lg flex items-center justify-center text-base">🍔</div>
                        <p className="text-[8px] font-black text-slate-800 mt-1">Beef Burger</p>
                        <p className="text-[8px] font-bold text-[#15462D]">Tk 180</p>
                      </div>
                      <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-2xs">
                        <div className="w-full h-10 bg-[#15462D]/10 rounded-lg flex items-center justify-center text-base">🍕</div>
                        <p className="text-[8px] font-black text-slate-800 mt-1">Cheesy Pizza</p>
                        <p className="text-[8px] font-bold text-[#15462D]">Tk 350</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: Received New Order (Left) */}
                <div className="absolute left-3 sm:left-6 bottom-8 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/40 flex flex-col items-center gap-1 z-30 animate-bounce-subtle">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-black text-slate-900 leading-tight">Received</p>
                    <p className="text-[10px] font-extrabold text-emerald-800">New Order</p>
                  </div>
                </div>

                {/* Floating Avatar Card: Rider Popup (Right) */}
                <div className="absolute right-3 sm:right-6 top-8 bg-amber-400 rounded-2xl p-2.5 shadow-xl border border-amber-300 flex items-center gap-2.5 z-30">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-xl shadow-inner">
                    🛵
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-950 uppercase tracking-wide">Rider Assigned</p>
                    <p className="text-[11px] font-black text-slate-950">Fast Dispatch</p>
                  </div>
                </div>

              </div>

              {/* Title & Description */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
                Effortless management of restaurant operations
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mb-6">
                Connect your kitchen directly to local foodies. Gain live order management, real-time status updates, and automated delivery dispatch.
              </p>

              {/* Checkbox Benefits */}
              <ul className="space-y-3 mb-8">
                {[
                  'Handling of live incoming orders',
                  'Sales system connectivity & tracking',
                  'Upfront payment by customers',
                  'Increased daily order volume',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-700">
                    <CheckCircle2 size={18} className="text-[#15462D] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Link
              href="https://foodiego-mu.vercel.app/auth/register/restaurant"
              className="inline-flex items-center justify-center gap-2 bg-[#15462D] hover:bg-[#103723] text-white font-extrabold text-sm py-4 px-6 rounded-2xl transition-all duration-200 shadow-sm"
            >
              <span>Register Your Restaurant</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 2: Rider Partner */}
          <div className="bg-white rounded-[32px] border border-[#E8E2D5] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300">
            <div>
              {/* Custom CSS Tracking Map Mockup Banner */}
              <div className="relative w-full h-72 sm:h-80 rounded-[24px] bg-[#15462D] overflow-hidden mb-8 flex items-end justify-center p-4">
                
                {/* Phone Frame */}
                <div className="w-[210px] sm:w-[230px] h-[270px] sm:h-[300px] bg-slate-900 rounded-t-[36px] border-x-[6px] border-t-[6px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden">
                  {/* Phone Notch */}
                  <div className="w-24 h-4 bg-slate-900 mx-auto rounded-b-xl z-20 flex items-center justify-center">
                    <div className="w-8 h-1 bg-slate-700 rounded-full" />
                  </div>

                  {/* Phone Screen Map UI */}
                  <div className="bg-slate-100 flex-1 relative overflow-hidden flex flex-col justify-between p-2">
                    {/* Simulated Map Background */}
                    <div className="absolute inset-0 bg-[#e5e9ec] opacity-90">
                      {/* Grid Map Lines */}
                      <div className="absolute top-8 left-0 right-0 h-1 bg-white" />
                      <div className="absolute top-24 left-0 right-0 h-1 bg-white" />
                      <div className="absolute top-0 bottom-0 left-12 w-1 bg-white" />
                      <div className="absolute top-0 bottom-0 left-36 w-1 bg-white" />

                      {/* Route Path (Orange Line) */}
                      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 50 190 L 50 100 L 140 100 L 140 40" fill="none" stroke="#F6A429" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 2" />
                      </svg>

                      {/* Start Dot */}
                      <div className="absolute bottom-[70px] left-[44px] w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white shadow-md" />
                      
                      {/* Waypoint Icon */}
                      <div className="absolute top-[32px] left-[134px] w-4 h-4 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold shadow-md">
                        📍
                      </div>
                    </div>

                    {/* Top App Title */}
                    <div className="relative z-10 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl border border-gray-200 text-center shadow-2xs">
                      <p className="text-[10px] font-black text-slate-800">Live Order Tracking</p>
                    </div>

                    {/* Bottom Rider Info Card inside Phone */}
                    <div className="relative z-10 bg-white p-2 rounded-xl shadow-md border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">👨‍💼</div>
                        <div>
                          <p className="text-[9px] font-black text-slate-900">Rahim Ahmed</p>
                          <p className="text-[7px] font-bold text-gray-500">FoodieGo Delivery Partner</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <Phone size={10} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card 1: Ongoing Order (Left) */}
                <div className="absolute left-2 sm:left-5 top-14 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/40 z-30 text-center">
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white mx-auto mb-1 flex items-center justify-center">
                    <Clock size={14} />
                  </div>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Ongoing Order</p>
                  <p className="text-xs font-black text-orange-600">15 mins</p>
                  <p className="text-[8px] font-semibold text-gray-400">Estimated delivery</p>
                </div>

                {/* Floating Card 2: Order Confirmed (Right) */}
                <div className="absolute right-2 sm:right-5 top-10 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-white/40 z-30 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900">Order Confirmed</p>
                    <p className="text-[8px] font-bold text-gray-400">Live GPS Active</p>
                  </div>
                </div>

              </div>

              {/* Title & Description */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
                Seamless ordering & delivery process
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mb-6">
                Turn-by-turn navigation, flexible shift schedules, and transparent pay structure designed for total earning efficiency.
              </p>

              {/* Checkbox Benefits */}
              <ul className="space-y-3 mb-8">
                {[
                  'Flexible work hours — choose your schedule',
                  'Live navigation & turn-by-turn tracking',
                  'Keep 100% of all customer tips',
                  'Weekly payouts directly to bank or wallet',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-700">
                    <CheckCircle2 size={18} className="text-[#15462D] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Link
              href="https://foodiego-mu.vercel.app/auth/register/rider"
              className="inline-flex items-center justify-center gap-2 bg-[#F6A429] hover:bg-[#e09320] text-slate-950 font-extrabold text-sm py-4 px-6 rounded-2xl transition-all duration-200 shadow-sm"
            >
              <span>Apply to Ride With Us</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}