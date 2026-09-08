/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Heart,
  MapPin,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface ClientDashboardShellProps {
  user: { name: string; email: string };
  children: React.ReactNode;
}

const navItems = [
  { label: "Overview", href: "/client", icon: LayoutDashboard },
  { label: "My Orders", href: "/client/orders", icon: ShoppingBag },
  { label: "Track Live Order", href: "/client/track", icon: Truck },
  { label: "Favorites", href: "/client/favorites", icon: Heart },
  { label: "Addresses", href: "/client/addresses", icon: MapPin },
  { label: "Profile Settings", href: "/client/profile", icon: User },
];

export default function ClientDashboardShell({
  user,
  children,
}: ClientDashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user: authUser, logoutUser } = useApp();

  const displayName = authUser?.name || user.name;
  const displayEmail = authUser?.email || user.email;
  const initials = displayName ? displayName.charAt(0).toUpperCase() : "U";

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Profile */}
      <div className="border-b border-gray-100 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-[#15462D]">
            {authUser?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authUser.avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">
              {displayName}
            </p>
            <p className="truncate text-xs text-gray-500">{displayEmail}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-4 py-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[#15462D] text-white shadow-sm"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-[#15462D]"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-white" : "text-gray-400"}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={() => logoutUser()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7EE]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-gray-200 bg-white lg:sticky lg:top-0 lg:block lg:h-screen">
          {SidebarContent}
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-5 rounded-lg p-2 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={18} className="text-gray-600" />
          </button>
          {SidebarContent}
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <div className="border-b border-gray-200 bg-white px-5 py-4 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
              aria-label="Open menu"
            >
              <Menu size={20} className="text-gray-700" />
            </button>
          </div>
          <div className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
