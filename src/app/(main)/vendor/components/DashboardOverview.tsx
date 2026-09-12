"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Image from "next/image";
import type { DashboardStats } from "@/hooks/useVendorQueries";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  textColor?: string;
  badge?: React.ReactNode;
  delay: number;
}

function MetricCard({
  title,
  value,
  change,
  changePositive,
  icon,
  iconBg,
  textColor = "text-gray-900",
  badge,
  delay,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
          {title}
        </span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className={`text-2xl font-extrabold ${textColor}`}>{value}</span>
        {badge && <div>{badge}</div>}
      </div>
      {change && (
        <span
          className={`mt-1 flex items-center gap-0.5 text-xs font-medium ${
            changePositive
              ? "text-emerald-600"
              : "text-rose-600"
          }`}
        >
          {change}
        </span>
      )}
    </motion.div>
  );
}

export default function DashboardOverview() {

  const { data: stats, isLoading, isError } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/vendor/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 1000 * 60,
  });

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
        <p className="text-sm text-rose-700">
          Unable to load dashboard statistics. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const {
    todaySales,
    ordersCount,
    pendingCount,
    activeCount,
    rating,
    salesTrend,
    totalWeekly,
    bestSellers,
    ratingBreakdown,
    recentOrders,
  } = stats;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good Morning 👋
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Here&apos;s what&apos;s happening with your restaurant today.
          </p>
        </div>

        <div className="relative">
          <select className="appearance-none rounded-xl border border-[#E5E7EB] bg-white pl-9 pr-3 py-2 text-sm font-semibold text-gray-700 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <Calendar
            size={16}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <ChevronDown
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <MetricCard
          title="Today's Sales"
          value={`৳${todaySales.toLocaleString()}`}
          change="+12.5%"
          changePositive
          icon={<TrendingUp size={18} />}
          iconBg="bg-emerald-50 text-[#10B981]"
          badge={
            <span className="text-xs font-bold text-emerald-600">12.5% ↑</span>
          }
          delay={0.1}
        />

        <MetricCard
          title="Orders"
          value={ordersCount.toString()}
          change="+8.2%"
          changePositive
          icon={<ShoppingBag size={18} />}
          iconBg="bg-blue-50 text-blue-600"
          delay={0.12}
        />

        <MetricCard
          title="Pending"
          value={pendingCount.toString()}
          icon={<Clock size={18} />}
          iconBg="bg-rose-50 text-rose-600"
          textColor="text-rose-700"
          delay={0.14}
        />

        <MetricCard
          title="Active"
          value={activeCount.toString()}
          icon={<ShoppingBag size={18} />}
          iconBg="bg-amber-50 text-amber-600"
          delay={0.16}
        />

        <MetricCard
          title="Rating"
          value={`${rating} ★`}
          icon={<Star size={18} />}
          iconBg="bg-yellow-50 text-yellow-600"
          delay={0.18}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      >
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Sales Overview
            </h2>
            <span className="text-xs text-gray-400">
              Total: ৳{totalWeekly.toLocaleString()}
            </span>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickMargin={6}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickCount={5}
                  tickFormatter={(v) => `৳${v / 1000}k`}
                  width={45}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    padding: "8px 12px",
                  }}
                  labelStyle={{ fontSize: 11, color: "#374151" }}
                  itemStyle={{ fontSize: 11, color: "#10B981", padding: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                  dot={{ r: 3, fill: "#10B981" }}
                  activeDot={{ r: 5, fill: "#10B981", stroke: "#ffffff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Best Selling Items
            </h2>
            <a
              href="/vendor/menu"
              className="text-xs font-semibold text-[#10B981] hover:text-[#059669]"
            >
              View Menu Analytics
            </a>
          </div>
          <div className="space-y-3">
            {bestSellers.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.25 + idx * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                      <span className="text-xs">No img</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.orders} orders</p>
                </div>
                <div className="flex h-6 items-center rounded-full bg-emerald-50 px-2 text-xs font-bold text-[#10B981]">
                  #{idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-5"
      >
        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Recent Orders
            </h2>
            <a
              href="/vendor?tab=orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#10B981] hover:text-[#059669]"
            >
              View All
              <ExternalLink size={11} />
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-gray-50/60">
                  <th className="px-4 py-2.5 font-bold text-gray-400 uppercase tracking-wider">
                    ORDER ID
                  </th>
                  <th className="px-4 py-2.5 font-bold text-gray-400 uppercase tracking-wider">
                    CUSTOMER
                  </th>
                  <th className="px-4 py-2.5 font-bold text-gray-400 uppercase tracking-wider">
                    ITEMS
                  </th>
                  <th className="px-4 py-2.5 text-right font-bold text-gray-400 uppercase tracking-wider">
                    AMOUNT
                  </th>
                  <th className="px-4 py-2.5 font-bold text-gray-400 uppercase tracking-wider">
                    TIME
                  </th>
                  <th className="px-4 py-2.5 font-bold text-gray-400 uppercase tracking-wider">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-bold text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">{order.customer}</td>
                    <td className="px-4 py-2.5 text-gray-500">{order.items}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                      ৳{order.amount}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">{order.time}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                          order.status === "new"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : order.status === "preparing"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : order.status === "accepted"
                            ? "bg-sky-50 text-sky-700 border border-sky-200"
                            : order.status === "delivered"
                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {order.status === "new" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        )}
                        {order.status === "preparing" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        )}
                        {order.status === "accepted" && (
                          <CheckCircle size={10} />
                        )}
                        {order.status === "delivered" && (
                          <CheckCircle size={10} />
                        )}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold text-gray-500 uppercase tracking-wider">
            Ratings Breakdown
          </h2>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-extrabold text-gray-900">{rating}</span>
                <Star size={24} className="text-yellow-400 fill-current" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Overall Rating</p>
            </div>

            <div className="space-y-3">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <span className="flex w-10 items-center text-xs font-medium text-gray-700">
                    {item.stars}★
                  </span>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-yellow-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.6, delay: 0.2 + item.stars * 0.1 }}
                      />
                    </div>
                  </div>
                  <span className="w-10 text-right text-xs font-medium text-gray-500">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
