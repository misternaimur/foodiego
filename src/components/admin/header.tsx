"use client";

import React from 'react';
import { Bell, HelpCircle, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAdminMobileNav } from './AdminMobileNavContext';

interface AdminHeaderProps {
  adminName?: string;
}

// UPDATE (fake-data fix): the profile block below used to hardcode
// "Naimur" / "Super Admin" and a random Unsplash headshot for every admin
// account, regardless of who was actually logged in. It now shows the
// real signed-in admin's name (passed down from admin/layout.tsx's real
// session) and a plain initials avatar instead of a fabricated photo.
const AdminHeader = ({ adminName }: AdminHeaderProps) => {
  const pathname = usePathname();
  const { open: openMobileNav } = useAdminMobileNav();
  const displayName = adminName || "Admin";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('admin/users')) return 'Users Management';
    if (pathname.includes('/vendors')) return 'Vendors Management';
    if (pathname.includes('/finance')) return 'Finance Management';
    if (pathname.includes('/operations')) return 'Operations Management';
    if (pathname.includes('/communication')) return 'Communication Center';
    if (pathname.includes('/business')) return 'Business Analytics';
    if (pathname.includes('/settings')) return 'System Settings';
    return 'Dashboard';
  };
  return (
    <header className="h-20 bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 flex items-center justify-between gap-3 sticky top-0 z-40 shadow-sm">

      {/* UPDATE (responsive fix): opens AdminSidebar's new mobile drawer —
          previously there was no way at all to reach the sidebar's nav
          below the md breakpoint. */}
      <button
        type="button"
        onClick={openMobileNav}
        className="shrink-0 w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all md:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Right Side Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5 ml-auto">

        {/* Search Bar - Professional curved style */}
        <div className="relative w-64 lg:w-72 hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Search orders, vendors, riders..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d9488] focus:bg-white focus:ring-1 focus:ring-[#0d9488] transition-all shadow-2xs"
          />
        </div>

        {/* Notification Icon Button */}
        <button 
          aria-label="Notifications"
          className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all relative shadow-2xs"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Help / Support Button */}
        <button 
          aria-label="Help and Support"
          className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all shadow-2xs"
        >
          <HelpCircle size={18} />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <h2 className="text-xs font-bold text-gray-900">{displayName}</h2>
            <p className="text-[10px] font-medium text-gray-500">Admin</p>
          </div>
          <div className="relative flex w-10 h-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#0d9488] text-sm font-bold text-white shadow-sm">
            {initials}
          </div>
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;