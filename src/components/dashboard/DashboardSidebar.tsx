// src/components/dashboard/DashboardSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Bike,
  ClipboardList,
  CreditCard,
  Heart,
  History,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  Percent,
  RotateCcw,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Truck,
  User,
  Users,
  UtensilsCrossed,
  Wallet,
  Home,
  LogOut,
} from "lucide-react";
import { can } from "@/lib/permissions";
import type { RoleConfig } from "@/types/dashboard";
import { logout } from "@/actions/auth";

interface DashboardSidebarProps {
  config?: RoleConfig;
  badgeCounts?: Record<string, number>;
}

const icons = {
  BarChart3,
  Bell,
  Bike,
  ClipboardList,
  CreditCard,
  Heart,
  History,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  Percent,
  RotateCcw,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Truck,
  User,
  Users,
  UtensilsCrossed,
  Wallet,
  Home,
  LogOut,
} as const;

export function DashboardSidebar({ config, badgeCounts }: DashboardSidebarProps) {
  const pathname = usePathname();

  // Safely handle cases where config or config.nav might be undefined
  const visibleItems = (config?.nav ?? []).filter(
    (item) => !item.permission || (config && can(config, item.permission))
  );

  if (!config) {
    return null;
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col rounded-2-[24px] bg-zinc-950 dark:bg-zinc-950 p-4">
      {/* Brand mark */}
      <div className="flex items-center gap-2.5 px-2 pb-7 pt-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary">
          <UtensilsCrossed className="h-[18px] w-[18px] text-primary-foreground" strokeWidth={2.25} />
        </div>
        <p className="text-[15px] font-bold text-white">Foodiego</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = icons[item.icon as keyof typeof icons] ?? LayoutDashboard;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const badge = item.badgeKey ? badgeCounts?.[item.badgeKey] : undefined;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13.5px] font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={2} />
              <span className="truncate">{item.label}</span>
              {!!badge && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-zinc-950">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="flex flex-col gap-0.5 border-t border-white/10 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-500 transition-colors duration-150 hover:text-zinc-200"
        >
          <Home className="h-4 w-4" strokeWidth={2} />
          Home page
        </Link>
        <Link
          href={
            config.role === "vendor"
              ? "/vendor/settings"
              : config.role === "rider"
              ? "/rider/settings"
              : config.role === "client"
              ? "/client/profile"
              : "/admin"
          }
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-500 transition-colors duration-150 hover:text-zinc-200"
        >
          <Settings className="h-4 w-4" strokeWidth={2} />
          Account settings
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-500 transition-colors duration-150 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}