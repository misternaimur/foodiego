"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Zap,
  Loader2,
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs transition-transform hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
          {title}
        </span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-extrabold text-gray-900">
          {animate ? (
            <AnimatedCounter value={value} prefix={prefix} duration={1500} />
          ) : (
            <span>{prefix}{value.toLocaleString()}</span>
          )}
        </span>
        <span
          className={`text-xs font-bold ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isPositive ? "+" : ""}{change}%
        </span>
      </div>
    </motion.div>
  );
}

function LiveVelocityCard({ ordersPerMinute }: { ordersPerMinute: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
          Live Velocity
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-[#10B981]">
          <Zap size={18} />
        </div>
      </div>
      <div className="mt-3">
        <span className="text-2xl font-extrabold text-gray-900">
          {ordersPerMinute}
          <span className="text-sm font-semibold text-gray-500">
            {" "}
            orders/min
          </span>
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#00A36C] via-[#00B37E] to-[#4DCA9E]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

function RevenueTrendChart({ data }: { data: AnalyticsData["revenueTrend"] }) {
  const gradientColors = ["#00A36C", "#00B37E", "#4DCA9E"];

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Revenue Trend
        </h2>
        <span className="text-xs text-gray-400">Last 7 days</span>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[0]} stopOpacity={0.3} />
                <stop offset="100%" stopColor={gradientColors[0]} stopOpacity={0.05} />
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
              tickFormatter={(v: number) => `৳${v / 1000}k`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "8px 12px",
              }}
              labelStyle={{ fontSize: 11, color: "#374151" }}
              itemStyle={{ fontSize: 11, color: "#00A36C", padding: 0 }}
            />
            <Area
              type="natural"
              dataKey="revenue"
              stroke={gradientColors[0]}
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={{ r: 3, fill: gradientColors[0] }}
              activeDot={{ r: 5, fill: gradientColors[0], stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CategoryDonutChart({ data }: { data: AnalyticsData["categoryData"] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerText = `${data.length} Categories`;

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Category Split
        </h2>
      </div>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "8px 12px",
              }}
              formatter={(value) => [`${value}%`, "Share"]}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-current"
            >
              <tspan className="text-2xl font-bold text-gray-900">{centerText}</tspan>
              <tspan
                x="50%"
                dy="1.2em"
                className="text-xs fill-gray-400"
              >
                {total}% total
              </tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-1">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">{item.name}</span>
            <span className="ml-auto font-semibold text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderVolumeBarChart({ data }: { data: AnalyticsData["orderVolume"] }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Order Volume
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Daily</span>
          <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-between px-1">
              <span className="text-[9px] text-gray-500">D</span>
              <span className="text-[9px] text-gray-500">W</span>
            </div>
            <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
          </div>
        </div>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "8px 12px",
              }}
              labelStyle={{ fontSize: 11, color: "#374151" }}
              itemStyle={{ fontSize: 11, color: "#00A36C", padding: 0 }}
            />
            <Bar
              dataKey="orders"
              radius={[6, 6, 0, 0]}
              fill="#00A36C"
              barSize={20}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TopPerformersList({ data }: { data: AnalyticsData["topPerformers"] }) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue));

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Top Performers
        </h2>
        <span className="text-xs text-gray-400">{data.length} items</span>
      </div>
      <div className="space-y-4">
        {data.map((item, idx) => {
          const percentage = (item.revenue / maxRevenue) * 100;
          return (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  ৳{item.revenue.toLocaleString()}
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { data: analytics, isLoading, isError } = useVendorAnalytics();

  useVendorSocket();

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
        <p className="text-sm text-rose-700">
          Unable to load analytics data. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 size={32} className="text-gray-300 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales & Analytics</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Real-time performance metrics and insights for your restaurant.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <MetricCard
          title="Total Sales"
          value={analytics.totalSales}
          change={analytics.salesChange}
          icon={<DollarSign size={18} />}
          iconBg="bg-emerald-50 text-[#10B981]"
          prefix="৳"
          animate={true}
          delay={0.05}
        />
        <MetricCard
          title="Total Orders"
          value={analytics.totalOrders}
          change={analytics.ordersChange}
          icon={<ShoppingBag size={18} />}
          iconBg="bg-blue-50 text-blue-600"
          animate={true}
          delay={0.1}
        />
        <MetricCard
          title="Avg. Order Value"
          value={analytics.avgOrderValue}
          change={analytics.avgOrderChange}
          icon={<TrendingUp size={18} />}
          iconBg="bg-amber-50 text-amber-600"
          prefix="৳"
          animate={true}
          delay={0.15}
        />
        <LiveVelocityCard ordersPerMinute={analytics.ordersPerMinute} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col gap-6 lg:flex-row"
      >
        <div className="lg:w-[65%]">
          <RevenueTrendChart data={analytics.revenueTrend} />
        </div>
        <div className="lg:w-[35%]">
          <CategoryDonutChart data={analytics.categoryData} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex flex-col gap-6 lg:flex-row"
      >
        <div className="lg:w-[50%]">
          <OrderVolumeBarChart data={analytics.orderVolume} />
        </div>
        <div className="lg:w-[50%]">
          <TopPerformersList data={analytics.topPerformers} />
        </div>
      </motion.div>
    </motion.div>
  );
}
