"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";
import { useApp } from "@/context/AppContext";

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

export default function VendorSidebar() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const { logoutUser } = useApp();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-[#E5E7EB] lg:bg-white lg:shadow-sm">
      <div className="p-6 border-b border-[#E5E7EB]">
        <Link href="/vendor?tab=dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981] text-white font-bold text-xl">
            F
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#10B981]">FoodieGo</h1>
            <p className="text-xs text-gray-500">Vendor Admin</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {sidebarNav.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-50 text-[#10B981] border-l-4 border-[#10B981]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={isActive ? "text-[#10B981]" : "text-gray-400"}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}

            <li>
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#10B981] bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-100"
              >
                <Globe size={18} />
                <span>Return to Main Website</span>
              </Link>
            </li>
        </ul>
      </nav>

       <div className="p-4 border-t border-[#E5E7EB]">
         <ul className="space-y-1">
           <li>
             <Link
               href="/vendor/profile"
               className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
             >
               <User size={18} className="text-gray-400" />
               <span>Restaurant Profile</span>
             </Link>
           </li>
           <li className="relative">
             <Link
               href="/vendor/notifications"
               className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
             >
               <Bell size={18} className="text-gray-400" />
               <span>Notifications</span>
               <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white">
                 3
               </span>
             </Link>
           </li>
          <li>
            <Link
              href="/vendor/settings"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Settings size={18} className="text-gray-400" />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => logoutUser()}
              className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} className="text-red-400" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
