"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  HelpCircle,
  Search,
  User,
  ShoppingCart,
  LayoutDashboard,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface VendorHeaderProps {
  userName?: string;
  userEmail?: string;
}

const dropdownItems = [
  {
    label: "Return to Home",
    icon: Home,
    href: "/",
    className: "text-gray-700 hover:bg-gray-50",
  },
  {
    label: "Profile",
    icon: User,
    href: "/profile",
    className: "text-gray-700 hover:bg-gray-50",
  },
  {
    label: "My Cart",
    icon: ShoppingCart,
    href: "/cart",
    className: "text-gray-700 hover:bg-gray-50",
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/vendor",
    className: "text-gray-700 hover:bg-gray-50",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/vendor/settings",
    className: "text-gray-700 hover:bg-gray-50",
  },
  {
    label: "Logout",
    icon: LogOut,
    href: null,
    className: "text-red-600 hover:bg-red-50",
    isLogout: true,
  },
];

export default function VendorHeader({ userName, userEmail }: VendorHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logoutUser } = useApp();

  const displayName = userName || "Delton";
  const displayEmail = userEmail || "user@example.com";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = () => {
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    handleItemClick();
    await logoutUser();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <form className="flex-1 max-w-md" role="search">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search orders, customers..."
            className="w-full rounded-full border border-[#E5E7EB] bg-gray-50 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#10B981] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 transition-colors"
          />
        </div>
      </form>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EF4444] border-2 border-white"></span>
        </button>

        <button
          type="button"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </button>

        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#10B981]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
          FoodieGo Restaurant • Open
        </span>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700 ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 transition-all"
            aria-label="User menu"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
          >
            {initials}
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-64 origin-top-right"
              >
                <div className="bg-white shadow-xl rounded-2xl border border-slate-100 p-2 min-w-[240px]">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-semibold text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{displayEmail}</p>
                  </div>

                  <div className="py-1">
                    {dropdownItems.map((item) => {
                      const Icon = item.icon;
                      return item.isLogout ? (
                        <button
                          key={item.label}
                          onClick={handleLogout}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${item.className}`}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </button>
                      ) : item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={handleItemClick}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${item.className}`}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
