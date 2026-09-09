'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  UtensilsCrossed,
  Sparkles,
  BarChart3,
  Settings,
  Search,
  Bell,
  X,
  Menu,
  User,
  HelpCircle,
  LayoutDashboard,
  CreditCard,
  Truck,
  Star,
  Ticket,
  LogOut,
} from 'lucide-react';
import SupportTicketsPage from './SupportTicketsPage';
import VendorDashboardHome from './VendorDashboardHome';
import OrdersDashboard from './OrdersDashboard';
import MenuPortfolio from './MenuPortfolio';
import { motion, AnimatePresence } from 'framer-motion';

type DashboardTab = 'Dashboard' | 'Orders' | 'Menu Management' | 'Sales & Analytics' | 'Payments & Earnings' | 'Delivery Management' | 'Reviews & Ratings' | 'Support Tickets' | 'Analytics' | 'AI Food Studio' | 'Review';

export default function RestaurantDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<DashboardTab>('Menu Management');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { name: 'Orders', icon: ShoppingBag, href: '#' },
    { name: 'Menu Management', icon: UtensilsCrossed, href: '#' },
    { name: 'AI Food Studio', icon: Sparkles, href: '#' },
    { name: 'Sales & Analytics', icon: BarChart3, href: '#' },
    { name: 'Payments & Earnings', icon: CreditCard, href: '#' },
    { name: 'Delivery Management', icon: Truck, href: '#' },
    { name: 'Reviews & Ratings', icon: Star, href: '#' },
    { name: 'Support Tickets', icon: Ticket, href: '#' },
  ];

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 flex font-sans">

      {/* -------------------- SIDEBAR (LEFT) -------------------- */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 shrink-0 sticky top-0 h-screen">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#00A36C] flex items-center justify-center text-white font-bold text-lg shrink-0">
              F
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#00A36C]">
                FoodieGo
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                Vendor Admin
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <button
                key={link.name}
                onClick={() => setActiveTab(link.name as DashboardTab)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#ecfdf5] text-[#00A36C] border-l-4 border-[#00A36C] pl-3'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <link.icon size={18} className={isActive ? 'text-[#00A36C]' : 'text-gray-400'} />
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto">
          <div className="border-t border-gray-100 mx-4"></div>
          <nav className="p-4 space-y-1.5">
            <Link
              href="/vendor/merchant-profile"
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                pathname === '/vendor/merchant-profile'
                  ? 'bg-[#ecfdf5] text-[#00A36C] border-l-4 border-[#00A36C] pl-3'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <User size={18} className={pathname === '/vendor/merchant-profile' ? 'text-[#00A36C]' : 'text-gray-400'} />
              <span>Restaurant Profile</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Bell size={18} className="text-gray-400" />
              <span>Notifications</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Settings size={18} className="text-gray-400" />
              <span>Settings</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut size={18} className="text-red-400" />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Mobile Drawer (Sidebar) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col border-r border-gray-200 lg:hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#00A36C] flex items-center justify-center text-white font-bold text-lg shrink-0">
                    F
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-[#00A36C]">
                      FoodieGo
                    </h1>
                    <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                      Vendor Admin
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {navLinks.map((link) => {
                  const isActive = activeTab === link.name;
                  return (
                    <button
                      key={link.name}
                      onClick={() => {
                        setActiveTab(link.name as DashboardTab);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#ecfdf5] text-[#00A36C] border-l-4 border-[#00A36C] pl-3'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <link.icon size={18} className={isActive ? 'text-[#00A36C]' : 'text-gray-400'} />
                      <span>{link.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Merchant Section */}
              <div className="px-6 pb-1 pt-1">
                <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Merchant
                </p>
              </div>
              <nav className="px-6 space-y-1">
                <Link
                  href="/vendor/merchant-profile"
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    pathname === '/vendor/merchant-profile'
                      ? 'bg-[#ecfdf5] text-[#00A36C] border-l-4 border-[#00A36C] pl-3'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <User size={18} className={pathname === '/vendor/merchant-profile' ? 'text-[#00A36C]' : 'text-gray-400'} />
                  <span>Merchant Profile</span>
                </Link>
                <Link
                  href="/vendor/create"
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    pathname === '/vendor/create'
                      ? 'bg-[#ecfdf5] text-[#00A36C] border-l-4 border-[#00A36C] pl-3'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Sparkles
                    size={18}
                    className={
                      pathname === '/vendor/create' ? 'text-[#00A36C]' : 'text-gray-400'
                    }
                  />
                  <span>Create Menu Item</span>
                </Link>
              </nav>

              {/* Bottom Links */}
              <div className="p-4 border-t border-gray-100 space-y-1">
                <Link
                  href="#"
                  className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Settings size={18} className="text-gray-400" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <HelpCircle size={18} className="text-gray-400" />
                  <span>Support</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* -------------------- MAIN AREA -------------------- */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* -------------------- TOP HEADER -------------------- */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Hamburger (Mobile/Tablet) */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-xl bg-gray-50 border border-gray-200 lg:hidden flex items-center justify-center"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="relative max-w-md w-full flex-1 md:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 focus:border-[#b93815] focus:bg-white transition-all"
            />
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Horizontal Nav Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
              <Link
                href="#"
                onClick={() => setActiveTab('Orders')}
                className={`py-2 transition-colors ${activeTab === 'Orders' ? 'text-[#b93815]' : 'hover:text-gray-900'}`}
              >
                Orders
              </Link>
              <Link
                href="#"
                onClick={() => setActiveTab('Menu Management')}
                className={`relative py-2 transition-colors ${activeTab === 'Menu Management' ? 'text-[#b93815]' : 'hover:text-gray-900'}`}
              >
                Menu Management
                {activeTab === 'Menu Management' && (
                  <span className="absolute bottom-[-10px] left-0 w-full h-0.5 bg-[#b93815] rounded-full" />
                )}
              </Link>
              <Link
                href="#"
                onClick={() => setActiveTab('Analytics')}
                className={`py-2 transition-colors ${activeTab === 'Analytics' ? 'text-[#b93815]' : 'hover:text-gray-900'}`}
              >
                Analytics
              </Link>
            </nav>

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </button>

            {/* User Profile Avatar */}
            <div className="relative group cursor-pointer" onClick={() => router.push('/')}>
              <div className="h-10 w-10 rounded-full border-2 border-white ring-2 ring-gray-100 overflow-hidden relative shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=120"
                  alt="Merchant Chef Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </header>

        {/* -------------------- MAIN CONTENT -------------------- */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl w-full mx-auto">
          {activeTab === 'Dashboard' ? (
            <VendorDashboardHome />
          ) : activeTab === 'Orders' ? (
            <OrdersDashboard />
          ) : activeTab === 'Menu Management' ? (
            <MenuPortfolio />
          ) : activeTab === 'Support Tickets' ? (
            <SupportTicketsPage />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <BarChart3 size={48} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTab}</h2>
              <p className="text-gray-500 text-center max-w-md">
                This section is under development. You can build out the {activeTab} page here.
              </p>
            </div>
          )}
        </main>
      </div>
      </div>
    </QueryClientProvider>
  );
}
