'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import CreateMenuItem from '@/components/CreateMenuItem';

interface MerchantProfileProps {
  name?: string;
  role?: string;
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
  { icon: UtensilsCrossed, label: 'Menu Items', value: '24' },
  { icon: ShoppingBag, label: 'Orders Today', value: '38' },
  { icon: Star, label: 'Avg. Rating', value: '4.8' },
];

export default function MerchantProfile({
  name = 'Truffle House',
  role = 'restaurant',
}: MerchantProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'create'>('profile');
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans">
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* ---------- Merchant Header Card ---------- */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-[#b93815] to-[#9a2c0f]" />
          <div className="px-6 sm:px-8 pb-6">
            <div className="-mt-12 flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="h-24 w-24 rounded-2xl border-4 border-white overflow-hidden bg-gray-100 shadow-md relative">
                <Image
                  src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=200"
                  alt="Merchant avatar"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    {name}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-[#fff1ec] text-[#b93815] text-xs font-bold px-2.5 py-1 rounded-full">
                    <BadgeCheck size={13} /> Foodiego Merchant
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Premium Dashboard ·{" "}
                  <span className="capitalize font-medium text-gray-700">{role}</span> account
                </p>
              </div>

              <button className="inline-flex items-center gap-2 bg-[#b93815] hover:bg-[#9a2c0f] text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all shrink-0">
                <Pencil size={15} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Quick Stats ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex items-center gap-4"
            >
              <div className="h-11 w-11 rounded-xl bg-[#fff1ec] text-[#b93815] flex items-center justify-center shrink-0">
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- Restaurant / Merchant Section ---------- */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#fff1ec] text-[#b93815] flex items-center justify-center shrink-0">
              <Store size={26} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Foodiego Merchant</h2>
              <p className="text-sm text-gray-500">Premium Dashboard</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/account"
              className={`inline-flex items-center justify-center gap-2 bg-[#b93815] hover:bg-[#9a2c0f] text-white font-semibold py-2.5 px-4 rounded-xl transition-all ${
                pathname === '/account' ? 'ring-2 ring-[#b93815] ring-offset-2' : ''
              }`}
            >
              <User size={16} />
              View Profile
            </Link>
            <Link
              href="/vendor"
              className={`inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-all ${
                pathname === '/vendor' ? 'ring-2 ring-[#b93815] ring-offset-2' : ''
              }`}
            >
              <LayoutDashboard size={16} />
              Merchant Dashboard
            </Link>
            <button
              onClick={() => setActiveTab('create')}
              className={`inline-flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-all ${
                activeTab === 'create' ? 'ring-2 ring-[#b93815] ring-offset-2' : ''
              }`}
            >
              <Sparkles size={16} />
              Create Menu Item
            </button>
          </div>
        </section>

        {/* ---------- Tabs ---------- */}
        <div className="flex items-center gap-2 mt-8 border-b border-gray-200">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as 'profile' | 'create')}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
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
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Business Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {infoFields.map((f) => (
                  <div key={f.label} className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                      <f.icon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        {f.label}
                      </p>
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {f.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Need to add a new dish? Jump straight to the AI assistant.
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="inline-flex items-center gap-2 bg-[#fff1ec] text-[#b93815] hover:bg-[#fbe2d8] font-semibold py-2.5 px-4 rounded-xl border border-[#f3c9ba] transition-all"
                >
                  <Sparkles size={15} />
                  Create Menu Item
                </button>
              </div>
            </div>
          ) : (
            <CreateMenuItem />
          )}
        </div>
      </main>
    </div>
  );
}
