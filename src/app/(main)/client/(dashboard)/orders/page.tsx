"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingBag, MapPin, RotateCcw, Star, LoaderCircle, Flag, X, Send } from "lucide-react";
import { ordersApi, orderRestaurantName, toDisplayStatus, type DisplayOrderStatus, type Order } from "@/lib/clientApi";
import { useApp } from "@/context/AppContext";

// UPDATE (rider-rating fix): the only rating surface in this app used to be
// for restaurants/food - Rider.rating existed on the model but nothing ever
// wrote to it. Shown inline per delivered order (only once it has a real
// assigned rider and hasn't been rated yet) rather than on a generic form,
// since a rating only makes sense tied to the specific delivery it's about.
function RateRiderWidget({ order, onRated }: { order: Order; onRated: (orderId: string) => void }) {
  const [hoverValue, setHoverValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRate = async (rating: number) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/client/orders/${order._id}/rider-rating`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not submit rating");
      }
      onRated(order._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const riderName = typeof order.riderId === "object" ? order.riderId.fullName : "your rider";

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
      <span className="text-gray-500">Rate {riderName}:</span>
      <div className="flex items-center gap-0.5" onMouseLeave={() => setHoverValue(0)}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            disabled={submitting}
            onMouseEnter={() => setHoverValue(s)}
            onClick={() => handleRate(s)}
            aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
            className="p-0.5 disabled:opacity-50"
          >
            <Star size={16} className={s <= hoverValue ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
          </button>
        ))}
      </div>
      {submitting && <LoaderCircle size={13} className="animate-spin text-gray-400" />}
      {error && <span className="font-semibold text-rose-600">{error}</span>}
    </div>
  );
}

// UPDATE (customer-complaint fix): previously the only way a customer could
// give feedback was a normal star review — there was no way to file a
// distinct complaint about a specific order (see src/models/Ticket.ts's
// raisedByRole/orderId additions and src/app/api/v1/client/tickets/**).
const ISSUE_CATEGORIES = ["Order Issue", "Payment", "Account", "General"] as const;

function ReportIssueModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [category, setCategory] = useState<(typeof ISSUE_CATEGORIES)[number]>("Order Issue");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/client/tickets/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `${category} — Order #${order._id.slice(-6).toUpperCase()}`,
          category,
          message: message.trim(),
          orderId: order._id,
        }),
      });
      if (!res.ok) throw new Error("Could not submit your report");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Report an issue</h3>
            <p className="mt-0.5 text-xs text-gray-500">Order #{order._id.slice(-6).toUpperCase()} &middot; {orderRestaurantName(order)}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-center text-sm font-semibold text-emerald-700">
            Thanks — we&apos;ve received your report and our support team will follow up.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block text-xs font-semibold text-gray-700">
              What&apos;s this about?
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as (typeof ISSUE_CATEGORIES)[number])}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#15462D] focus:bg-white"
              >
                {ISSUE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold text-gray-700">
              Tell us what happened
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Missing item, wrong order, food arrived cold..."
                className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-[#15462D] focus:bg-white"
              />
            </label>
            {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#15462D] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0e3320] disabled:opacity-60"
            >
              {submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}
              Submit report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

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
  const [ratedOrderIds, setRatedOrderIds] = useState<Set<string>>(new Set());
  const [reportingOrder, setReportingOrder] = useState<Order | null>(null);

  useEffect(() => {
    ordersApi
      .list()
      .then((data) => setOrders(data.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRiderRated = (orderId: string) => {
    setRatedOrderIds((prev) => new Set(prev).add(orderId));
  };

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
                  activeTab === tab ? "bg-[#124734] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#124734] focus:bg-white focus:ring-2 focus:ring-[#124734]/10"
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
                    {status === "Delivered" && order.riderId && !order.riderRating && !ratedOrderIds.has(order._id) && (
                      <RateRiderWidget order={order} onRated={handleRiderRated} />
                    )}
                    {status === "Delivered" && order.riderId && (order.riderRating || ratedOrderIds.has(order._id)) && (
                      <p className="mt-1.5 text-xs font-medium text-emerald-700">Thanks for rating your rider!</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 sm:shrink-0">
                    <p className="text-sm font-extrabold text-gray-900">${order.totalAmount.toLocaleString()}</p>
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
                    {(status === "Delivered" || status === "Cancelled") && (
                      <button
                        onClick={() => setReportingOrder(order)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-2 text-[11px] font-bold text-gray-700 hover:bg-gray-50"
                      >
                        <Flag size={13} /> Report an issue
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {reportingOrder && <ReportIssueModal order={reportingOrder} onClose={() => setReportingOrder(null)} />}
    </div>
  );
}
