// src/components/dashboard/SalesAnalytics.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Receipt,
  DollarSign,
  Download,
  Award,
  ChevronDown,
  Sparkles,
  Flame,
  Zap,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

type DateRange = 'Last 7 Days' | 'Last 30 Days' | 'This Year';

const revenueData = [
  { day: 'Mon', sales: 4200 },
  { day: 'Tue', sales: 3800 },
  { day: 'Wed', sales: 5100 },
  { day: 'Thu', sales: 4700 },
  { day: 'Fri', sales: 6200 },
  { day: 'Sat', sales: 7800 },
  { day: 'Sun', sales: 6900 },
];

const categoryData = [
  { name: 'Burgers', value: 45, color: '#10B981' },
  { name: 'Pizza', value: 25, color: '#8B5CF6' },
  { name: 'Drinks', value: 15, color: '#3B82F6' },
  { name: 'Sides', value: 10, color: '#F59E0B' },
  { name: 'Desserts', value: 5, color: '#EC4899' },
];

const orderVolumeData = [
  { day: 'Mon', daily: 85, weekly: 120 },
  { day: 'Tue', daily: 78, weekly: 115 },
  { day: 'Wed', daily: 92, weekly: 130 },
  { day: 'Thu', daily: 88, weekly: 125 },
  { day: 'Fri', daily: 105, weekly: 145 },
  { day: 'Sat', daily: 120, weekly: 168 },
  { day: 'Sun', daily: 110, weekly: 155 },
];

const topPerformers = [
  { name: 'Classic Cheeseburger', revenue: 32400, percent: 100, badge: '🔥 Hot' },
  { name: 'Spicy Chicken Pizza', revenue: 28150, percent: 87, badge: '⭐ Popular' },
  { name: 'Loaded Fries', revenue: 15800, percent: 49, badge: '🍟 Favorite' },
  { name: 'Truffle Smashburger', revenue: 12800, percent: 39, badge: '👑 Chef Choice' },
  { name: 'Iced Matcha Latte', revenue: 9400, percent: 29, badge: '🥤 Refreshing' },
];

const metricCards = [
  {
    title: 'Total Sales',
    value: '৳148,500',
    trend: '+8.2%',
    trendUp: true,
    icon: DollarSign,
    bgGlow: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500 text-white shadow-emerald-500/30',
  },
  {
    title: 'Total Orders',
    value: '1,248',
    trend: '+12.4%',
    trendUp: true,
    icon: ShoppingBag,
    bgGlow: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-500 text-white shadow-blue-500/30',
  },
  {
    title: 'Avg. Order Value',
    value: '৳119',
    trend: '-1.5%',
    trendUp: false,
    icon: Receipt,
    bgGlow: 'from-purple-500/10 via-violet-500/5 to-transparent',
    iconBg: 'bg-purple-500 text-white shadow-purple-500/30',
  },
  {
    title: 'Live Revenue Velocity',
    value: 'Active',
    trend: '৳2,450/hr',
    trendUp: true,
    icon: Zap,
    bgGlow: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500 text-white shadow-amber-500/30',
  },
];

interface CustomTooltipPayload {
  name: string;
  value: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        <p className="text-xs font-bold text-gray-400 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-extrabold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            {entry.name}: {typeof entry.value === 'number' ? `৳${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SalesAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange>('Last 7 Days');

  return (
    <div className="space-y-8 pb-12">
      {/* Fun & Gorgeous Page Header */}
      <DashboardPageHeader
        title="Sales & Analytics 🚀"
        description="Track live performance, customer cravings, and revenue momentum in real-time."
        action={
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="appearance-none bg-white border border-gray-200 text-gray-900 text-xs font-bold px-4 py-2.5 pr-10 rounded-2xl focus:outline-none focus:border-[#10B981] transition-all cursor-pointer shadow-xs hover:border-gray-300"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Year">This Year</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#10B981] text-white font-bold text-xs py-2.5 px-4 rounded-2xl hover:bg-[#059669] transition-all shadow-md shadow-emerald-500/20"
            >
              <Download size={15} />
              Export CSV
            </motion.button>
          </div>
        }
      />

      {/* Fun & Playful Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 20 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGlow} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl shadow-lg ${card.iconBg}`}>
                    <Icon size={20} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full ${
                      card.trendUp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    }`}
                  >
                    {card.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {card.trend}
                  </span>
                </div>
                <p className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-1">{card.title}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend Area Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold">
                <Sparkles size={16} />
              </div>
              <h3 className="text-base font-extrabold text-gray-900">Revenue Momentum</h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Live Analytics</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10B981"
                  strokeWidth={3.5}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Split Donut Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-extrabold text-gray-900">Popular Categories</h3>
            <span className="text-xs font-bold text-gray-400">Sales share</span>
          </div>
          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-extrabold text-gray-400">TOP</span>
              <span className="text-sm font-black text-gray-900">Burgers</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 bg-gray-50/80 p-2 rounded-xl">
                <div className="h-3 w-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-gray-700 truncate">{item.name}</span>
                <span className="text-xs font-extrabold text-gray-900 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Order Volume & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Volume Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-extrabold text-gray-900">Order Volume Analysis</h3>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-md bg-[#10B981]"></span> Daily Orders</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-md bg-[#8B5CF6]"></span> Weekly Target</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderVolumeData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="daily" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="weekly" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Performers List with Fun Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-8 lg:col-start-9 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs" // Auto adjusts to lg:col-span-4 properly via CSS grid or span
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
                <Flame size={18} />
              </div>
              <h3 className="text-base font-extrabold text-gray-900">Trending Items</h3>
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Top Sellers</span>
          </div>
          <div className="space-y-4">
            {topPerformers.map((item, index) => (
              <motion.div 
                key={item.name} 
                whileHover={{ scale: 1.01 }}
                className="p-3 rounded-2xl bg-gray-50/60 border border-gray-100 hover:bg-white hover:shadow-sm transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <span className="text-[10px] font-bold text-[#10B981]">{item.badge}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">৳{item.revenue.toLocaleString()}</p>
                    <span className="text-[10px] font-bold text-gray-400">{item.percent}% target</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}