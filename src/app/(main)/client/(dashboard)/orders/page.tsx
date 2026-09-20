"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingBag, MapPin, RotateCcw } from "lucide-react";
import { ordersApi, orderRestaurantName, toDisplayStatus, type DisplayOrderStatus, type Order } from "@/lib/clientApi";
import { useApp } from "@/context/AppContext";

// UPDATE (customer-reorder fix): the "Reorder" button used to have no
// onClick handler at all. It now rebuilds cart items from this past
// order's real line items (name/price/quantity are the only fields an
// OrderBooking line actually stores — see OrderBooking.ts) and adds them
// to the cart via AppContext's addToCart, then sends the customer to
// /cart to review and check out. Display-only FoodItem fields this order
// data doesn't have (image, rating, cuisine, delivery time) are left
// blank/zero rather than fabricated — the cart page doesn't render them.
function reorder(order: Order, addToCart: ReturnType<typeof useApp>["addToCart"]) {
  const restaurantName = orderRestaurantName(order);
  for (const item of order.items) {
    addToCart(
      {
        id: item.menuItemId,
        name: item.name,
        description: "",
        price: item.price,
        rating: 0,
        deliveryTime: "",
        deliveryFee: "",
        restaurantName,
        cuisine: "",
        imageUrl: "",
      },
      { quantity: item.quantity }
    );
  }
}

const statusColors: Record<DisplayOrderStatus, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "On the way": "bg-amber-50 text-amber-700 border-amber-100",
  Preparing: "bg-sky-50 text-sky-700 border-sky-100",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

const tabs = ["All", "Active", "Delivered", "Cancelled"] as const;

export default function ClientOrdersPage() {
  const router = useRouter();
  const { addToCart } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    ordersApi
      .list()
      .then((data) => setOrders(data.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((order) => {
    const status = toDisplayStatus(order.status);
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Active" && (status === "On the way" || status === "Preparing")) ||
      (activeTab === "Delivered" && status === "Delivered") ||
      (activeTab === "Cancelled" && status === "Cancelled");

    const restaurantName = orderRestaurantName(order);
    const itemsSummary = order.items.map((i) => i.name).join(", ");
    const query = search.toLowerCase();
    const matchesSearch =
      restaurantName.toLowerCase().includes(query) ||
      order._id.toLowerCase().includes(query) ||
      itemsSummary.toLowerCase().includes(query);

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
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-20 animate-pulse bg-gray-50" />)
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <ShoppingBag size={30} className="mx-auto text-gray-300" />
              <p className="mt-3 text-sm font-semibold text-gray-700">No orders found</p>
              <p className="text-xs text-gray-400">
                {orders.length === 0 ? "You haven't placed any orders yet." : "Try a different search or filter."}
              </p>
            </div>
          ) : (
            filtered.map((order) => {
              const status = toDisplayStatus(order.status);
              const itemsSummary = order.items.map((i) => `${i.name} x${i.quantity}`).join(", ");
              return (
                <div key={order._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{orderRestaurantName(order)}</p>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColors[status]}`}>
                        {status}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{itemsSummary}</p>
                    <p className="text-[11px] text-gray-400">
                      #{order._id.slice(-6).toUpperCase()} &middot; {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:shrink-0">
                    <p className="text-sm font-extrabold text-gray-900">৳{order.totalAmount.toLocaleString()}</p>
                    {status === "On the way" && (
                      <Link
                        href="/client/track"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#15462D] px-3.5 py-2 text-[11px] font-bold text-white hover:bg-[#0e3320]"
                      >
                        <MapPin size={13} /> Track
                      </Link>
                    )}
                    {(status === "Delivered" || status === "Cancelled") && (
                      <button
                        onClick={() => {
                          reorder(order, addToCart);
                          router.push("/cart");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50"
                      >
                        <RotateCcw size={13} /> Reorder
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
