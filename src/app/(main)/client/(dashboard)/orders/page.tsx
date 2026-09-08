"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, MapPin, RotateCcw } from "lucide-react";

interface Order {
  id: string;
  restaurant: string;
  items: string;
  total: number;
  status: "Delivered" | "On the way" | "Preparing" | "Cancelled";
  date: string;
}

const allOrders: Order[] = [
  { id: "#FG-10234", restaurant: "Greenhouse Cafe", items: "Truffle Smashburger, Fries", total: 22.5, status: "On the way", date: "Today, 1:45 PM" },
  { id: "#FG-10229", restaurant: "Sushi Master", items: "Sushi Platter x1", total: 34.0, status: "Delivered", date: "Yesterday, 8:10 PM" },
  { id: "#FG-10218", restaurant: "Sweet Treats Bakery", items: "Berry Cheesecake", total: 12.0, status: "Delivered", date: "Oct 21, 2026" },
  { id: "#FG-10199", restaurant: "Spice Route Indian", items: "Chicken Biryani, Naan x2", total: 28.75, status: "Delivered", date: "Oct 18, 2026" },
  { id: "#FG-10180", restaurant: "Burger Joint Co.", items: "Double Cheeseburger", total: 15.0, status: "Cancelled", date: "Oct 12, 2026" },
];

const statusColors: Record<Order["status"], string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "On the way": "bg-amber-50 text-amber-700 border-amber-100",
  Preparing: "bg-sky-50 text-sky-700 border-sky-100",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

const tabs = ["All", "Active", "Delivered", "Cancelled"] as const;

export default function ClientOrdersPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [search, setSearch] = useState("");

  const filtered = allOrders.filter((order) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Active" && (order.status === "On the way" || order.status === "Preparing")) ||
      (activeTab === "Delivered" && order.status === "Delivered") ||
      (activeTab === "Cancelled" && order.status === "Cancelled");

    const query = search.toLowerCase();
    const matchesSearch =
      order.restaurant.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      order.items.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">My Orders</h1>
        <p className="mt-1 text-sm text-gray-500">Track, reorder, or review your past orders.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto text-xs font-bold">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
                  activeTab === tab ? "bg-[#15462D] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#15462D] focus:bg-white focus:ring-2 focus:ring-[#15462D]/10"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <ShoppingBag size={30} className="mx-auto text-gray-300" />
              <p className="mt-3 text-sm font-semibold text-gray-700">No orders found</p>
              <p className="text-xs text-gray-400">Try a different search or filter.</p>
            </div>
          ) : (
            filtered.map((order) => (
              <div key={order.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{order.restaurant}</p>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{order.items}</p>
                  <p className="text-[11px] text-gray-400">{order.id} &middot; {order.date}</p>
                </div>

                <div className="flex items-center gap-3 sm:shrink-0">
                  <p className="text-sm font-extrabold text-gray-900">${order.total.toFixed(2)}</p>
                  {order.status === "On the way" && (
                    <Link
                      href="/client/track"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#15462D] px-3.5 py-2 text-[11px] font-bold text-white hover:bg-[#0e3320]"
                    >
                      <MapPin size={13} /> Track
                    </Link>
                  )}
                  {(order.status === "Delivered" || order.status === "Cancelled") && (
                    <button className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50">
                      <RotateCcw size={13} /> Reorder
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}