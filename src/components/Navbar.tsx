'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, User, ShoppingBag, LayoutDashboard, Settings, LogOut, ChevronDown } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { logout } from '@/app/(public)/actions/auth';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  navItems?: NavItem[];
  cartCount?: number;
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  } | null;
  onSearch?: (query: string) => void;
  onLogout?: () => void; // Optional custom callback if needed elsewhere
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Food Discover', href: '/discover' },
  { label: 'Offers', href: '/offers' },
];

export const Navbar: React.FC<NavbarProps> = ({
  navItems = defaultNavItems,
  cartCount = 0,
  user = null,
  onSearch,
  onLogout,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [], );

  // Universal Logout Handler combining Firebase + Server Action + Routing
  const handleLogoutAction = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      await logout();
      if (onLogout) {
        onLogout();
      }
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      router.push('/auth'); // Redirect to login or home page after logout
      router.refresh();
    } catch (error) {
      console.error('Failed to log out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="text-2xl font-bold tracking-tight text-[#c83214]">
              Foodiego
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
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
                    <span className="absolute bottom-4 left-0 w-full h-0.5 bg-[#c83214] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* AI Assistant Special Styled Button */}
            <Link
              href="/ai-assistant"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                pathname === '/ai-assistant'
                  ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60'
              }`}
            >
              <Sparkles size={15} className="text-purple-600 animate-pulse" />
              <span>AI Assistant</span>
            </Link>
          </nav>
        </div>

        {/* Center Section: Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="hidden md:flex flex-1 max-w-sm mx-2 lg:mx-4"
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

        {/* Right Section: Actions & Conditional Profile / Order Now */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          <Link 
            href="/cart" 
            className="relative p-1.5 text-gray-700 hover:text-black transition-colors"
            aria-label="Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#c83214] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            /* Logged In: Profile with Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center relative">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="User Avatar" fill className="object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-gray-700">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline-block max-w-22.5 truncate">{user.name || 'Account'}</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email || 'user@example.com'}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} className="text-gray-500" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      href="/my-card"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ShoppingBag size={16} className="text-gray-500" />
                      <span>My Card</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-gray-500" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} className="text-gray-500" />
                      <span>Setting</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={handleLogoutAction}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
                    >
                      <LogOut size={16} className="text-red-500" />
                      <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not Logged In: Show Order Now CTA & Sign in */
            <div className="flex items-center gap-3">
              <Link 
                href="/auth/login" 
                className="text-sm font-medium text-gray-800 hover:text-[#c83214] transition-colors"
              >
                Sign in
              </Link>
              
              <Link
                href="/auth/register"
                className="hidden xl:inline-flex items-center justify-center text-sm font-semibold text-white bg-black hover:bg-gray-800 px-5 py-2.5 rounded-full transition-colors shadow-sm"
              >
                Order Now
              </Link>
            </div>
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

          {/* Mobile AI Assistant Link */}
          <Link
            href="/ai-assistant"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-base font-medium py-1.5 text-purple-700"
          >
            <Sparkles size={17} />
            <span>AI Assistant</span>
          </Link>

          {!user ? (
            <>
              <Link
                href="/auth/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 mt-2 text-sm font-semibold text-white bg-black rounded-xl shadow-sm"
              >
                Order Now
              </Link>

              <div className="pt-2 flex gap-3 border-t border-gray-200">
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-medium text-white bg-[#c83214] rounded-lg"
                >
                  Sign in / Sign up
                </Link>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-gray-200 space-y-1">
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-gray-700 font-medium">Profile</Link>
              <Link href="/my-card" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-gray-700 font-medium">My Card</Link>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-gray-700 font-medium">Dashboard</Link>
              <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-gray-700 font-medium">Setting</Link>
              <button 
                onClick={handleLogoutAction} 
                disabled={isLoggingOut}
                className="block w-full text-left py-2 text-sm text-red-600 font-medium disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};