"use client";

import {
  ArrowUpRight,
  Bike,
  CheckCircle2,
  Clock3,
  DollarSign,
  Filter,
  Package,
  Search,
  Timer,
  User,
  ChevronDown,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import RiderShell from "@/components/rider/RiderShell";
import { useRiderOrders } from "@/hooks/useRiderOrders";
import type { RiderOrderSummary } from "@/app/api/v1/rider/orders/route";

// ============================================================
// UPDATE (rider-dashboard real-data fix): this page used to render a
// fixed array of 5 fake orders. It now shows this rider's real order
// history from OrderBooking (via useRiderOrders()). Because this route
// only ever lists orders already assigned to this rider (riderId set),
// there is no "Available" status here — unassigned orders are what the
// dashboard's AvailableDeliveries panel already shows separately.
// Distance isn't shown per-order: there is no GPS/route-distance data
// anywhere in this codebase (see the comment in
// src/app/api/v1/rider/summary/route.ts for the same call on the
// dashboard stats).
// ============================================================

type OrderStatus = "Accepted" | "In Progress" | "Completed" | "Cancelled";

function toOrderStatus(status: RiderOrderSummary["status"]): OrderStatus {
  switch (status) {
    case "out_for_delivery":
      return "In Progress";
    case "delivered":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Accepted";
  }
}

const tabs: Array<"All" | OrderStatus> = [
  "All",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
];

export default function RiderOrdersPage() {
  const { orders: rawOrders, loading } = useRiderOrders();
  const [activeTab, setActiveTab] = useState<"All" | OrderStatus>("All");
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const orders = useMemo(
    () =>
      rawOrders.map((o) => ({
        id: o._id,
        restaurant: o.restaurantName,
        customer: o.customerName,
        pickup: o.restaurantName,
        delivery: o.deliveryAddress,
        payout: `$${o.deliveryFee.toFixed(2)}`,
        status: toOrderStatus(o.status),
        createdAt: o.createdAt,
      })),
    [rawOrders]
  );

  const stats = useMemo(() => {
    const accepted = orders.filter((o) => o.status === "Accepted").length;
    const inProgress = orders.filter((o) => o.status === "In Progress").length;
    const completed = orders.filter((o) => o.status === "Completed").length;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEarnings = orders
      .filter((o) => o.status === "Completed" && new Date(o.createdAt) >= todayStart)
      .reduce((sum, o) => sum + parseFloat(o.payout.slice(1)), 0);
    return { accepted, inProgress, completed, todayEarnings };
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "All" || order.status === activeTab;
    const searchText = search.toLowerCase().trim();
    const matchesSearch =
      order.id.toLowerCase().includes(searchText) ||
      order.restaurant.toLowerCase().includes(searchText) ||
      order.customer.toLowerCase().includes(searchText);
    return matchesTab && matchesSearch;
  });

  const orderStats = [
    { icon: <Package className="h-5 w-5" />, title: "Total Orders", value: String(orders.length), description: "All-time assigned orders", highlight: false },
    { icon: <Clock3 className="h-5 w-5" />, title: "Accepted", value: String(stats.accepted), description: "Waiting to be picked up", highlight: true },
    { icon: <Bike className="h-5 w-5" />, title: "In Progress", value: String(stats.inProgress), description: "Active deliveries", highlight: false },
    { icon: <DollarSign className="h-5 w-5" />, title: "Today's Earnings", value: `$${stats.todayEarnings.toFixed(2)}`, description: "From completed deliveries today", highlight: false },
  ];

  return (
    <RiderShell activePath="/rider/orders">
      {/* Mobile Heading */}
      <div className="px-5 pt-5 lg:hidden">
        <h2 className="text-2xl font-bold">Rider Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your delivery orders from here.
        </p>
      </div>

      <div className="space-y-7 p-5 md:p-8 lg:p-10">
        {/* PAGE HEADER */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="mb-2 text-4xl font-bold text-green-500">
              Rider Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Orders
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Review the delivery orders assigned to you and track their
              status.
            </p>
          </div>
        </motion.section>

        {/* STATS */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {orderStats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.12 + i * 0.04,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <OrderStat
                icon={stat.icon}
                title={stat.title}
                value={loading ? "—" : stat.value}
                description={stat.description}
                highlight={stat.highlight}
              />
            </motion.div>
          ))}
        </motion.section>

        {/* ORDERS PANEL */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Panel Header */}
          <div className="border-b border-slate-100 p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Delivery Orders
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your full order history, most recent first.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search orders..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-green-300 focus:bg-white focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Filter */}
                <motion.button
                  type="button"
                  onClick={() => setShowFilter(!showFilter)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showFilter ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>
              </div>
            </div>

            {/* FILTER DROPDOWN */}
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Filter by status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab);
                          setShowFilter(false);
                        }}
                        className={`rounded-md px-3 py-2 text-xs font-medium transition ${
                          activeTab === tab
                            ? "bg-green-500 text-white"
                            : "bg-white text-slate-600 hover:bg-green-50 hover:text-green-600"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TABS */}
            <div className="mt-6 flex gap-6 overflow-x-auto border-b border-slate-100">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative whitespace-nowrap pb-3 text-sm font-medium transition ${
                    activeTab === tab
                      ? "text-green-500"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="orderTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-green-500"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ORDER LIST */}
          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-slate-400">
              Loading your orders…
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Package className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">No orders found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another search or status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveTab("All");
                }}
                className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </RiderShell>
  );
}

type DisplayOrder = {
  id: string;
  restaurant: string;
  customer: string;
  pickup: string;
  delivery: string;
  payout: string;
  status: OrderStatus;
  createdAt: string;
};

/* ORDER STAT */
function OrderStat({
  icon,
  title,
  value,
  description,
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight
          ? "border-green-200 ring-1 ring-green-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

/* ORDER ROW */
function OrderRow({ order }: { order: DisplayOrder }) {
  const isAccepted = order.status === "Accepted";
  const isProgress = order.status === "In Progress";
  const isCompleted = order.status === "Completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-5 transition hover:bg-slate-50 md:p-6"
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
        {/* RESTAURANT */}
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
            <Package className="h-5 w-5 text-green-500" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">{order.restaurant}</h3>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Order #{order.id.slice(-6).toUpperCase()}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {order.customer}
              </span>
              <span className="flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5" />
                {new Date(order.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        {/* DELIVERY ROUTE */}
        <div className="hidden min-w-[230px] lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Delivery Route
          </p>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
              <p className="truncate text-xs text-slate-600">{order.pickup}</p>
            </div>
            <div className="ml-[3px] h-3 border-l border-dashed border-slate-300" />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-slate-400" />
              <p className="truncate text-xs text-slate-600">{order.delivery}</p>
            </div>
          </div>
        </div>

        {/* PAYOUT */}
        <div className="flex items-center justify-between gap-5 xl:block xl:min-w-[100px]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Payout
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">{order.payout}</p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 xl:min-w-[150px] xl:justify-end">
          {isAccepted && (
            <span className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600">
              Waiting for pickup
            </span>
          )}
          {isProgress && (
            <span className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-600">
              On the way
              <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
          {isCompleted && (
            <span className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600">
              Delivered
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* STATUS BADGE */
function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    Accepted: "bg-blue-50 text-blue-700 border-blue-200",
    "In Progress": "bg-green-50 text-green-700 border-green-200",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
    Cancelled: "bg-rose-50 text-rose-600 border-rose-200",
  };
  const icons: Record<OrderStatus, React.ReactNode> = {
    Accepted: <CheckCircle2 className="h-3 w-3" />,
    "In Progress": <Clock3 className="h-3 w-3" />,
    Completed: <CheckCircle2 className="h-3 w-3" />,
    Cancelled: <XCircle className="h-3 w-3" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
}
