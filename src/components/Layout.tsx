'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  ChevronLeft,
  Menu,
  X,
  User,
  LogOut,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Bell,
} from 'lucide-react';

const sidebarNav = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Payments & Earnings', href: '/vendor/payments', icon: CreditCard },
  { label: 'Orders', href: '/orders', icon: ShoppingBag },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
  } | null;
  onLogout?: () => void;
}

function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .filter((s) => !s.startsWith('(') && !s.endsWith(')'));

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/[-_]/g, ' ');
    return { label, href };
  });

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
      <Link href="/" className="hover:text-gray-900 transition-colors text-gray-400">
        Home
      </Link>
      {crumbs.map((c, i) => (
        <React.Fragment key={c.href}>
          <ChevronRight size={14} className="text-gray-300" />
          {i === crumbs.length - 1 ? (
            <span className="font-semibold text-gray-900">{c.label}</span>
          ) : (
            <Link href={c.href} className="hover:text-gray-900 transition-colors">
              {c.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default function Layout({ children, user, onLogout }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const isHomepage = pathname === '/' || pathname === '';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7EE] font-sans">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E8E2D5]/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Back button + Breadcrumb */}
          <div className="flex items-center gap-4">
            {!isHomepage && (
              <button
                onClick={handleBack}
                className="inline-flex items-center justify-center h-8 w-8 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <Breadcrumb />
          </div>

          {/* Center: Quick Home link (mobile) */}
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#15462D] hover:text-[#b93815] transition-colors"
          >
            <Home size={15} />
            Home
          </Link>

          {/* Right: Actions & User Profile */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full" />
            </button>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-[#15462D] bg-white border border-[#E8E2D5] hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors focus:outline-none shadow-xs"
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 overflow-hidden flex items-center justify-center relative border border-emerald-200">
                  {user?.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="User Avatar" width={28} height={28} className="object-cover rounded-full" />
                  ) : (
                    <span className="text-xs font-bold text-[#15462D]">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">
                  {user?.name || 'Account'}
                </span>
                <motion.span animate={{ rotate: userDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
                  <ChevronDown size={14} className="text-gray-500" />
                </motion.span>
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-3"
                  >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/cart"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors"
                    >
                      <ShoppingBag size={16} className="text-[#15462D]" />
                      <span>My Cart</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-[#15462D]" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors"
                    >
                      <User size={16} className="text-[#15462D]" />
                      <span>Account</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#FAF7EE] transition-colors"
                    >
                      <Settings size={16} className="text-[#15462D]" />
                      <span>Settings</span>
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        if (onLogout) await onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                    >
                      <LogOut size={16} className="text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Persistent Left Sidebar */}
        <aside
          ref={mobileSidebarRef}
          className={`fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 lg:block transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
            w-64 sm:w-72 bg-white border-r border-[#E8E2D5]/70 shadow-sm flex flex-col`}
        >
          {/* Sidebar Header with Collapse Toggle */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#E8E2D5]/70 shrink-0">
            {!sidebarCollapsed && (
              <span className="text-sm font-bold text-[#15462D]">Merchant Portal</span>
            )}
            <div className="flex items-center gap-1">
              {/* Mobile close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X size={16} />
              </button>
              {/* Desktop collapse toggle */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:inline-flex items-center justify-center p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
          </div>

          {/* Sidebar Nav Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1.5 px-2">
              {sidebarNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                        isActive
                          ? 'bg-[#15462D] text-white shadow-md'
                          : 'text-gray-700 hover:text-[#15462D] hover:bg-[#FAF7EE]'
                      }`}
                    >
                      <item.icon
                        size={18}
                        className={
                          isActive
                            ? 'text-white'
                            : 'text-[#15462D] group-hover:text-[#15462D]'
                        }
                      />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-[#E8E2D5]/70">
              <button
                onClick={async () => {
                  if (onLogout) await onLogout();
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
