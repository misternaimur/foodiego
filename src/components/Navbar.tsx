'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  navItems?: NavItem[];
  cartCount?: number;
  user?: {
    name?: string;
    avatarUrl?: string;
  } | null;
  onSearch?: (query: string) => void;
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Restaurants', href: '/restaurants' },
  { label: 'Offers', href: '/offers' },
  { label: 'Orders', href: '/Orders' },
  { label: 'Favorites', href: '/favorites' },
];

export const Navbar: React.FC<NavbarProps> = ({
  navItems = defaultNavItems,
  cartCount,
  user = null,
  onSearch,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Connect to the AppContext to get cart state
  const { cart } = useApp();

  // Calculate total items in cart (sum of all item quantities)
  const totalCartCount =
    cartCount ?? cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#faf9f6] border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="text-2xl font-bold tracking-tight text-[#c83214]">
              Foodiego
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-6 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#c83214]'
                      : 'text-[#4b5563] hover:text-[#111827]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-4 left-0 w-full h-[2px] bg-[#c83214] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center Section: Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4"
        >
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food or restaurants..."
              className="w-full bg-[#ebebeb] text-sm text-gray-800 placeholder-gray-500 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c83214]/30 focus:bg-white transition-all"
            />
          </div>
        </form>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-5 sm:gap-6 shrink-0">
          <Link 
            href="/cart" 
            className="relative p-1.5 text-gray-700 hover:text-black transition-colors"
            aria-label="Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            
            {/* Dynamic Badge for Total Cart Quantity */}
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#c83214] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </Link>

          {user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt="User Avatar" width={32} height={32} />
                ) : (
                  <span className="text-xs font-bold text-gray-600">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block">{user.name || 'Account'}</span>
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-[#c83214] transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Sign in</span>
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-gray-700 hover:text-black"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#f8f8f8] border-t border-gray-200 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="md:hidden pb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food or restaurants..."
              className="w-full bg-[#ebebeb] text-sm text-gray-800 placeholder-gray-500 rounded-full pl-4 pr-4 py-2 focus:outline-none"
            />
          </form>

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-base font-medium py-1.5 ${
                pathname === item.href ? 'text-[#c83214] font-semibold' : 'text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;