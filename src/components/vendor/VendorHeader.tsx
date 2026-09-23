"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  Search,
  User,
  ShoppingCart,
  LayoutDashboard,
  Settings,
  LogOut,
  Home,
  Store,
  LoaderCircle,
  Menu,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useVendorProfile, useUpdateVendorProfile } from "@/hooks/useVendorProfile";
import { springTransition } from "@/app/(main)/vendor/components/motion";
import { useVendorMobileNav } from "./VendorMobileNavContext";
import NotificationBell from "@/components/shared/NotificationBell";
import ThemeToggle from "@/components/shared/ThemeToggle";

interface VendorHeaderProps {
  userName?: string;
  userEmail?: string;
}

const dropdownItems = [
  {
    label: "Return to Home",
    icon: Home,
    href: "/",
    className: "text-slate-700 hover:bg-slate-50",
  },
  {
    label: "Restaurant Profile",
    icon: User,
    href: "/vendor/profile",
    className: "text-slate-700 hover:bg-slate-50",
  },
  {
    label: "My Cart",
    icon: ShoppingCart,
    href: "/cart",
    className: "text-slate-700 hover:bg-slate-50",
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/vendor?tab=dashboard",
    className: "text-slate-700 hover:bg-slate-50",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/vendor/settings",
    className: "text-slate-700 hover:bg-slate-50",
  },
  {
    label: "Logout",
    icon: LogOut,
    href: null,
    className: "text-rose-600 hover:bg-rose-50",
    isLogout: true,
  },
];

export default function VendorHeader({ userName, userEmail }: VendorHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(true);
  const initializedFromProfile = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logoutUser } = useApp();
  const { open: openMobileNav } = useVendorMobileNav();
  const { data: profile } = useVendorProfile();
  const updateProfile = useUpdateVendorProfile();

  const displayName = userName || profile?.name || "Vendor";
  const displayEmail = userEmail || profile?.email || "user@example.com";
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const effectiveStoreOpen = profile?.storeStatus !== undefined ? profile.storeStatus === "open" : storeOpen;

  useEffect(() => {
    if (!initializedFromProfile.current && profile?.storeStatus !== undefined) {
      initializedFromProfile.current = true;
      setStoreOpen(profile.storeStatus === "open");
    }
  }, [profile?.storeStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = () => setDropdownOpen(false);

  const handleLogout = async () => {
    handleItemClick();
    await logoutUser();
  };

  const handleStoreStatus = () => {
    const nextStatus = effectiveStoreOpen ? "closed" : "open";
    setStoreOpen(!effectiveStoreOpen);
    updateProfile.mutate({ storeStatus: nextStatus });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-slate-200/70 bg-white/85 px-4 shadow-sm backdrop-blur-md sm:gap-4 sm:px-6 lg:px-8">
      {/* UPDATE (responsive fix): opens VendorSidebar's new mobile drawer —
          previously there was no way at all to reach the sidebar's nav
          (Orders, Menu, Analytics, Payments, Delivery, Reviews, Support)
          below the lg breakpoint. */}
      <button
        type="button"
        onClick={openMobileNav}
        className="shrink-0 rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <form
        className="flex-1 max-w-md"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search orders, customers..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>
      </form>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <NotificationBell />

        <ThemeToggle className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer" />

        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={springTransition}
          className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={springTransition}
          onClick={handleStoreStatus}
          disabled={updateProfile.isPending}
          className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-60 sm:inline-flex"
        >
          {updateProfile.isPending ? (
            <LoaderCircle size={13} className="animate-spin" />
          ) : (
            <Store size={13} />
          )}
          {effectiveStoreOpen ? "Open" : "Closed"}
        </motion.button>

        <div className="relative" ref={dropdownRef}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springTransition}
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-black text-white shadow-md shadow-emerald-500/20 ring-2 ring-white focus:outline-none focus:ring-emerald-300"
            aria-label="User menu"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
          >
            {initials}
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={springTransition}
                className="absolute right-0 z-50 mt-2 w-64 origin-top-right"
              >
                <div className="min-w-[240px] rounded-2xl border border-slate-200/70 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-bold text-slate-900">{displayName}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{displayEmail}</p>
                  </div>

                  <div className="py-1">
                    {dropdownItems.map((item) => {
                      const Icon = item.icon;
                      return item.isLogout ? (
                        <button
                          key={item.label}
                          onClick={handleLogout}
                          className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${item.className}`}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </button>
                      ) : item.href ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={handleItemClick}
                          className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${item.className}`}
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
