"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  LogOut 
} from 'lucide-react';
import Logo from '../Share/LogoWhite';

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

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#1f2223] border-r border-[#2e3132] flex flex-col font-sans select-none">
      {/* Logo Header */}
      <div className="p-6 pb-5 border-b border-[#2e3132] flex items-center">
        <Logo />
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-1 text-[13px] font-medium scrollbar-none">
        
        {/* Dashboard Link */}
        <Link 
          href="/admin" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold mb-2 transition-all duration-200 ${
            pathname === "/admin" 
              ? "bg-[#0d9488] text-white shadow-sm" 
              : "text-gray-300 hover:bg-[#2b2e2f] hover:text-white"
          }`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        {/* Grouped Navigation Links */}
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

      {/* Logout Footer Section */}
      <div className="p-4 border-t border-[#2e3132]">
        <Link 
          href="/auth/login" 
          className="flex items-center gap-3 px-4 py-3 text-[#f87171] hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm"
        >
          <LogOut size={18} /> Logout
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;