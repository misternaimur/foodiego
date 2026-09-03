'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Pencil, BadgeCheck, UtensilsCrossed, ShoppingBag, Star } from 'lucide-react';

export default function MerchantHero() {
  const [search, setSearch] = useState('');

  return (
    <div className="w-full bg-[#fbf9f5] font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      {/* TOP SEARCH HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full bg-white rounded-3xl shadow-md shadow-gray-200/60 border border-white/80 px-4 sm:px-6 py-3 flex items-center gap-3"
      >
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search orders, menu items, customers..."
            className="w-full bg-gray-50/60 text-sm text-gray-800 placeholder-gray-400 rounded-2xl pl-11 pr-4 py-2.5 border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-200 focus:bg-white transition-all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative p-2.5 rounded-2xl text-gray-600 hover:text-[#b93815] hover:bg-orange-50/60 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white" />
        </motion.button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-200 text-[#b93815] flex items-center justify-center font-extrabold text-sm border-2 border-white shadow-inner">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">abid</p>
            <p className="text-[10px] text-gray-400 font-medium">Merchant</p>
          </div>
        </div>
      </motion.div>

      {/* HERO BANNER + PROFILE CARD OVERLAY */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full rounded-[28px] overflow-hidden bg-gradient-to-r from-[#ea580c] to-[#9a3412] shadow-2xl shadow-orange-900/30 p-8 sm:p-10 lg:p-12 pb-32 sm:pb-36"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-yellow-300/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          <div className="relative flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 text-[#9a3412] text-[10px] font-extrabold tracking-widest shadow-sm">
              MERCHANT
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/40 text-white text-[10px] font-extrabold tracking-widest uppercase">
              PREMIUM DASHBOARD
            </span>
          </div>

          <h1 className="relative text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Welcome back, abid
          </h1>
          <p className="relative mt-2 text-white/85 text-sm sm:text-base max-w-2xl">
            Here&apos;s what&apos;s happening with your restaurant today.
          </p>
        </motion.div>

        {/* PROFILE CARD OVERLAY */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="relative -mt-24 sm:-mt-28 mx-4 sm:mx-8 lg:mx-12"
        >
          <div className="bg-[#fdfbf7] rounded-3xl shadow-xl shadow-gray-300/40 border border-white/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center shrink-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#9a3412]">A</span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-none">abid</h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-200">
                    <BadgeCheck size={12} />
                    Foodiego Merchant
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500 font-medium">
                  Premium Dashboard · Customer account
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96, y: 2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="inline-flex items-center justify-center gap-2 bg-[#c2410c] hover:bg-[#9a3412] text-white font-semibold text-sm py-2.5 px-5 rounded-2xl shadow-lg shadow-orange-900/30 border border-white/20 border-b-4 border-b-[#7c2d12] active:border-b-0 active:translate-y-1 active:shadow-md transition-all shrink-0"
            >
              <Pencil size={15} />
              Edit Profile
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* METRICS GRID */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { icon: UtensilsCrossed, value: '24', label: 'MENU ITEMS' },
          { icon: ShoppingBag, value: '38', label: 'ORDERS TODAY' },
          { icon: Star, value: '4.8', label: 'AVG. RATING' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 + i * 0.08, ease: 'easeOut' }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="bg-white rounded-3xl shadow-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 p-6 flex items-center gap-4"
          >
            <div className="h-14 w-14 rounded-2xl bg-orange-50 text-[#c2410c] flex items-center justify-center shadow-inner border border-white">
              <m.icon size={26} />
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-none">{m.value}</p>
              <p className="mt-2 text-[11px] font-extrabold text-gray-400 tracking-widest">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
