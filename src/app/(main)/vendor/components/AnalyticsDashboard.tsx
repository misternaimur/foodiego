"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useVendorSocket } from "@/hooks/useVendorSocket";
import { useVendorAnalytics, type AnalyticsData } from "@/hooks/useVendorAnalytics";
import { springTransition, staggerContainer, staggerItem } from "@/app/(main)/vendor/components/motion";

function AnimatedCounter({
  value,
  prefix = "",
  duration = 1500,
}: {
  value: number;
  prefix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = performance.now();
    const startValue = display;
    const delta = value - startValue;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(startValue + delta * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration, display]);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
    </span>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon,
  iconBg,
  prefix = "",
  animate = true,
  delay = 0,
}: {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
  prefix?: string;
  animate?: boolean;
  delay?: number;
}) {
  const isPositive = change >= 0;
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{title}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-black text-slate-900">
          {animate ? (
            <AnimatedCounter value={value} prefix={prefix} duration={1500} />
          ) : (
            <span>{prefix}{value.toLocaleString()}</span>
          )}
        </span>
        {change !== 0 && (
          <span className={`text-xs font-bold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
            {isPositive ? "+" : ""}{change}%
          </span>
        )}
      </div>
    </motion.div>
  );
}

function LiveVelocityCard({ ordersPerMinute }: { ordersPerMinute: number }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Live Velocity</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><Zap size={18} /></div>
      </div>
      <div className="mt-3">
        <span className="text-2xl font-black text-slate-900">{ordersPerMinute ?? 0}</span>
        <span className="text-sm font-semibold text-slate-500"> orders/min</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

function RevenueTrendChart({ data }: { data: AnalyticsData["revenueTrend"] }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-800">Revenue Trend</h2>
          <p className="mt-0.5 text-xs text-slate-400">Last 7 days</p>
        </div>
        <span className="text-xs font-bold text-slate-500">Total: ৳{(data?.reduce((s, d) => s + (d.revenue ?? 0), 0) ?? 0 / 1000).toFixed(0)}k</span>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} tickMargin={6} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} tickCount={5} tickFormatter={(v) => `৳${v / 1000}k`} width={46} />
            <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.96)", border: "1px solid #E2E8F0", borderRadius: 12, padding: "8px 12px" }} labelStyle={{ fontSize: 11, color: "#334155" }} itemStyle={{ fontSize: 11, color: "#059669" }} />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#revGradient)" dot={{ r: 3, fill: "#10B981" }} activeDot={{ r: 5, fill: "#10B981", stroke: "#ffffff", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { data: analytics, isLoading, isError } = useVendorAnalytics();

  useVendorSocket();

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
        <AlertCircle size={28} className="mx-auto mb-2" />
        Unable to load analytics data. Please try again later.
      </div>
    );
  }

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md px-6 py-16 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="text-center">
          <Loader2 size={30} className="mx-auto animate-spin text-teal-500" />
          <p className="mt-3 text-sm text-slate-500">Loading analytics.</p>
        </div>
      </div>
    );
  }

  const totalWeekly = analytics.revenueTrend?.reduce((s, d) => s + (d.revenue ?? 0), 0) ?? 0;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-teal-600 uppercase">Performance insights</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Sales & Analytics</h1>
          <p className="mt-1 text-sm text-slate-500">Real-time metrics and revenue intelligence for your restaurant.</p>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Sales" value={(analytics.totalSales ?? 0)} change={analytics.salesChange ?? 0} icon={<DollarSign size={18} />} iconBg="bg-emerald-50 text-emerald-600" prefix="৳" delay={0.05} />
        <MetricCard title="Total Orders" value={(analytics.totalOrders ?? 0)} change={analytics.ordersChange ?? 0} icon={<ShoppingBag size={18} />} iconBg="bg-sky-50 text-sky-600" delay={0.1} />
        <MetricCard title="Avg. Order Value" value={(analytics.avgOrderValue ?? 0)} change={analytics.avgOrderChange ?? 0} icon={<TrendingUp size={18} />} iconBg="bg-amber-50 text-amber-600" prefix="৳" delay={0.15} />
        <LiveVelocityCard ordersPerMinute={analytics.ordersPerMinute ?? 0} />
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueTrendChart data={analytics.revenueTrend ?? []} />
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800">Revenue Trend</h2>
            <span className="text-xs font-bold text-slate-500">Weekly</span>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueTrend ?? []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} tickMargin={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} tickCount={5} tickFormatter={(v) => `৳${v / 1000}k`} width={46} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.96)", border: "1px solid #E2E8F0", borderRadius: 12 }} labelStyle={{ fontSize: 11, color: "#334155" }} itemStyle={{ fontSize: 11, color: "#0D9488" }} />
                <Area type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={2} fill="url(#areaDash)" dot={{ r: 3, fill: "#0D9488" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800">Order Volume</h2>
            <span className="text-xs font-bold text-slate-500">Daily</span>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.orderVolume ?? []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} tickMargin={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }} tickCount={5} width={40} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.96)", border: "1px solid #E2E8F0", borderRadius: 12 }} />
                <Bar dataKey="orders" radius={[6, 6, 0, 0]} fill="#10B981" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <h2 className="text-sm font-black text-slate-800 mb-4">Top Performers</h2>
          <div className="space-y-3">
            {(analytics.topPerformers ?? []).map((item, idx) => {
              const maxRev = Math.max(...(analytics.topPerformers ?? []).map((p) => p.revenue));
              const pct = maxRev > 0 ? Math.round((item.revenue / maxRev) * 100) : 0;
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: `${item.color}20`, color: item.color }}>#{idx + 1}</span>
                      <span className="font-semibold text-sm text-slate-900">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">৳{(item.revenue ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: idx * 0.1 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
