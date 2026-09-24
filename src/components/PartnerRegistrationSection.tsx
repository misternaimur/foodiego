'use client';

import React from 'react';
import Link from 'next/link';
import { Store, Bike, ArrowRight, CheckCircle2, ShieldCheck, Zap, DollarSign } from 'lucide-react';

export default function PartnerRegistrationSection() {
  return (
    <section className="bg-[#FAF7EE] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-[#15462D]/10 text-[#15462D] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Partner With FoodieGo
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Grow Your Business or Earn On Your Schedule
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium mt-2">
            Join thousands of restaurants and delivery riders who trust FoodieGo to power their earnings.
          </p>
        </div>

        {/* Two Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Restaurant / Vendor Card */}
          <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div>
              {/* Card Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#15462D]/10 text-[#15462D] flex items-center justify-center font-bold">
                  <Store size={24} />
                </div>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  For Business
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-[#15462D] transition-colors">
                Register Your Restaurant
              </h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                Expand your reach and serve thousands of hungry customers nearby. Gain access to full order management, sales analytics, and automated delivery dispatch.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {[
                  'Effortless order & menu management',
                  'Real-time sales analytics & reporting',
                  'Instant delivery dispatch network',
                  'Upfront weekly payout processing',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-700">
                    <CheckCircle2 size={18} className="text-[#15462D] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Link */}
            <Link
              href="https://foodiego-mu.vercel.app/auth/register/restaurant"
              className="inline-flex items-center justify-center gap-2 bg-[#15462D] hover:bg-[#103723] text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span>Become a Restaurant Partner</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Rider Card */}
          <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div>
              {/* Card Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Bike size={24} />
                </div>
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
                  Flexible Work
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-[#15462D] transition-colors">
                Become a FoodieGo Rider
              </h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                Drive, deliver, and earn on your own timeline. Enjoy competitive payouts per trip, flexible shift choices, and keeper of 100% of customer tips.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {[
                  'Flexible hours — work when you want',
                  'Competitive pay + 100% of your tips',
                  'Live navigation & route optimization',
                  'Accident protection & support coverage',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-700">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Link */}
            <Link
              href="https://foodiego-mu.vercel.app/auth/register/rider"
              className="inline-flex items-center justify-center gap-2 bg-[#F6A429] hover:bg-[#e09320] text-slate-950 font-extrabold text-sm py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
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