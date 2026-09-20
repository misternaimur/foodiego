"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Clock, DollarSign, ArrowRight, MapPin } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ordersApi, orderRestaurantName, toDisplayStatus, type Order } from "@/lib/clientApi";

export default function ClientOverviewPage() {
  const { favorites, user } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .list()
      .then((data) => setOrders(data.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrder = activeOrders[0];
  const recentOrders = orders.slice(0, 3);

  const stats = [
    { label: "Total Orders", value: String(orders.length), icon: ShoppingBag, color: "bg-emerald-50 text-[#15462D]" },
    { label: "Active Orders", value: String(activeOrders.length), icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Favorites", value: String(favorites.length), icon: Heart, color: "bg-rose-50 text-rose-600" },
    { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, icon: DollarSign, color: "bg-sky-50 text-sky-600" },
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
            <p className="text-2xl font-extrabold text-gray-900">{loading ? "—" : s.value}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active order banner */}
      {activeOrder && (
        <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#15462D] text-white">
              <MapPin size={19} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                Order #{activeOrder._id.slice(-6).toUpperCase()} is {toDisplayStatus(activeOrder.status).toLowerCase()}
              </p>
              <p className="text-xs text-gray-500">{orderRestaurantName(activeOrder)}</p>
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
      )}

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
          <Link href="/client/orders" className="inline-flex items-center gap-1 text-xs font-bold text-[#15462D] hover:underline">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            [...Array(2)].map((_, i) => <div key={i} className="h-16 animate-pulse bg-gray-50" />)
          ) : recentOrders.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">No orders yet — your history will show up here.</div>
          ) : (
            recentOrders.map((order) => {
              const status = toDisplayStatus(order.status);
              const itemsSummary = order.items.map((i) => i.name).join(", ");
              return (
                <div key={order._id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{orderRestaurantName(order)}</p>
                      <span className="inline-flex items-center rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                        {status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">{itemsSummary}</p>
                    <p className="text-[11px] text-gray-400">
                      #{order._id.slice(-6).toUpperCase()} &middot; {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-extrabold text-gray-900">${order.totalAmount.toLocaleString()}</p>
                </div>
              );
            })
          )}
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
