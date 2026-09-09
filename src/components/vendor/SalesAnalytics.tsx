'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Receipt,
  DollarSign,
  Download,
  Award,
  ChevronDown,
} from 'lucide-react';

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
  { name: 'Burgers', value: 45, color: '#00A36C' },
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
  { name: 'Classic Cheeseburger', revenue: 32400, percent: 100 },
  { name: 'Spicy Chicken Pizza', revenue: 28150, percent: 87 },
  { name: 'Loaded Fries', revenue: 15800, percent: 49 },
  { name: 'Truffle Smashburger', revenue: 12800, percent: 39 },
  { name: 'Iced Matcha Latte', revenue: 9400, percent: 29 },
];

const metricCards = [
  {
    title: 'Total Sales',
    value: '৳148,500',
    trend: '+8.2%',
    trendUp: true,
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-[0_0_30px_rgba(0,163,108,0.3)]',
  },
  {
    title: 'Total Orders',
    value: '1,248',
    trend: '+12.4%',
    trendUp: true,
    icon: ShoppingBag,
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
  },
  {
    title: 'Avg. Order Value',
    value: '৳119',
    trend: '-1.5%',
    trendUp: false,
    icon: Receipt,
    gradient: 'from-violet-500 to-purple-600',
    shadow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
  },
  {
    title: 'Live Revenue Velocity',
    value: 'Active',
    trend: '৳2,450/hr',
    trendUp: true,
    icon: TrendingUp,
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
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
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        <p className="text-xs font-bold text-gray-400 mb-2">{label}</p>
                {payload.map((entry, index) => (
          <p key={index} className="text-sm font-bold text-white">
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
    <div className="min-h-screen bg-slate-950 font-sans relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400">
              Sales & Analytics
            </h1>
            <p className="mt-2 text-gray-400">Monitor restaurant performance, revenue trends, and growth metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="appearance-none bg-slate-900/60 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Year">This Year</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <button className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white font-semibold text-sm py-2.5 px-4 rounded-xl hover:bg-white/10 transition-all">
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* 3D Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ rotateX: 2, rotateY: 2, z: 10 }}
                className={`relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transform-gpu perspective-1000 hover:shadow-2xl transition-all duration-300 ${card.shadow}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${
                        card.trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {card.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {card.trend}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{card.title}</p>
                  <p className="text-3xl font-black text-white">{card.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-6">Revenue Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00A36C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00A36C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#00A36C"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Split Donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-6">Category Split</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-400">{item.name}</span>
                  <span className="text-xs font-bold text-white ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order Volume Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-8 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-6">Order Volume</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="daily" fill="#00A36C" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="weekly" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award size={20} className="text-amber-400" />
              <h3 className="text-lg font-bold text-white">Top Performers</h3>
            </div>
            <div className="space-y-5">
              {topPerformers.map((item, index) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-500 w-5">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{item.name}</p>
                        <p className="text-xs text-gray-400">৳{item.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-slate-950/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
