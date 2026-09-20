"use client";

import {
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  Package,
  Power,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import RiderShell from "./RiderShell";
import AvailableDeliveries from "./AvailableDeliveries";
import OrderChatPanel from "@/components/chat/OrderChatPanel";
import { useApp } from "@/context/AppContext";

interface ActiveDelivery {
  _id: string;
  restaurantName: string;
  deliveryAddress: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  itemsSummary: string;
  customerName: string;
}

const STEP_LABELS: Record<ActiveDelivery["status"], string> = {
  pending: "Accepted",
  confirmed: "Accepted",
  preparing: "Picked Up",
  out_for_delivery: "On the Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface RiderSummary {
  todayDeliveries: number;
  todayEarnings: number;
  successRate: number;
  performance: { completed: number; avgMinutes: number | null; rating: number };
  recentActivity: { id: string; title: string; text: string; time: string }[];
}

export default function RiderDashboard() {
  const { user } = useApp();
  // UPDATE (rider-dashboard real-data fix): isOnline now mirrors the real
  // Rider.isAvailable field (via /api/v1/rider/profile) instead of being
  // reset to `true` on every page load with no way to persist it.
  const [isOnline, setIsOnline] = useState(true);
  const [activeDelivery, setActiveDelivery] = useState<ActiveDelivery | null>(null);
  const [loadingDelivery, setLoadingDelivery] = useState(true);
  const [summary, setSummary] = useState<RiderSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/v1/rider/active-delivery", { credentials: "include" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { delivery: ActiveDelivery | null };
        if (!cancelled) setActiveDelivery(data.delivery);
      } catch {
        // Next poll retries.
      } finally {
        if (!cancelled) setLoadingDelivery(false);
      }
    };

    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSummary = async () => {
      try {
        const res = await fetch("/api/v1/rider/summary", { credentials: "include" });
        if (!res.ok || cancelled) return;
        setSummary(await res.json());
      } catch {
        // Next poll retries.
      }
    };

    const loadProfile = async () => {
      try {
        const res = await fetch("/api/v1/rider/profile", { credentials: "include" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { isAvailable: boolean };
        if (!cancelled) setIsOnline(data.isAvailable);
      } catch {
        // keep the current toggle state if this fails
      }
    };

    loadProfile();
    loadSummary();
    const interval = setInterval(loadSummary, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // UPDATE (rider-GPS fix): while online, periodically read the browser's
  // real location (Geolocation API) and push it to /api/v1/rider/location
  // so the vendor's live delivery map can plot a real rider position
  // instead of the fabricated coordinates it used before. Silently does
  // nothing if the browser has no geolocation support or the rider denies
  // the permission prompt — there's no fallback fake location.
  useEffect(() => {
    if (!isOnline || typeof navigator === "undefined" || !navigator.geolocation) return;

    const pushLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetch("/api/v1/rider/location", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          }).catch(() => {});
        },
        () => {
          // Permission denied or unavailable — nothing to push.
        },
        { enableHighAccuracy: false, maximumAge: 15000, timeout: 10000 }
      );
    };

    pushLocation();
    const interval = setInterval(pushLocation, 20000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const handleToggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    fetch("/api/v1/rider/profile", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: next }),
    }).catch(() => setIsOnline(!next));
  };

  return (
    <RiderShell activePath="/rider">
      {/* Mobile Heading */}
      <div className="px-5 pt-5 lg:hidden">
        <h2 className="text-2xl font-bold">Good morning{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!</h2>
        <p className="mt-1 text-sm text-slate-500">Here&apos;s your delivery overview for today.</p>
      </div>

      <div className="space-y-6 p-5 pb-24 md:p-8 lg:p-10">
        {/* ================= ONLINE STATUS ================= */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <StatusToggleCard
            isOnline={isOnline}
            onToggle={handleToggleOnline}
          />
        </motion.section>

        {/* ================= AVAILABLE DELIVERIES (same-city auto-match) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <AvailableDeliveries />
        </motion.div>

        {/* ================= STATS ================= */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 300, damping: 25 }}
          >
            <StatCard
              icon={<Package className="h-4 w-4" />}
              title="Today's Deliveries"
              value={summary ? String(summary.todayDeliveries) : "—"}
              text="Delivered today"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.16, type: "spring", stiffness: 300, damping: 25 }}
          >
            <StatCard
              icon={<DollarSign className="h-4 w-4" />}
              title="Today's Earnings"
              value={summary ? `৳${summary.todayEarnings.toLocaleString()}` : "—"}
              text="From delivery fees earned today"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
          >
            <StatCard
              icon={<Bike className="h-4 w-4" />}
              title="Active Delivery"
              value={activeDelivery ? "1" : "0"}
              text={activeDelivery ? "In progress" : "None right now"}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.24, type: "spring", stiffness: 300, damping: 25 }}
          >
            <StatCard
              icon={<CheckCircle2 className="h-4 w-4" />}
              title="Delivery Success"
              value={summary ? `${summary.successRate}%` : "—"}
              text="Delivered vs. cancelled, all time"
            />
          </motion.div>
        </motion.section>

        {/* ================= ACTIVE DELIVERY + DEMAND ================= */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]"
        >
          {/* Active Delivery */}
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 8px 30px -12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            {loadingDelivery ? (
              <div className="flex items-center justify-center py-10 text-slate-300">
                <Clock3 className="h-5 w-5 animate-spin" />
              </div>
            ) : !activeDelivery ? (
              <div className="py-6 text-center">
                <Package className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm font-semibold text-slate-700">No active delivery</p>
                <p className="mt-1 text-xs text-slate-400">Accept a delivery from the list above to get started.</p>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-500">
                      {STEP_LABELS[activeDelivery.status]}
                    </p>
                    <h3 className="mt-1 text-lg font-bold">
                      {activeDelivery.restaurantName} → {activeDelivery.customerName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Order #{activeDelivery._id.slice(-6).toUpperCase()} &middot; {activeDelivery.deliveryAddress}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Total</p>
                    <p className="text-xl font-bold text-slate-900">৳{activeDelivery.totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-5">
                  <DeliveryStep active title="Accepted" />
                  <DeliveryStep
                    active={["preparing", "out_for_delivery", "delivered"].includes(activeDelivery.status)}
                    current={activeDelivery.status === "preparing"}
                    title="Picked Up"
                  />
                  <DeliveryStep
                    active={["out_for_delivery", "delivered"].includes(activeDelivery.status)}
                    current={activeDelivery.status === "out_for_delivery"}
                    title="On the Way"
                  />
                  <DeliveryStep active={activeDelivery.status === "delivered"} title="Delivered" />
                </div>
              </>
            )}
          </motion.div>

          {/* High Demand */}
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 8px 30px -12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">🔥 High Demand Zone</h3>
            </div>

            <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-lg bg-sky-100">
              <div className="absolute inset-0 opacity-40">
                <div className="h-full w-full bg-[radial-gradient(circle_at_30%_40%,#60a5fa_0,transparent_25%),radial-gradient(circle_at_70%_55%,#fb923c_0,transparent_25%)]" />
              </div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <MapPin className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Downtown area is currently experiencing high demand. Expect
              increased order volume.
            </p>

            <button
              type="button"
              className="mt-3 flex items-center gap-1 text-sm font-semibold text-green-500"
            >
              View Heatmap
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.section>

        {/* ================= CHAT (active delivery only) =================
            UPDATE (restaurant-rider chat fix): the rider now gets two
            separate chat threads for the active delivery — one with the
            customer (unchanged) and one with the restaurant, using the
            backend's already-existing "restaurant_rider" channel that
            nothing on the frontend previously used. */}
        {activeDelivery && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.35 }}
            className="grid grid-cols-1 gap-4 lg:grid-cols-2"
          >
            <OrderChatPanel orderId={activeDelivery._id} peerLabel="the customer" channel="customer_rider" />
            <OrderChatPanel orderId={activeDelivery._id} peerLabel="the restaurant" channel="restaurant_rider" />
          </motion.section>
        )}

        {/* ================= BOTTOM ================= */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* Performance */}
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 8px 30px -12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold">Today&apos;s Performance</h3>
                <p className="text-sm text-slate-500">
                  Your delivery performance
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MiniStat label="Completed" value={summary ? String(summary.performance.completed) : "—"} />
              <MiniStat
                label="Avg. Time"
                value={summary?.performance.avgMinutes != null ? `${summary.performance.avgMinutes}m` : "—"}
              />
              {/* UPDATE (rider-dashboard real-data fix): distance needs real
                  GPS tracking, which doesn't exist anywhere in this codebase
                  yet (see src/app/api/v1/rider/summary/route.ts's comment) —
                  shown as "—" instead of a made-up number. */}
              <MiniStat label="Distance" value="—" />
              <MiniStat label="Rating" value={summary ? summary.performance.rating.toFixed(1) : "—"} />
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 8px 30px -12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="mb-5 font-bold">Recent Activity</h3>

            <div className="space-y-4">
              {!summary || summary.recentActivity.length === 0 ? (
                <p className="text-sm text-slate-400">No deliveries yet — accepted orders will show up here.</p>
              ) : (
                summary.recentActivity.map((activity) => (
                  <Activity
                    key={activity.id}
                    icon={
                      activity.title === "Delivery completed" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : activity.title === "Order cancelled" ? (
                        <Clock3 className="h-4 w-4" />
                      ) : (
                        <Package className="h-4 w-4" />
                      )
                    }
                    title={activity.title}
                    text={activity.text}
                    time={activity.time}
                  />
                ))
              )}
            </div>
          </motion.div>
        </motion.section>
        <BottomStatusToggle
          isOnline={isOnline}
          onToggle={handleToggleOnline}
        />
      </div>
    </RiderShell>
  );
}

