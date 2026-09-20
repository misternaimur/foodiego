"use client";

import {
  Bike,
  DollarSign,
  TrendingUp,
  Wallet,
  CalendarDays,
  Package,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import RiderShell from "@/components/rider/RiderShell";
import { useRiderOrders } from "@/hooks/useRiderOrders";

// ============================================================
// UPDATE (rider-dashboard real-data fix): every number on this page used
// to be hardcoded ("$142.50", "$684.75", a fake weekly bar chart, a fake
// "$412.50 paid on Aug 20" payout, 4 fake recent-earnings rows). All of
// it is now computed from this rider's real delivered OrderBooking
// records, using `deliveryFee` as the per-delivery earning (there is no
// separate rider-payout ledger in this codebase — same call made in
// src/app/api/v1/rider/summary/route.ts). There is also no real payout/
// withdrawal system yet, so the "Payout Summary" card now shows the
// rider's real lifetime earnings total instead of a fabricated payout
// date/status.
// ============================================================

export default function RiderEarningsPage() {
  const { orders, loading } = useRiderOrders();

  const delivered = useMemo(
    () => orders.filter((o) => o.status === "delivered"),
    [orders]
  );

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const sum = (list: typeof delivered) => list.reduce((s, o) => s + (o.deliveryFee || 0), 0);

    const todayList = delivered.filter((o) => new Date(o.updatedAt) >= todayStart);
    const weekList = delivered.filter((o) => new Date(o.updatedAt) >= weekStart);
    const monthList = delivered.filter((o) => new Date(o.updatedAt) >= monthStart);

    const perDelivery = delivered.length > 0 ? sum(delivered) / delivered.length : 0;

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayTotals = new Array(7).fill(0) as number[];
    for (const o of weekList) {
      dayTotals[new Date(o.updatedAt).getDay()] += o.deliveryFee || 0;
    }
    const maxDay = Math.max(1, ...dayTotals);
    const bars = dayLabels.map((label, i) => ({
      label,
      value: `$${dayTotals[i].toFixed(0)}`,
      height: `${Math.max(4, Math.round((dayTotals[i] / maxDay) * 100))}%`,
    }));

    return {
      today: sum(todayList),
      week: sum(weekList),
      weekCount: weekList.length,
      month: sum(monthList),
      perDelivery,
      lifetime: sum(delivered),
      bars,
    };
  }, [delivered]);

  const recent = useMemo(
    () =>
      [...delivered]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 6),
    [delivered]
  );

  const earningStats = [
    { icon: <DollarSign className="h-5 w-5" />, title: "Today's Earnings", value: `$${stats.today.toFixed(2)}`, description: "From today's completed deliveries" },
    { icon: <Wallet className="h-5 w-5" />, title: "This Week", value: `$${stats.week.toFixed(2)}`, description: `${stats.weekCount} completed deliveries` },
    { icon: <TrendingUp className="h-5 w-5" />, title: "This Month", value: `$${stats.month.toFixed(2)}`, description: "Total this calendar month" },
    { icon: <Bike className="h-5 w-5" />, title: "Per Delivery", value: `$${stats.perDelivery.toFixed(2)}`, description: "Average payout" },
  ];

  return (
    <RiderShell activePath="/rider/earnings">
      {/* Mobile Heading */}
      <div className="px-5 pt-5 lg:hidden">
        <h2 className="text-2xl font-bold">Rider Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Track your earnings here.</p>
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
            <p className="mb-2 text-4xl font-bold tracking-tight text-green-500">
              Rider Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Earnings
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Track your earnings from completed deliveries.
            </p>
          </div>
        </motion.section>

        {/* EARNING STATS */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {earningStats.map((stat, i) => (
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
              <EarningStat
                icon={stat.icon}
                title={stat.title}
                value={loading ? "—" : stat.value}
                description={stat.description}
              />
            </motion.div>
          ))}
        </motion.section>

        {/* OVERVIEW + PAYOUT */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]"
        >
          {/* Earnings Overview */}
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 8px 30px -12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Earnings Overview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your earnings performance this week
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
                <CalendarDays className="h-4 w-4" />
                This Week
              </div>
            </div>

            {/* Simple Chart */}
            <div className="mt-8 flex h-52 items-end justify-between gap-3 border-b border-slate-100 px-2">
              {stats.bars.map((bar) => (
                <Bar key={bar.label} height={bar.height} label={bar.label} value={bar.value} />
              ))}
            </div>
          </motion.div>

          {/* Lifetime Earnings */}
          <motion.div
            whileHover={{ y: -2, boxShadow: "0 8px 30px -12px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Lifetime Earnings</h2>
                <p className="mt-1 text-sm text-slate-500">All completed deliveries</p>
              </div>
              <Wallet className="h-5 w-5 text-green-500" />
            </div>

            {/* Total */}
            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-slate-500">Total Earned</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                ${stats.lifetime.toFixed(2)}
              </p>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Completed deliveries</span>
                <span className="text-sm font-semibold text-slate-800">{delivered.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Average per delivery</span>
                <span className="text-sm font-semibold text-slate-800">${stats.perDelivery.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* RECENT EARNINGS */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Earnings</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest completed deliveries and payouts.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-400">Loading…</div>
            ) : recent.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">No completed deliveries yet.</div>
            ) : (
              recent.map((row) => (
                <motion.div
                  key={row._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <EarningRow
                    restaurant={row.restaurantName}
                    order={row._id.slice(-6).toUpperCase()}
                    time={new Date(row.updatedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                    amount={`$${row.deliveryFee.toFixed(2)}`}
                  />
                </motion.div>
              ))
            )}
          </div>
        </motion.section>
      </div>
    </RiderShell>
  );
}

/* EARNING STAT */
function EarningStat({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
        {icon}
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

/* BAR */
function Bar({
  height,
  label,
  value,
}: {
  height: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">
      <span className="text-[10px] text-slate-400">{value}</span>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[42px] rounded-t-lg bg-green-400 transition hover:bg-green-500"
        style={{ height }}
      />
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

/* EARNING ROW */
function EarningRow({
  restaurant,
  order,
  time,
  amount,
}: {
  restaurant: string;
  order: string;
  time: string;
  amount: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between md:p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50">
          <Package className="h-5 w-5 text-green-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{restaurant}</h3>
          <p className="mt-1 text-xs text-slate-400">
            Order #{order} • {time}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-8 sm:justify-end">
        <div className="text-right">
          <p className="text-xs text-slate-400">Earnings</p>
          <p className="mt-1 text-lg font-bold text-green-600">+{amount}</p>
        </div>
      </div>
    </div>
  );
}
