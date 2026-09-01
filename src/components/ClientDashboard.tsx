'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  UtensilsCrossed,
  Sparkles,
  Pencil,
  Star,
  ShoppingBag,
  BadgeCheck,
  Store,
  LayoutDashboard,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import CreateMenuItem from '@/components/CreateMenuItem';
import { useApp } from '@/context/AppContext';

interface ClientDashboardProps {
  name?: string;
  role?: string;
  email?: string;
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'create', label: 'Create Menu Item', icon: Sparkles },
];

const infoFields = [
  { icon: Store, label: 'Business Name', value: 'Truffle House Kitchen' },
  { icon: Mail, label: 'Email', value: 'hello@trufflehouse.co' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 019-2834' },
  { icon: MapPin, label: 'Address', value: '128 Savor Avenue, Foodiego City' },
  { icon: UtensilsCrossed, label: 'Cuisine Type', value: 'Gourmet Burgers & Sides' },
  { icon: BadgeCheck, label: 'Member Since', value: 'March 2024' },
];

const stats = [
  { icon: UtensilsCrossed, label: 'Menu Items', value: '24', glow: 'shadow-[0_18px_40px_-12px_rgba(185,56,21,0.45)]' },
  { icon: ShoppingBag, label: 'Orders Today', value: '38', glow: 'shadow-[0_18px_40px_-12px_rgba(246,164,41,0.45)]' },
  { icon: Star, label: 'Avg. Rating', value: '4.8', glow: 'shadow-[0_18px_40px_-12px_rgba(21,70,45,0.45)]' },
];

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [6, -6]);
  const rotateY = useTransform(x, [-50, 50], [-6, 6]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ClientDashboard({
  name = 'Truffle House',
  role = 'restaurant',
  email,
}: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'create'>('profile');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logoutUser } = useApp();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf9f6] via-[#f4f1ea] to-[#fff7ec] font-sans">
      {/* ---------- Dashboard Top Bar (replaces global Navbar on this view) ---------- */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.08)]">
        <div className="w-full px-6 md:px-12 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#b93815] to-[#7a1d09] flex items-center justify-center text-white shadow-lg shadow-[#b93815]/40 border border-white/40">
                <LayoutDashboard size={18} />
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-900 leading-none">Dashboard</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Foodiego · {name}</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search menu, orders, customers..."
                className="w-full bg-white/70 text-sm text-gray-800 placeholder-gray-400 rounded-full pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b93815]/30 border border-white/60 focus:border-[#b93815]/40 shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-600 hover:text-[#b93815] bg-white/60 hover:bg-white rounded-full transition-colors border border-white/60 shadow-sm"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#F6A429] rounded-full ring-2 ring-white" />
            </motion.button>

            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:bg-white/70 px-2 py-1 rounded-full transition-colors border border-transparent hover:border-white/60"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#fff1ec] to-[#fbe2d8] overflow-hidden flex items-center justify-center border border-white/60 shadow-sm">
                  <span className="text-xs font-bold text-[#b93815]">
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <span className="hidden sm:inline-block max-w-[120px] truncate">{name}</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-gray-300/40 border border-white/60 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{email || user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); setActiveTab('profile'); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors text-left"
                    >
                      <User size={16} className="text-[#b93815]" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); setActiveTab('create'); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors text-left"
                    >
                      <Sparkles size={16} className="text-[#b93815]" />
                      <span>Create Menu Item</span>
                    </button>
                    <button
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors text-left"
                    >
                      <Settings size={16} className="text-[#b93815]" />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={async () => { setIsProfileMenuOpen(false); await handleLogout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                    >
                      <LogOut size={16} className="text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-6 md:px-12 py-8">
        <main className="flex-1 min-w-0">
          {/* ---------- Header Card (merged profile identity) ---------- */}
          <motion.div
            whileHover={{ scale: 1.005, y: -2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 overflow-hidden"
          >
            <div className="h-32 bg-gradient-to-br from-[#b93815] via-[#9a2c0f] to-[#5b1503] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(246,164,41,0.35),transparent_60%)]" />
            </div>
            <div className="px-6 sm:px-10 pb-8">
              <div className="-mt-14 flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="h-28 w-28 rounded-3xl border-[5px] border-white overflow-hidden bg-gray-100 shadow-2xl shadow-gray-400/40 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=200"
                    alt="Merchant avatar"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                      {name}
                    </h1>
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#fff1ec] to-[#fbe2d8] text-[#b93815] text-xs font-bold px-3 py-1 rounded-full border border-white/60 shadow-sm">
                      <BadgeCheck size={13} /> Foodiego Merchant
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Premium Dashboard ·{' '}
                    <span className="capitalize font-medium text-gray-700">{role}</span> account
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97, y: 2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  onClick={() => setActiveTab('profile')}
                  className="inline-flex items-center gap-2 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] hover:from-[#b93815] hover:to-[#7a1d09] text-white font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-[#b93815]/40 border border-white/20 border-b-[3px] border-b-[#5b1503] active:border-b active:shadow-md transition-all shrink-0"
                >
                  <Pencil size={15} />
                  Edit Profile
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ---------- Quick Stats ---------- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
            {stats.map((s) => (
              <TiltCard
                key={s.label}
                className={`bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 ${s.glow} p-6 flex items-center gap-4`}
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#fff1ec] to-[#fbe2d8] text-[#b93815] flex items-center justify-center shrink-0 shadow-inner border border-white/60">
                  <s.icon size={22} />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wide">{s.label}</p>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* ---------- Merchant Quick Actions ---------- */}
          <motion.section
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-10 mt-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#fff1ec] to-[#fbe2d8] text-[#b93815] flex items-center justify-center shrink-0 shadow-inner border border-white/60">
                <Store size={28} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Foodiego Merchant</h2>
                <p className="text-sm text-gray-500">Premium Dashboard</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97, y: 3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                onClick={() => setActiveTab('profile')}
                className={`inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] hover:from-[#b93815] hover:to-[#7a1d09] text-white font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-[#b93815]/40 border border-white/20 border-b-[4px] border-b-[#5b1503] active:border-b-0 active:translate-y-1 active:shadow-md transition-all ${
                  activeTab === 'profile' ? 'ring-2 ring-[#b93815] ring-offset-2' : ''
                }`}
              >
                <User size={16} />
                View Profile
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97, y: 3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <Link
                  href="/client/dashboard"
                  className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-b from-white to-gray-50 border border-white/60 border-b-[4px] border-b-gray-300 hover:border-b-[3px] hover:translate-y-[1px] text-gray-800 font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-gray-300/40 active:shadow-md transition-all ring-2 ring-[#b93815]/40"
                >
                  <LayoutDashboard size={16} />
                  Merchant Dashboard
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97, y: 3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                onClick={() => setActiveTab('create')}
                className={`inline-flex items-center justify-center gap-2 bg-gradient-to-b from-white to-gray-50 border border-white/60 border-b-[4px] border-b-gray-300 hover:border-b-[3px] hover:translate-y-[1px] text-gray-800 font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-gray-300/40 active:shadow-md transition-all ${
                  activeTab === 'create' ? 'ring-2 ring-[#b93815] ring-offset-2' : ''
                }`}
              >
                <Sparkles size={16} />
                Create Menu Item
              </motion.button>
            </div>
          </motion.section>

          {/* ---------- Tabs ---------- */}
          <div className="flex items-center gap-2 mt-10 border-b border-gray-200/70 overflow-x-auto">
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as 'profile' | 'create')}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-[#b93815] text-[#b93815]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <t.icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* ---------- Tab Content ---------- */}
          <div className="mt-6">
            {activeTab === 'profile' ? (
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-10"
              >
                <h2 className="text-xl font-extrabold text-gray-900 mb-6">Business Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                  {infoFields.map((f) => (
                    <div key={f.label} className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-500 flex items-center justify-center shrink-0 border border-white/60 shadow-inner">
                        <f.icon size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                          {f.label}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-sm text-gray-500">
                    Need to add a new dish? Jump straight to the AI assistant.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.97, y: 2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    onClick={() => setActiveTab('create')}
                    className="inline-flex items-center gap-2 bg-gradient-to-b from-[#fff1ec] to-[#fbe2d8] text-[#b93815] font-semibold py-3 px-5 rounded-2xl border border-white/60 border-b-[3px] border-b-[#f3c9ba] shadow-md shadow-orange-200/40 active:border-b active:shadow-sm transition-all"
                  >
                    <Sparkles size={15} />
                    Create Menu Item
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <CreateMenuItem />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}