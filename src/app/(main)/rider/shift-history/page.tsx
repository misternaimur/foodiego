"use client";

import {
  Bike,
  Clock3,
  DollarSign,
  History,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import RiderShell from "@/components/rider/RiderShell";
import { useRiderOrders } from "@/hooks/useRiderOrders";

// ============================================================
// UPDATE (rider-dashboard real-data fix): this page used to be a
// completely fabricated "shift clock-in/out" log (fake start/end times,
// fake durations, a fake 26-shift monthly total). This codebase has no
// shift/clock-in-out tracking anywhere — riders only have an
// online/offline toggle (see isAvailable on the Rider model), not
// timestamped shifts. Rather than keep inventing shift times, this page
// now shows a real day-by-day breakdown of completed deliveries and
// earnings grouped from the rider's actual OrderBooking history. Shift
// "Duration" columns are intentionally left out since there's no real
// clock-in/out data to compute them from.
// ============================================================

export default function RiderShiftHistoryPage() {
  const { orders, loading } = useRiderOrders();

  const days = useMemo(() => {
    const delivered = orders.filter((o) => o.status === "delivered");
    const byDay = new Map<string, { date: Date; deliveries: number; earnings: number }>();
    for (const o of delivered) {
      const d = new Date(o.updatedAt);
      const key = d.toDateString();
      const entry = byDay.get(key) || { date: d, deliveries: 0, earnings: 0 };
      entry.deliveries += 1;
      entry.earnings += o.deliveryFee || 0;
      byDay.set(key, entry);
    }
    return Array.from(byDay.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [orders]);

  const totals = useMemo(() => {
    const totalDeliveries = days.reduce((s, d) => s + d.deliveries, 0);
    const totalEarnings = days.reduce((s, d) => s + d.earnings, 0);
    const avgDeliveries = days.length > 0 ? totalDeliveries / days.length : 0;
    const avgEarnings = days.length > 0 ? totalEarnings / days.length : 0;
    return { totalDeliveries, totalEarnings, avgDeliveries, avgEarnings, activeDays: days.length };
  }, [days]);

  const todayKey = new Date().toDateString();
  const today = days.find((d) => d.date.toDateString() === todayKey);

  const shiftStats = [
    { icon: <History className="h-5 w-5" />, title: "Active Days", value: String(totals.activeDays), description: "Days with a completed delivery" },
    { icon: <Bike className="h-5 w-5" />, title: "Deliveries", value: String(totals.totalDeliveries), description: "All-time completed deliveries" },
    { icon: <TrendingUp className="h-5 w-5" />, title: "Avg / Active Day", value: totals.avgDeliveries.toFixed(1), description: "Deliveries per active day" },
    { icon: <DollarSign className="h-5 w-5" />, title: "Total Earnings", value: `$${totals.totalEarnings.toFixed(2)}`, description: "All-time earnings" },
  ];

  return (
    <RiderShell activePath="/rider/shift-history">
      {/* Mobile Heading */}
      <div className="px-5 pt-5 lg:hidden">
        <h2 className="text-2xl font-bold">Rider Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">View your delivery activity history here.</p>
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
              Rider
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Activity History
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              A day-by-day breakdown of your completed deliveries and
              earnings.
            </p>
          </div>
        </motion.section>

        {/* SUMMARY STATS */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {shiftStats.map((stat, i) => (
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
              <ShiftStat
                icon={stat.icon}
                title={stat.title}
                value={loading ? "—" : stat.value}
                description={stat.description}
              />
            </motion.div>
          ))}
        </motion.section>

        {/* TODAY */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                <Clock3 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Today</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-slate-400">Deliveries</p>
                <p className="mt-1 font-bold text-slate-900">{today?.deliveries ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Earnings</p>
                <p className="mt-1 font-bold text-green-600">${(today?.earnings ?? 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* DAILY HISTORY TABLE */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Daily Activity</h2>
              <p className="mt-1 text-sm text-slate-500">Days you completed at least one delivery.</p>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-sm text-slate-400">Loading…</div>
          ) : days.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">No completed deliveries yet.</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Deliveries</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {days.map((day, i) => (
                      <motion.tr
                        key={day.date.toDateString()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-slate-800">
                            {day.date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {day.date.toLocaleDateString([], { weekday: "long" })}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Bike className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-semibold text-slate-800">{day.deliveries}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-green-600">${day.earnings.toFixed(2)}</p>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {days.map((day, i) => (
                  <motion.div
                    key={day.date.toDateString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {day.date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {day.date.toLocaleDateString([], { weekday: "long" })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Deliveries</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{day.deliveries}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Earnings</p>
                        <p className="mt-1 text-sm font-bold text-green-600">${day.earnings.toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.section>

        {/* PERFORMANCE SUMMARY */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Overall Performance</h2>
              <p className="mt-1 text-sm text-slate-500">Averages across all your active days.</p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MiniStat label="Active Days" value={String(totals.activeDays)} />
            <MiniStat label="Avg. Deliveries" value={totals.avgDeliveries.toFixed(1)} />
            <MiniStat label="Avg. Earnings" value={`$${totals.avgEarnings.toFixed(2)}`} />
            <MiniStat label="Total Earnings" value={`$${totals.totalEarnings.toFixed(2)}`} />
          </div>
        </motion.section>
      </div>
    </RiderShell>
  );
}

/* SHIFT STAT */
function ShiftStat({
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

/* MINI STAT */
function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}
