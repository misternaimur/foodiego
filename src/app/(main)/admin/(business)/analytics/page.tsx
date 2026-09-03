"use client";

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  ChevronDown, 
  ArrowUpRight 
} from 'lucide-react';

interface TopVendor {
  id: string;
  vendor: string;
  orders: number;
  revenue: number;
}

const topVendorsData: TopVendor[] = [
  { id: "1", vendor: "Greenhouse Cafe", orders: 420, revenue: 18450.00 },
  { id: "2", vendor: "Burger Joint Co.", orders: 385, revenue: 14220.50 },
  { id: "3", vendor: "Downtown Bistro", orders: 310, revenue: 12900.00 },
  { id: "4", vendor: "Sweet Treats Bakery", orders: 275, revenue: 9800.00 },
  { id: "5", vendor: "Spice Route Indian", orders: 240, revenue: 8750.00 }
];

export default function AnalyticsReportsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'Today' | '7 Days' | '30 Days' | 'Custom'>('30 Days');

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Header & Filter Controls Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Analytics & Reports
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View platform performance, financial metrics, and vendor insights.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs self-start">
            {(['Today', '7 Days', '30 Days', 'Custom'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-[#065f46] text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* High-Level Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Sales Overview Stat */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Sales Overview
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign size={16} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-950">$84,240.50</div>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp size={12} /> +14.2%
              </span>
            </div>
          </div>

          {/* Order Overview Stat */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Order Overview
              </span>
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShoppingBag size={16} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-950">1,630 orders</div>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp size={12} /> +8.1%
              </span>
            </div>
          </div>

          {/* Revenue Overview Stat */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Revenue Overview
              </span>
              <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                <BarChart3 size={16} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-950">$12,420.00</div>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp size={12} /> +12.5%
              </span>
            </div>
          </div>

        </div>

        {/* Minimalist Chart Mockup Section (Focused & Clean) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Performance Trend</h2>
              <p className="text-xs text-gray-400">Daily revenue distribution over the selected timeframe.</p>
            </div>
            <span className="text-xs font-semibold text-[#065f46] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              Live Metric Stream
            </span>
          </div>

          {/* Simulated Clean Bar Chart Graphic */}
          <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 px-2 border-b border-gray-100">
            {[45, 60, 35, 75, 90, 65, 80, 95, 70, 85, 100, 90, 85, 95, 110].map((heightVal, idx) => (
              <div key={idx} className="w-full bg-emerald-50 hover:bg-[#059669] rounded-t-md transition-all group relative cursor-pointer" style={{ height: `${heightVal}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1 px-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  ${heightVal * 120}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium px-2">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>

        {/* Additional Table: Top Vendors */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden space-y-4">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Top Vendors</h2>
              <p className="text-xs text-gray-400">Highest performing vendors ranked by total order volume and revenue.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Vendor</th>
                  <th className="px-6 py-3.5">Orders</th>
                  <th className="px-6 py-3.5">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {topVendorsData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.vendor}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-800">
                        {item.orders} orders
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#059669]">
                      ${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}