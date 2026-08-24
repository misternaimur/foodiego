'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Sparkles,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Camera,
  Plus,
  X,
  Check,
  Loader2,
  Star,
  Leaf,
  User,
  Image as ImageIcon,
} from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const topNav: NavItem[] = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Orders', icon: ShoppingBag },
  { name: 'Menu Management', icon: UtensilsCrossed },
  { name: 'AI Food Studio', icon: Sparkles },
  { name: 'Analytics', icon: BarChart3 },
];

const bottomNav: NavItem[] = [
  { name: 'Settings', icon: Settings },
  { name: 'Support', icon: HelpCircle },
];

const steps = ['Dish Info', 'Images & Tags', 'Publish'];

const allTags = ['Appetizer', 'Spicy', 'Signature', 'Gluten-Free', 'Seafood'];

const gallerySeed = [
  {
    id: 'burger',
    src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
    alt: 'Truffle Smashburger',
  },
  {
    id: 'tacos',
    src: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=400',
    alt: 'Street Tacos',
  },
  {
    id: 'pasta',
    src: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400',
    alt: 'Creamy Pasta',
  },
  {
    id: 'cake',
    src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400',
    alt: 'Berry Cake',
  },
];

export default function CreateMenuItem() {
  const [activeTab, setActiveTab] = useState('AI Food Studio');
  const pathname = usePathname();

  // Dish Details
  const [dishName, setDishName] = useState('Truffle Smashburger');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Any gory...');

  // AI Analysis
  const [analyzing, setAnalyzing] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Signature', 'Spicy']);

  // Customization
  const [bestSeller, setBestSeller] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [keywords, setKeywords] = useState('');

  // Gallery
  const [gallery, setGallery] = useState(gallerySeed);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeFromGallery = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* -------------------- SIDEBAR (LEFT) -------------------- */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 shrink-0 sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-100">
          <span className="block text-2xl font-bold tracking-tight text-[#b93815]">
            Foodiego Merchant
          </span>
          <span className="block text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">
            Premium Dashboard
          </span>
        </div>

        {/* Top Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {topNav.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <button
                key={link.name}
                onClick={() => setActiveTab(link.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <link.icon
                  size={18}
                  className={isActive ? 'text-[#b93815]' : 'text-gray-400'}
                />
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Merchant Section */}
        <div className="px-4 pb-1 pt-2">
          <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Merchant
          </p>
        </div>
        <nav className="px-4 space-y-1.5 pb-2">
          <Link
            href="/account"
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              pathname === '/account'
                ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <User
              size={18}
              className={pathname === '/account' ? 'text-[#b93815]' : 'text-gray-400'}
            />
            <span>Merchant Profile</span>
          </Link>
          <Link
            href="/dashboard/restaurant/create"
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              pathname === '/dashboard/restaurant/create'
                ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Sparkles
              size={18}
              className={
                pathname === '/dashboard/restaurant/create'
                  ? 'text-[#b93815]'
                  : 'text-gray-400'
              }
            />
            <span>Create Menu Item</span>
          </Link>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          {bottomNav.map((link) => (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === link.name
                  ? 'bg-[#fff1ec] text-[#b93815]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon
                size={18}
                className={activeTab === link.name ? 'text-[#b93815]' : 'text-gray-400'}
              />
              <span>{link.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* -------------------- MAIN AREA (RIGHT) -------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full flex-1 md:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 focus:border-[#b93815] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <div className="h-10 w-10 rounded-full border-2 border-white ring-2 ring-gray-100 overflow-hidden relative shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=120"
                alt="Merchant Profile"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-5xl w-full mx-auto">
          {/* Title + Description */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Create New Menu Item with AI Assistant
            </h1>
            <p className="mt-2 text-base text-gray-500 max-w-2xl leading-relaxed">
              Tell us about your dish, or start by uploading an image. Our AI will help
              you with descriptions, tags, and optimization.
            </p>
          </div>

          {/* Steppers */}
          <div className="flex items-center gap-3 mb-10 flex-wrap">
            {steps.map((step, i) => {
              const isFirst = i === 0;
              return (
                <div key={step} className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      isFirst
                        ? 'bg-[#f5ecd9] text-[#9a2c0f]'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                        isFirst ? 'bg-[#b93815] text-white' : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="h-px w-6 bg-gray-300 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-8">
            {/* ---------------- DISH DETAILS ---------------- */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Dish Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your dish, ingredients, and story..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
                />
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 bg-[#fff1ec] text-[#b93815] hover:bg-[#fbe2d8] font-semibold py-2.5 px-4 rounded-xl border border-[#f3c9ba] transition-all"
                >
                  <Sparkles size={16} />
                  Generate description with AI
                </button>
              </div>

              <div className="mt-5 sm:max-w-xs">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-gray-700 focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all bg-white"
                >
                  <option>Any gory...</option>
                  <option>Burgers</option>
                  <option>Pizza</option>
                  <option>Drinks</option>
                  <option>Sides</option>
                </select>
              </div>
            </section>

            {/* ---------------- DISH IMAGES ---------------- */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Dish Images</h2>

              {/* Drop-zone with AI Analysis overlay */}
              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:border-[#b93815]/40 transition-colors p-10">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="bg-[#fff1ec] text-[#b93815] h-16 w-16 rounded-full flex items-center justify-center mb-4">
                    <Camera size={28} />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-[#b93815] text-white hover:bg-[#9a2c0f] font-bold py-3 px-5 rounded-xl shadow-sm transition-all"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                    Upload Food Images or Drag and Drop
                  </button>
                  <p className="mt-3 text-xs text-gray-400">
                    PNG, JPG up to 10MB each
                  </p>
                </div>

                {/* AI Image Analysis Overlay */}
                {analyzing && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center px-6">
                    <Loader2 size={32} className="text-[#b93815] animate-spin mb-3" />
                    <p className="text-sm font-semibold text-gray-700">
                      Analyzing... detecting tags...
                    </p>
                    <button
                      type="button"
                      onClick={() => setAnalyzing(false)}
                      className="mt-4 text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>

              {/* Suggested Tags */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Suggested tags</h3>
                <div className="flex flex-wrap gap-2.5">
                  {allTags.map((tag) => {
                    const checked = selectedTags.includes(tag);
                    return (
                      <label
                        key={tag}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium cursor-pointer border transition-all ${
                          checked
                            ? 'bg-[#fff1ec] text-[#b93815] border-[#f3c9ba]'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            checked ? 'bg-[#b93815] border-[#b93815]' : 'bg-white border-gray-300'
                          }`}
                        >
                          {checked && <Check size={12} className="text-white" strokeWidth={3} />}
                        </span>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checked}
                          onChange={() => toggleTag(tag)}
                        />
                        {tag}
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ---------------- MENU CUSTOMIZATION ---------------- */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Menu Customization</h2>

              <div className="space-y-4">
                {/* Best Seller Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star size={18} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      Is it a best seller?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBestSeller((v) => !v)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      bestSeller ? 'bg-[#b93815]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        bestSeller ? 'left-0.5 translate-x-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Vegetarian Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Leaf size={18} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      Is it vegetarian?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVegetarian((v) => !v)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      vegetarian ? 'bg-[#b93815]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        vegetarian ? 'left-0.5 translate-x-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Keywords */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Keywords
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. juicy, gourmet, comfort food"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* ---------------- RECENT UPLOADS GALLERY ---------------- */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Recently Uploaded</h2>
              {gallery.length === 0 ? (
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <ImageIcon size={16} /> No images uploaded yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {gallery.map((img) => (
                    <div
                      key={img.id}
                      className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-100"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeFromGallery(img.id)}
                        aria-label={`Remove ${img.alt}`}
                        className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>

        {/* ---------------- BOTTOM ACTION BAR ---------------- */}
        <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto py-4 flex items-center justify-end gap-3">
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#b93815] hover:bg-[#9a2c0f] rounded-xl shadow-sm hover:shadow transition-all"
            >
              Publish Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
