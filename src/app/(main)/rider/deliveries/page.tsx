"use client";

import {
  Bike,
  CheckCircle2,
  Clock3,
  DollarSign,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Search,
  Truck,
  LoaderCircle,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState, useTransition } from "react";
import RiderShell from "@/components/rider/RiderShell";
import { useRiderOrders } from "@/hooks/useRiderOrders";
import type { RiderOrderSummary } from "@/app/api/v1/rider/orders/route";
import { markPickedUp, markDelivered } from "@/app/(main)/actions/rider";

// ============================================================
// UPDATE (rider-dashboard real-data fix): this page used to render a
// fixed array of fake deliveries plus a hardcoded "Active Delivery" card
// (always "Burger Joint -> Sarah M., 75%"). It now derives the active
// delivery and delivery history from this rider's real OrderBooking
// records (via useRiderOrders()). "Progress %" is derived from how far
// along the real status enum the order is (pending/confirmed/preparing/
// out_for_delivery/delivered) since there's no finer-grained tracking.
// ============================================================

type DeliveryStatus = "In Progress" | "Accepted" | "Completed";

function toDeliveryStatus(status: RiderOrderSummary["status"]): DeliveryStatus | "Cancelled" {
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

const STAGES = ["confirmed", "preparing", "ready", "out_for_delivery", "delivered"] as const;
function progressPercent(status: RiderOrderSummary["status"]) {
  const idx = STAGES.indexOf(status as (typeof STAGES)[number]);
  if (idx === -1) return status === "delivered" ? 100 : 0;
  return Math.round(((idx + 1) / STAGES.length) * 100);
}

export default function RiderDeliveriesPage() {
  const { orders: rawOrders, loading, refetch } = useRiderOrders();
  const [search, setSearch] = useState("");
  const [actionPending, startAction] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  // UPDATE (order-lifecycle fix): this page used to be entirely read-only —
  // a rider could see their active delivery here but had no way to advance
  // it. Mirrors the same two actions on the main /rider dashboard card.
  const handlePickedUp = (orderId: string) => {
    setActionError(null);
    startAction(async () => {
      const result = await markPickedUp(orderId);
      if (result.ok) await refetch();
      else setActionError(result.message ?? "Could not update this delivery.");
    });
  };

  const handleDelivered = (orderId: string) => {
    setActionError(null);
    startAction(async () => {
      const result = await markDelivered(orderId);
      if (result.ok) await refetch();
      else setActionError(result.message ?? "Could not update this delivery.");
    });
  };

  const activeOrder = useMemo(
    () => rawOrders.find((o) => o.status !== "delivered" && o.status !== "cancelled"),
    [rawOrders]
  );

  const deliveries = useMemo(
    () =>
      rawOrders
        .filter((o) => o.status === "delivered" || o.status === "cancelled")
        .map((o) => ({
          id: o._id,
          restaurant: o.restaurantName,
          customer: o.customerName,
          pickup: o.restaurantName,
          delivery: o.deliveryAddress,
          payout: `$${o.deliveryFee.toFixed(2)}`,
          status: toDeliveryStatus(o.status) as "Completed",
        })),
    [rawOrders]
  );

  const filteredDeliveries = deliveries.filter((delivery) => {
    const searchText = search.toLowerCase();
    return (
      delivery.id.toLowerCase().includes(searchText) ||
      delivery.restaurant.toLowerCase().includes(searchText) ||
      delivery.customer.toLowerCase().includes(searchText)
    );
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayDelivered = rawOrders.filter(
    (o) => o.status === "delivered" && new Date(o.updatedAt) >= todayStart
  );
  const acceptedCount = rawOrders.filter((o) => o.status === "confirmed" || o.status === "preparing").length;

  const deliveryStats = [
    { icon: <Bike className="h-5 w-5" />, title: "Active Delivery", value: activeOrder ? "1" : "0", description: activeOrder ? "Currently on the way" : "No active delivery", highlight: !!activeOrder },
    { icon: <Clock3 className="h-5 w-5" />, title: "Accepted", value: String(acceptedCount), description: "Ready to start", highlight: false },
    { icon: <CheckCircle2 className="h-5 w-5" />, title: "Completed", value: String(todayDelivered.length), description: "Today's completed", highlight: false },
    { icon: <DollarSign className="h-5 w-5" />, title: "Delivery Earnings", value: `$${todayDelivered.reduce((s, o) => s + (o.deliveryFee || 0), 0).toFixed(2)}`, description: "From today's deliveries", highlight: false },
  ];

  return (
    <RiderShell activePath="/rider/deliveries">
      {/* Mobile Heading */}
      <div className="px-5 pt-5 lg:hidden">
        <h2 className="text-2xl font-bold">Rider Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Track your active deliveries and review your completed delivery
          history.
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
              Deliveries
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Track your active deliveries and review your completed delivery
              history.
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
          {deliveryStats.map((stat, i) => (
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
              <DeliveryStat
                icon={stat.icon}
                title={stat.title}
                value={loading ? "—" : stat.value}
                description={stat.description}
                highlight={stat.highlight}
              />
            </motion.div>
          ))}
        </motion.section>

        {/* ACTIVE DELIVERY */}
        {activeOrder && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <p className="text-sm font-semibold text-green-600">
                    Active Delivery
                  </p>
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {activeOrder.restaurantName} → {activeOrder.customerName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Order #{activeOrder._id.slice(-6).toUpperCase()}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-400">Payout</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${activeOrder.deliveryFee.toFixed(2)}
                </p>
              </div>
            </div>

            {/* ROUTE */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pickup</p>
                <div className="mt-3 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{activeOrder.restaurantName}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Delivery</p>
                <div className="mt-3 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{activeOrder.customerName}</p>
                    <p className="mt-1 text-sm text-slate-500">{activeOrder.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {activeOrder.deliveryNote && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <span className="font-semibold">Delivery note:</span> {activeOrder.deliveryNote}
              </div>
            )}

            {/* DELIVERY INFO */}
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5">
                <Bike className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  {activeOrder.status === "out_for_delivery"
                    ? "On the way"
                    : activeOrder.status === "ready"
                    ? "Ready for pickup"
                    : "Preparing"}
                </span>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Delivery Progress</p>
                <p className="text-xs font-medium text-green-500">{progressPercent(activeOrder.status)}%</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent(activeOrder.status)}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-green-500"
                />
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-400">
                <span>Accepted</span>
                <span>Preparing</span>
                <span>Ready</span>
                <span>On the Way</span>
                <span>Delivered</span>
              </div>
            </div>

            {/* ACTIONS */}
            {actionError && <p className="mt-4 text-xs font-medium text-rose-600">{actionError}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/rider#chat-${activeOrder._id}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Phone className="h-4 w-4" />
                Contact Customer
              </a>
              {activeOrder.status === "ready" && (
                <button
                  type="button"
                  onClick={() => handlePickedUp(activeOrder._id)}
                  disabled={actionPending}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {actionPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
                  Mark Picked Up
                </button>
              )}
              {activeOrder.status === "out_for_delivery" && (
                <button
                  type="button"
                  onClick={() => handleDelivered(activeOrder._id)}
                  disabled={actionPending}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  {actionPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
                  Mark Delivered
                </button>
              )}
            </div>
          </motion.section>
        )}

        {/* DELIVERY HISTORY */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Header */}
          <div className="border-b border-slate-100 p-5 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Delivery History</h2>
                <p className="mt-1 text-sm text-slate-500">View your recent delivery activity.</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search deliveries..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-green-300 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-slate-400">Loading…</div>
          ) : filteredDeliveries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Package className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">No deliveries found</h3>
              <p className="mt-1 text-sm text-slate-500">Try searching with another order or customer name.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDeliveries.map((delivery) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 transition hover:bg-slate-50 md:p-6"
                >
                  <DeliveryRow delivery={delivery} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </RiderShell>
  );
}

type DisplayDelivery = {
  id: string;
  restaurant: string;
  customer: string;
  pickup: string;
  delivery: string;
  payout: string;
  status: "Completed" | "Cancelled";
};

/* DELIVERY STAT */
function DeliveryStat({
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
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight
          ? "border-green-200 ring-1 ring-green-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
        {icon}
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

/* DELIVERY ROW */
function DeliveryRow({ delivery }: { delivery: DisplayDelivery }) {
  const isCompleted = delivery.status === "Completed";

  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
      {/* Delivery Info */}
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Bike className="h-5 w-5 text-green-500" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900">{delivery.restaurant}</h3>
            <DeliveryStatusBadge status={delivery.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">Order #{delivery.id.slice(-6).toUpperCase()}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {delivery.customer}
            </span>
          </div>
        </div>
      </div>

      {/* Route */}
      <div className="hidden min-w-57.5 lg:block">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Delivery Route</p>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <p className="truncate text-xs text-slate-600">{delivery.pickup}</p>
          </div>
          <div className="ml-0.75 h-3 border-l border-dashed border-slate-300" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <p className="truncate text-xs text-slate-600">{delivery.delivery}</p>
          </div>
        </div>
      </div>

      {/* Payout */}
      <div className="flex items-center justify-between gap-5 xl:block xl:min-w-25">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Payout</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{delivery.payout}</p>
        </div>
      </div>
    </div>
  );
}

/* DELIVERY STATUS BADGE */
function DeliveryStatusBadge({ status }: { status: "Completed" | "Cancelled" }) {
  const styles = {
    Completed: "bg-green-50 text-green-700 border-green-200",
    Cancelled: "bg-rose-50 text-rose-600 border-rose-200",
  };
  const icons = {
    Completed: <CheckCircle2 className="h-3 w-3" />,
    Cancelled: <Clock3 className="h-3 w-3" />,
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
