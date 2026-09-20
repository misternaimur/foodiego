"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  ChevronDown,
  ShoppingBag,
  Clock,
  TrendingUp,
  Star,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import Image from "next/image";
import { useDashboardStats, useOrderMutation, useSalesAnalytics } from "@/hooks/useVendorQueries";
import { staggerContainer, staggerItem, springTransition } from "@/app/(main)/vendor/components/motion";

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 min-w-[140px]">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-bold text-emerald-700 mt-1">
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  delay: number;
}

function MetricCard({ title, value, change, changePositive, icon, iconBg, delay }: MetricCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{title}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-black text-slate-900">{value}</span>
        {change && (
          <span className={`text-xs font-bold ${changePositive ? "text-emerald-600" : "text-rose-600"}`}>
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 px-6 py-12 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <ShoppingBag size={34} className="text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default function DashboardOverview() {
  const { data: stats, isLoading, isError } = useDashboardStats();
  const { data: salesAnalytics } = useSalesAnalytics();
  const updateOrder = useOrderMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 px-6 py-16 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="text-center">
          <LoaderCircle size={30} className="mx-auto animate-spin text-emerald-500" />
          <p className="mt-3 text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
        <AlertCircle size={28} className="mx-auto mb-2" />
        Unable to load dashboard statistics. Please try again later.
      </div>
    );
  }

  const todaySales = stats.todaySales ?? 0;
  const ordersCount = stats.ordersCount ?? 0;
  const pendingCount = stats.pendingCount ?? 0;
  const activeCount = stats.activeCount ?? 0;
  const rating = stats.rating ?? 0;
  const totalWeekly = salesAnalytics?.totalWeekly ?? stats.totalWeekly ?? 0;
  const salesTrend = salesAnalytics?.salesData?.map((d) => ({ day: d.day, revenue: d.revenue })) ?? stats.salesTrend ?? [];
  const bestSellers = stats.bestSellers ?? [];
  const ratingBreakdown = stats.ratingBreakdown ?? [];
  const recentOrders = stats.recentOrders ?? [];
  const formatCurrency = (value: number) => `$${(value ?? 0).toLocaleString()}`;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={staggerItem} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">Restaurant command center</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Good morning</h1>
          <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening with your restaurant today.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Calendar size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm font-semibold text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 sm:w-44">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard title="Today's Sales" value={formatCurrency(todaySales)} change="+12.5%" changePositive icon={<TrendingUp size={18} />} iconBg="bg-emerald-50 text-emerald-600" delay={0.04} />
        <MetricCard title="Orders" value={(ordersCount ?? 0).toString()} change="+8.2%" changePositive icon={<ShoppingBag size={18} />} iconBg="bg-sky-50 text-sky-600" delay={0.08} />
        <MetricCard title="Pending" value={(pendingCount ?? 0).toString()} icon={<Clock size={18} />} iconBg="bg-amber-50 text-amber-600" delay={0.12} />
        <MetricCard title="Active" value={(activeCount ?? 0).toString()} icon={<ShoppingBag size={18} />} iconBg="bg-violet-50 text-violet-600" delay={0.16} />
        <MetricCard title="Rating" value={`${(rating ?? 0).toFixed(1)} / 5`} icon={<Star size={18} />} iconBg="bg-yellow-50 text-yellow-600" delay={0.2} />
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-800">Sales Overview</h2>
              <p className="mt-0.5 text-xs text-slate-400">Revenue performance over the last 7 days</p>
            </div>
            <span className="text-xs font-bold text-slate-500">Total: {formatCurrency(totalWeekly)}</span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} tickMargin={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748B" }} tickCount={5} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                  dot={{ r: 4, fill: "#10B981", stroke: "#ffffff", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#10B981", stroke: "#ffffff", strokeWidth: 2.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800">Best Selling Items</h2>
            <Link href="/vendor?tab=menu" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View Menu</Link>
          </div>
          <div className="space-y-3">
            {bestSellers.length === 0 && <EmptyState message="No bestselling items yet." />}
            {bestSellers.map((item, index) => (
              <motion.div key={item.id} variants={staggerItem} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-2">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" /> : <ShoppingBag size={18} className="m-auto text-slate-300" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.orders ?? 0} orders</p>
                </div>
                <span className="flex h-7 shrink-0 items-center rounded-full bg-emerald-50 px-2.5 text-xs font-black text-emerald-700">#{index + 1}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-black text-slate-800">Recent Orders</h2>
              <p className="mt-0.5 text-xs text-slate-400">Latest activity from your restaurant</p>
            </div>
            <Link href="/vendor?tab=orders" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700">View All <ExternalLink size={11} /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">No recent orders found.</td></tr>}
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-slate-900">{order.id}</td>
                    <td className="px-4 py-3 text-slate-600">{order.customer}</td>
                    <td className="px-4 py-3 text-slate-500">{order.items}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">{formatCurrency(order.amount)}</td>
                    <td className="px-4 py-3 text-slate-500">{order.time}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${order.status === "new" ? "bg-sky-50 text-sky-700 border border-sky-200" : order.status === "preparing" ? "bg-amber-50 text-amber-700 border border-amber-200" : order.status === "delivered" ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                        {order.status === "delivered" && <CheckCircle size={10} />}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800">Ratings Breakdown</h2>
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
          </div>
          <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-4">
            <span className="text-4xl font-black text-slate-900">{(rating ?? 0).toFixed(1)}</span>
            <Star size={25} className="text-yellow-400 fill-yellow-400" />
          </div>
          <div className="space-y-3">
            {ratingBreakdown.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No ratings yet.</p>}
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-2">
                <span className="w-8 text-xs font-bold text-slate-600">{item.stars}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" initial={{ width: 0 }} animate={{ width: `${item.percentage ?? 0}%` }} transition={springTransition} />
                </div>
                <span className="w-9 text-right text-xs font-bold text-slate-500">{item.percentage ?? 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
