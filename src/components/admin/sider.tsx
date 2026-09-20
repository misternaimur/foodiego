"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FileText,
  Truck,
  UtensilsCrossed,
  Users2,
  Store,
  CreditCard,
  Wallet,
  ArrowRightLeft,
  BarChart3,
  Megaphone,
  Star,
  MessageCircle,
  Bell,
  LogOut,
  X,
} from 'lucide-react';
import Logo from '../Share/LogoWhite';
import { useApp } from '@/context/AppContext';
import { useAdminMobileNav } from './AdminMobileNavContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "OPERATIONS",
    items: [
      { label: "Orders", href: "/admin/orders", icon: FileText },
      { label: "Delivery & Logistics", href: "/admin/delivery", icon: Truck },
      { label: "Menu & Food", href: "/admin/menu", icon: UtensilsCrossed },
    ]
  },
  {
    title: "USERS & PARTNERS",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users2 },
      { label: "Vendors / Restaurants", href: "/admin/vendors", icon: Store },
      { label: "Riders", href: "/admin/riders", icon: Truck },
    ]
  },
  {
    title: "FINANCE",
    items: [
      { label: "Payments & Finance", href: "/admin/payments", icon: CreditCard },
      { label: "Commission", href: "/admin/commission", icon: Wallet },
      { label: "Refunds", href: "/admin/refunds", icon: ArrowRightLeft },
    ]
  },
  {
    title: "BUSINESS",
    items:
    [
      { label: "Analytics & Reports", href: "/admin/analytics", icon: BarChart3 },
      { label: "Promotions & Offers", href: "/admin/promotions", icon: Megaphone },
      { label: "Reviews & Ratings", href: "/admin/reviews", icon: Star },
    ]
  },
  {
    title: "COMMUNICATION",
    items: [
      { label: "Support & Tickets", href: "/admin/support", icon: MessageCircle },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
    ]
  }
];

// UPDATE (responsive fix): nav content shared between the always-visible
// desktop <aside> and the new mobile drawer, instead of only ever existing
// in a "hidden md:block" element with no mobile counterpart.
function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { logoutUser } = useApp();

  return (
    <>
      <nav className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-1 text-[13px] font-medium scrollbar-none">
        <Link
          href="/admin"
          onClick={onNavigate}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold mb-2 transition-all duration-200 ${
            pathname === "/admin"
              ? "bg-[#0d9488] text-white shadow-sm"
              : "text-gray-300 hover:bg-[#2b2e2f] hover:text-white"
          }`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="flex flex-col gap-1">
            <div className="px-4 pt-4 pb-1.5">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{group.title}</p>
            </div>
            {group.items.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#2b2e2f] text-[#0d9488] font-semibold border-l-2 border-[#0d9488]"
                      : "text-gray-300 hover:bg-[#2b2e2f] hover:text-white"
                  }`}
                >
                  <IconComponent size={18} className={isActive ? "text-[#0d9488]" : "text-gray-400"} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* UPDATE (logout fix): this used to be a plain <Link href="/auth/login">
          — it navigated to the login page without ever actually signing the
          admin out, so the session cookie stayed valid and going "back"
          (or just re-visiting /admin) landed you right back in, still
          logged in. It now calls the same logoutUser() every other
          dashboard's logout button uses. */}
      <div className="p-4 border-t border-[#2e3132]">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logoutUser();
          }}
          className="flex w-full items-center gap-3 px-4 py-3 text-[#f87171] hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm text-left"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </>
  );
}

const AdminSidebar = () => {
  const pathname = usePathname();
  const { isOpen, close } = useAdminMobileNav();

  return (
    <>
      {/* Desktop sidebar — unchanged, always visible from md up */}
      <aside className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#1f2223] border-r border-[#2e3132] hidden md:flex flex-col font-sans select-none">
        <div className="p-6 pb-5 border-b border-[#2e3132] flex items-center">
          <Logo />
        </div>
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer — the part that used to not exist at all below md */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={close}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] bg-[#1f2223] border-r border-[#2e3132] flex flex-col font-sans select-none md:hidden"
            >
              <div className="p-5 pb-4 border-b border-[#2e3132] flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full p-2 text-gray-400 hover:bg-[#2b2e2f] hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent pathname={pathname} onNavigate={close} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
