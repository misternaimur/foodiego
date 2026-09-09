"use client";

import Link from "next/link";
import { ShoppingBag, Heart, Clock, DollarSign, ArrowRight, MapPin } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface RecentOrder {
  id: string;
  restaurant: string;
  items: string;
  total: number;
  status: "Delivered" | "On the way" | "Preparing" | "Cancelled";
  date: string;
}

const recentOrders: RecentOrder[] = [
  { id: "#FG-10234", restaurant: "Greenhouse Cafe", items: "Truffle Smashburger, Fries", total: 22.5, status: "On the way", date: "Today, 1:45 PM" },
  { id: "#FG-10229", restaurant: "Sushi Master", items: "Sushi Platter x1", total: 34.0, status: "Delivered", date: "Yesterday, 8:10 PM" },
  { id: "#FG-10218", restaurant: "Sweet Treats Bakery", items: "Berry Cheesecake", total: 12.0, status: "Delivered", date: "Oct 21, 2026" },
];

const statusColors: Record<RecentOrder["status"], string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "On the way": "bg-amber-50 text-amber-700 border-amber-100",
  Preparing: "bg-sky-50 text-sky-700 border-sky-100",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function ClientOverviewPage() {
  const { favorites, user } = useApp();

  const stats = [
    { label: "Total Orders", value: "18", icon: ShoppingBag, color: "bg-emerald-50 text-[#15462D]" },
    { label: "Active Orders", value: "1", icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Favorites", value: String(favorites.length), icon: Heart, color: "bg-rose-50 text-rose-600" },
    { label: "Total Spent", value: "$412.80", icon: DollarSign, color: "bg-sky-50 text-sky-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">Here&apos;s what&apos;s happening with your orders.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active order banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#15462D] text-white">
            <MapPin size={19} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Order #FG-10234 is on the way</p>
            <p className="text-xs text-gray-500">Greenhouse Cafe &middot; Arriving in ~15 min</p>
          </div>
        </div>
        <Link
          href="/client/track"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#15462D] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0e3320]"
        >
          Track Order
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
          <Link href="/client/orders" className="inline-flex items-center gap-1 text-xs font-bold text-[#15462D] hover:underline">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{order.restaurant}</p>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{order.items}</p>
                <p className="text-[11px] text-gray-400">{order.id} &middot; {order.date}</p>
              </div>
              <p className="text-sm font-extrabold text-gray-900">${order.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/restaurants" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <ShoppingBag size={20} className="text-[#15462D]" />
          <p className="mt-3 text-sm font-bold text-gray-900">Browse Restaurants</p>
          <p className="mt-1 text-xs text-gray-500">Discover new places to order from.</p>
        </Link>
        <Link href="/client/favorites" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <Heart size={20} className="text-rose-500" />
          <p className="mt-3 text-sm font-bold text-gray-900">Your Favorites</p>
          <p className="mt-1 text-xs text-gray-500">Quickly reorder what you love.</p>
        </Link>
        <Link href="/client/addresses" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <MapPin size={20} className="text-sky-600" />
          <p className="mt-3 text-sm font-bold text-gray-900">Manage Addresses</p>
          <p className="mt-1 text-xs text-gray-500">Update where we deliver to.</p>
        </Link>
      </div>
    </div>
  );
}