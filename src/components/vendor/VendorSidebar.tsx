"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  BarChart3,
  CreditCard,
  Truck,
  Star,
  Ticket,
  Bell,
  Settings,
  LogOut,
  Globe,
  User,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { staggerContainer, staggerItem, springTransition } from "@/app/(main)/vendor/components/motion";
import { useVendorMobileNav } from "./VendorMobileNavContext";

const sidebarNav = [
  { label: "Dashboard", href: "/vendor?tab=dashboard", icon: LayoutDashboard, tab: "dashboard" },
  { label: "Orders", href: "/vendor?tab=orders", icon: ShoppingBag, tab: "orders" },
  { label: "Menu Management", href: "/vendor?tab=menu", icon: UtensilsCrossed, tab: "menu" },
  { label: "Sales & Analytics", href: "/vendor?tab=analytics", icon: BarChart3, tab: "analytics" },
  { label: "Payments & Earnings", href: "/vendor?tab=payments", icon: CreditCard, tab: "payments" },
  { label: "Delivery Management", href: "/vendor?tab=delivery", icon: Truck, tab: "delivery" },
  { label: "Reviews & Ratings", href: "/vendor?tab=reviews", icon: Star, tab: "reviews" },
  { label: "Support Tickets", href: "/vendor?tab=support", icon: Ticket, tab: "support" },
];

// UPDATE (responsive fix): the nav content is now shared between the
// always-visible desktop <aside> and the new mobile drawer below, instead
// of the desktop-only version this used to be the whole component.
function SidebarContent({ activeTab, onNavigate }: { activeTab: string; onNavigate?: () => void }) {
  const { logoutUser } = useApp();

  return (
    <>
      <nav className="flex-1 overflow-y-auto px-4 py-2">
        <motion.ul variants={staggerContainer} initial="initial" animate="animate" className="space-y-1">
          {sidebarNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <motion.li key={item.href} variants={staggerItem}>
                <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${isActive ? "text-emerald-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="vendor-nav-pill"
                        transition={springTransition}
                        className="absolute inset-0 rounded-xl bg-emerald-50 shadow-sm"
                      />
                    )}
                    <Icon size={18} className={`relative ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                    <span className="relative">{item.label}</span>
                  </Link>
                </motion.div>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>

      <div className="space-y-1 border-t border-slate-200/70 px-4 py-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
        >
          <Globe size={18} className="text-emerald-500" />
          <span>Return to Main Website</span>
        </Link>
        <Link
          href="/vendor/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <User size={18} className="text-slate-400" />
          <span>Restaurant Profile</span>
        </Link>
        <Link
          href="/vendor/notifications"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Bell size={18} className="text-slate-400" />
          <span>Notifications</span>
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">3</span>
        </Link>
        <Link
          href="/vendor/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Settings size={18} className="text-slate-400" />
          <span>Settings</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logoutUser();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
        >
          <LogOut size={18} className="text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}

function SidebarBrand() {
  return (
    <Link href="/vendor?tab=dashboard" className="group flex items-center gap-3">
      <motion.div
        whileHover={{ rotate: -6, scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={springTransition}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
      >
        <span className="text-lg font-black">F</span>
      </motion.div>
      <div>
        <h1 className="text-base font-black tracking-tight text-slate-900">FoodieGo</h1>
        <p className="text-[11px] font-semibold text-slate-500">Vendor Admin</p>
      </div>
    </Link>
  );
}

export default function VendorSidebar() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const { isOpen, close } = useVendorMobileNav();

  return (
    <>
      {/* Desktop sidebar — unchanged, always visible from lg up */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200/70 bg-white/85 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.04)] backdrop-blur-md lg:flex">
        <div className="flex items-center gap-3 px-6 py-7">
          <SidebarBrand />
        </div>
        <SidebarContent activeTab={activeTab} />
      </aside>

      {/* Mobile drawer — the part that used to not exist at all below lg */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={close}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={springTransition}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between gap-3 px-6 py-7">
                <SidebarBrand />
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent activeTab={activeTab} onNavigate={close} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