function StatusToggleCard({
  isOnline,
  onToggle,
}: {
  isOnline: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="w-full">
      <motion.div
        animate={{
          backgroundColor: isOnline ? "#F0FDF4" : "#FFFFFF",
          borderColor: isOnline ? "#BBF7D0" : "#E2E8F0",
        }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 rounded-2xl border p-4 shadow-sm transition-shadow duration-200 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              backgroundColor: isOnline ? "#124734" : "#F1F5F9",
              color: isOnline ? "#FFFFFF" : "#64748B",
              scale: isOnline ? [1, 1.15, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner"
          >
            <Bike className="h-6 w-6" />
          </motion.div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">
                {isOnline ? "You're online" : "You're offline"}
              </span>
              <motion.span
                animate={{
                  backgroundColor: isOnline ? "#22C55E" : "#94A3B8",
                }}
                className="inline-block h-2.5 w-2.5 rounded-full"
              />
            </div>
            <p className="text-xs font-medium text-slate-500 sm:text-sm">
              {isOnline
                ? "Available for deliveries"
                : "You are not receiving delivery requests"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle online status"
          aria-pressed={isOnline}
          className="relative rounded-full p-1 outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#124734]/30"
        >
          <motion.div
            animate={{
              backgroundColor: isOnline ? "#124734" : "#CBD5E1",
            }}
            transition={{ duration: 0.25 }}
            className="relative flex h-8 w-14 items-center rounded-full p-1 shadow-inner sm:h-9 sm:w-16"
          >
            <motion.span
              layout
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md sm:h-7 sm:w-7 ${
                isOnline ? "ml-auto" : "ml-0"
              }`}
            >
              <Power
                className={`h-3.5 w-3.5 transition-colors duration-200 ${
                  isOnline ? "text-[#124734]" : "text-slate-400"
                }`}
              />
            </motion.span>
          </motion.div>
        </button>
      </motion.div>
    </div>
  );
}

function BottomStatusToggle({
  isOnline,
  onToggle,
}: {
  isOnline: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 lg:bottom-6 lg:right-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.3 }}
    >
      <button
        type="button"
        onClick={onToggle}
        role="switch"
        aria-checked={isOnline}
        aria-label={isOnline ? "Go offline" : "Go online"}
        className={`flex items-center gap-2 rounded-full border px-3 py-2 shadow-lg backdrop-blur-md transition-colors ${
          isOnline
            ? "border-green-200 bg-white/95 text-green-800"
            : "border-slate-200 bg-white/95 text-slate-600"
        }`}
      >
        <Power className="h-4 w-4" />
        <span className="hidden text-xs font-bold sm:inline">
          {isOnline ? "Online" : "Offline"}
        </span>
        <span
          className={`relative flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
            isOnline ? "bg-green-600" : "bg-slate-300"
          }`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`h-5 w-5 rounded-full bg-white shadow ${
              isOnline ? "ml-auto" : "ml-0"
            }`}
          />
        </span>
      </button>
    </motion.div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  title,
  value,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-medium">{title}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{text}</p>
    </motion.div>
  );
}

/* ================= DELIVERY STEP ================= */

function DeliveryStep({
  title,
  active = false,
  current = false,
}: {
  title: string;
  active?: boolean;
  current?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
          current
            ? "border-orange-500 bg-orange-500"
            : active
            ? "border-green-500 bg-green-500"
            : "border-slate-300 bg-white"
        }`}
      >
        {active && (
          <CheckCircle2 className="h-4 w-4 text-white" />
        )}
      </div>
      <span
        className={`text-sm ${
          current
            ? "font-semibold text-orange-600"
            : active
            ? "font-medium text-slate-700"
            : "text-slate-400"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

/* ================= MINI STAT ================= */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}

/* ================= ACTIVITY ================= */

function Activity({
  icon,
  title,
  text,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="truncate text-xs text-slate-500">{text}</p>
      </div>
      <span className="whitespace-nowrap text-xs text-slate-400">{time}</span>
    </div>
  );
}
