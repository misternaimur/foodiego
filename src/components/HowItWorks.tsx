'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Utensils, Bike } from 'lucide-react';

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const defaultSteps: HowItWorksStep[] = [
  {
    number: '01',
    title: 'Explore & Select Your Meal',
    description: 'Browse curated menus from top local restaurants and AI-recommended dishes tailored just for you.',
    icon: <Smartphone className="w-5 h-5 text-emerald-800" />,
  },
  {
    number: '02',
    title: 'Place Order Effortlessly',
    description: 'Customize your choices, add special instructions, and complete your order with quick, secure payment.',
    icon: <Utensils className="w-5 h-5 text-emerald-800" />,
  },
  {
    number: '03',
    title: 'Fast AI-Driven Delivery',
    description: 'Track your driver in real-time as our smart dispatching system ensures your food arrives hot and fresh.',
    icon: <Bike className="w-5 h-5 text-emerald-800" />,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF7EE] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Dark Card Container styled in Theme's Deep Forest Green */}
        <div className="relative overflow-hidden bg-[#113220] rounded-[2.5rem] p-8 sm:p-12 lg:p-16 text-center text-white shadow-xl">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto mb-14">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center justify-center bg-[#F6A429] text-gray-900 px-4 py-1 rounded-full mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest">
                EASY STEPS
              </span>
            </div>

            {/* Main Header */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              How it Works
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/70 font-normal leading-relaxed max-w-xl mx-auto">
              Getting your favorite meal delivered to your doorstep is fast, simple, and seamless.
            </p>
          </div>

          {/* 3 Steps Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {defaultSteps.map((step) => (
              <div
                key={step.number}
                className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-between text-center hover:border-emerald-500/30 transition-all duration-300"
              >
                <div>
                  {/* Icon Circle */}
                  <div className="w-12 h-12 rounded-full bg-[#FAF7EE] flex items-center justify-center mb-6 shadow-sm mx-auto">
                    {step.icon}
                  </div>

                  {/* Step Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Number Badge at Bottom */}
                <div className="mt-8">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#F6A429] text-gray-900 font-extrabold text-xs shadow-md">
                    {step.number}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Callout & Action Buttons */}
          <div className="relative z-10 flex flex-col items-center gap-5 pt-2">
            <p className="text-xs sm:text-sm font-semibold text-emerald-100/90 tracking-wide">
              Get <span className="text-[#F6A429] font-bold">50% off</span> on your first order! Grab it now.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/foods"
                className="inline-flex items-center justify-center text-xs font-extrabold tracking-wider text-gray-900 bg-[#F6A429] hover:bg-[#e0931f] uppercase px-7 py-3 rounded-full transition-colors shadow-md"
              >
                Order Online Now
              </Link>
              <Link
                href="/ai-assistant"
                className="inline-flex items-center justify-center text-xs font-extrabold tracking-wider text-white bg-white/10 hover:bg-white/20 uppercase px-7 py-3 rounded-full border border-white/20 transition-colors"
              >
                Try AI Assistant
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;