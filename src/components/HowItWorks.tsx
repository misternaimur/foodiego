'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    title: 'Download App & create a free account',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry Ipsum has.',
    icon: <Smartphone className="w-5 h-5 text-emerald-500" />,
  },
  {
    number: '02',
    title: 'Place orders at your preferred eatery',
    description: 'Dummy text of the printing and typesetting industry lorem Ipsum has been the industrys.',
    icon: <Utensils className="w-5 h-5 text-emerald-500" />,
  },
  {
    number: '03',
    title: 'Get it delivered directly to your home, effortlessly',
    description: 'Printing and typesetting industry lorem Ipsum has been the industrys standard dummy.',
    icon: <Bike className="w-5 h-5 text-emerald-500" />,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF7EE] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Dark Card Container */}
        <div className="relative bg-[#111111] rounded-[2.5rem] pt-14 pb-2 px-6 sm:px-12 lg:px-16 text-center text-white shadow-2xl border border-white/10">
          
          {/* Ambient Background Green Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-1/4 -left-32 w-80 h-80 bg-emerald-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-emerald-700/15 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto mb-12">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center justify-center bg-emerald-600 text-white px-4 py-1.5 rounded-full mb-4 shadow-sm">
              <span className="text-[11px] font-extrabold uppercase tracking-widest">
                EASY STEPS
              </span>
            </div>

            {/* Main Header */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
              How it Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-normal leading-relaxed max-w-md mx-auto">
              Lorem Ipsum is simply dummy text of the printing indus orem Ipsum has been the industrys standard dummy text ever since.
            </p>
          </div>

          {/* 3 Steps Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {defaultSteps.map((step) => (
              <div
                key={step.number}
                className="relative bg-[#1E1E1E]/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-between text-center shadow-lg transition-all duration-300 hover:border-emerald-500/40"
              >
                <div>
                  {/* Icon Circle */}
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6 shadow-inner mx-auto border border-white/5">
                    {step.icon}
                  </div>

                  {/* Step Title & Description */}
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Number Badge at Bottom - Green Accent */}
                <div className="mt-8">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-gray-950 font-black text-xs shadow-md">
                    {step.number}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Callout & Store Buttons */}
          <div className="relative z-10 flex flex-col items-center gap-4 pt-2 mb-16">
            <p className="text-xs sm:text-sm font-medium text-gray-300">
              Get <span className="text-emerald-400 font-bold">50% off</span> on your first order <span className="text-emerald-500 font-bold">Grab it now.</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Google Play Button */}
       <Link
    href="#"
    className="transition-transform duration-200 hover:scale-105"
  >
    <div className="relative w-33.75 h-10.5">
      <Image 
        src="/assets/icon/Google_Play_Store_badge_EN.svg" 
        alt="Get it on Google Play" 
        fill
        sizes="135px"
        className="object-contain"
      />
    </div>
  </Link>

  {/* App Store Button */}
  <Link
    href="#"
    className="transition-transform duration-200 hover:scale-105"
  >
    <div className="relative w-33.75 h-10.5">
      <Image 
        src="/assets/icon/Download_on_the_App_Store_Badge.svg" 
        alt="Download on the App Store" 
        fill
        sizes="135px"
        className="object-contain"
      />
    </div>
  </Link>
</div>
          </div>

          {/* 3D Angled Mobile Mockup overlapping container edge */}
          <div className="relative z-20 flex justify-center -mb-20 sm:-mb-24 lg:-mb-28 px-4">
            <div className="relative w-full max-w-8xl transform rotate-x-12 hover:rotate-1 transition-transform duration-500 drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]">
              <Image 
                src="/assets/mobile.png" 
                alt="Mobile app preview mockup" 
                width={800}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;