'use client';

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, User, ShoppingBag, LayoutDashboard, Settings, LogOut, ChevronDown, UtensilsCrossed, Bike } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import LogoGreen from './LogoGreen';
import CartDrawer from '@/components/CartDrawer';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  navItems?: NavItem[];
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
  } | null;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Discover Foods', href: '/restaurants' },
  { label: 'Offers', href: '/offers' },
];

export const Navbar: React.FC<NavbarProps> = ({
  navItems = defaultNavItems,
  user: propUser = null,
  onSearch,
  onLogout,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { cart, user: contextUser, logoutUser } = useApp();
  const user = propUser ?? contextUser;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const role = propUser?.role;
  const dashboardHref =
    role === 'admin'
      ? '/admin'
      : role === 'vendor'
      ? '/vendor'
      : role === 'rider'
      ? '/rider'
      : '/client/dashboard';

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    await logoutUser();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Conditionally hide the Navbar on admin, vendor, rider, or client dashboard paths
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/vendor') ||
    pathname?.startsWith('/rider') ||
    pathname?.startsWith('/client/dashboard')
  ) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Restaurant / Rider Partner Sign-up strip — hidden once any role is logged in */}
      {!user && (
        <div className="w-full bg-[#15462D] text-white/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3 text-xs">
            <Link
              href="/auth/register/restaurant"
              className="inline-flex items-center gap-1.5 font-bold border border-white/40 rounded-full px-3.5 py-1.5 hover:bg-white hover:text-[#15462D] hover:border-white transition-colors"
            >
              <UtensilsCrossed size={13} />
              <span>Create a restaurant account</span>
            </Link>
            <Link
              href="/auth/register/rider"
              className="inline-flex items-center gap-1.5 font-bold border border-white/40 rounded-full px-3.5 py-1.5 hover:bg-white hover:text-[#15462D] hover:border-white transition-colors"
            >
              <Bike size={13} />
              <span>Create a rider account</span>
            </Link>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 w-full bg-[#FAF7EE] border-b border-[#E8E2D5]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Left Section: Logo & Nav Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            <div>
              <LogoGreen />
            </div>
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-6 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-[#15462D]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-4 left-0 w-full h-0.5 bg-[#15462D] rounded-full" />
                    )}
                  </Link>
                );
              })}

              {/* AI Assistant Button */}
              <Link
                href="/ai-assistant"
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  pathname === '/ai-assistant'
                    ? 'bg-[#15462D] text-white shadow-sm'
                    : 'bg-emerald-100/60 text-[#15462D] hover:bg-emerald-100 border border-emerald-200/50'
                }`}
              >
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
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
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food or restaurants..."
                className="w-full bg-[#EFEBE0] text-sm text-gray-800 placeholder-gray-500 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#15462D]/20 focus:bg-white transition-all border border-transparent focus:border-[#15462D]/30"
              />
            </div>
          </form>

          {/* Right Section: Actions & Conditional Profile / Order Now */}
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            {/* Cart Trigger Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-[#15462D] transition-colors bg-white/60 hover:bg-white rounded-full border border-gray-200/50 shadow-xs cursor-pointer"
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F6A429] text-gray-900 text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              /* Logged In Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-semibold text-[#15462D] bg-white border border-[#E8E2D5] hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors focus:outline-none shadow-xs cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center relative border border-emerald-200">
                    {user.avatarUrl ? (
                      <Image src={user.avatarUrl} alt="User Avatar" fill className="object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-[#15462D]">
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
                        href="/account"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors"
                      >
                        <User size={16} className="text-[#15462D]" />
                        <span>Profile</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsCartOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors text-left"
                      >
                        <ShoppingBag size={16} className="text-[#15462D]" />
                        <span>My Cart</span>
                      </button>

                      <Link
                        href={dashboardHref}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-[#15462D]" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/account"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors"
                      >
                        <Settings size={16} className="text-[#15462D]" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={async () => {
                          setIsDropdownOpen(false);
                          await handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium cursor-pointer"
                      >
                        <LogOut size={16} className="text-red-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not Logged In Actions */
              <div className="flex items-center gap-3">
                <Link 
                  href="/auth/login" 
                  className="text-sm font-bold text-gray-700 hover:text-[#15462D] transition-colors px-2 py-1"
                >
                  Sign in
                </Link>
                
                <Link
                  href="/auth/register"
                  className="hidden xl:inline-flex items-center justify-center text-xs font-extrabold tracking-wider text-gray-900 bg-[#F6A429] hover:bg-[#e0931f] uppercase px-5 py-2.5 rounded-full transition-colors shadow-xs"
                >
                  Order Now
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#15462D] bg-white/60 rounded-full border border-gray-200/50"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="lg:hidden bg-[#FAF7EE] border-t border-[#E8E2D5] px-4 pt-3 pb-6 space-y-3">
            <form onSubmit={handleSearchSubmit} className="md:hidden pb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food or restaurants..."
                className="w-full bg-[#EFEBE0] text-sm text-gray-800 placeholder-gray-500 rounded-full pl-4 pr-4 py-2 focus:outline-none border border-transparent focus:border-[#15462D]/30"
              />
            </form>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-base font-semibold py-1.5 ${
                  pathname === item.href ? 'text-[#15462D]' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/ai-assistant"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 text-base font-semibold py-1.5 text-[#15462D]"
            >
              <Sparkles size={17} className="text-amber-500" />
              <span>AI Assistant</span>
            </Link>

            {!user ? (
              <>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center w-full py-2.5 mt-2 text-xs font-bold uppercase tracking-wider text-gray-900 bg-[#F6A429] rounded-full shadow-xs"
                >
                  Order Now
                </Link>

                <div className="pt-2 flex gap-3 border-[#E8E2D5]">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-sm font-semibold text-white bg-[#15462D] rounded-full"
                  >
                    Sign in 
                  </Link>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-[#E8E2D5] space-y-1">
                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-gray-700 font-medium">Profile</Link>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); setIsCartOpen(true); }} 
                  className="block w-full text-left py-2 text-sm text-gray-700 font-medium"
                >
                  My Cart
                </button>
                <Link href={dashboardHref} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-gray-700 font-medium">Dashboard</Link>
                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-gray-700 font-medium">Settings</Link>
                <button 
                  onClick={async () => { setIsMobileMenuOpen(false); await handleLogout(); }} 
                  className="block w-full text-left py-2 text-sm text-red-600 font-medium cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Slide-over Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;