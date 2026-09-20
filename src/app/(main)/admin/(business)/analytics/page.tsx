"use client";

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';

// UPDATE (admin-analytics fix): see src/app/api/admin/analytics/route.ts
// for the full explanation — every number and the chart on this page used
// to be a hardcoded constant. It now fetches real platform-wide
// OrderBooking aggregates for the selected time range.

interface AnalyticsData {
  totalSales: number;
  salesChange: number;
  totalOrders: number;
  ordersChange: number;
  totalRevenue: number;
  revenueChange: number;
  bars: { label: string; value: number }[];
  topVendors: { id: string; vendor: string; orders: number; revenue: number }[];
}

type Range = 'Today' | '7 Days' | '30 Days' | 'Custom';

function ChangeBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-md ${positive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}`}>
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {positive ? "+" : ""}{value}%
    </span>
  );
}

export default function AnalyticsReportsPage() {
  const [selectedFilter, setSelectedFilter] = useState<Range>('30 Days');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/analytics?range=${encodeURIComponent(selectedFilter)}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [selectedFilter]);

  const maxBarValue = Math.max(1, ...(data?.bars.map((b) => b.value) || [1]));

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
                onClick={() => {
                  setLoading(true);
                  setSelectedFilter(filter);
                }}
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
              <div className="text-2xl font-bold text-gray-950">{loading || !data ? "—" : `$${data.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</div>
              {!loading && data && <ChangeBadge value={data.salesChange} />}
            </div>
          </div>

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
              <div className="text-2xl font-bold text-gray-950">{loading || !data ? "—" : `${data.totalOrders.toLocaleString()} orders`}</div>
              {!loading && data && <ChangeBadge value={data.ordersChange} />}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Platform Revenue
              </span>
              <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                <BarChart3 size={16} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-950">{loading || !data ? "—" : `$${data.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</div>
              {!loading && data && <ChangeBadge value={data.revenueChange} />}
            </div>
          </div>

        </div>

        {/* Real Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Performance Trend</h2>
              <p className="text-xs text-gray-400">
                {selectedFilter === "Today" ? "Hourly" : "Daily"} revenue for the selected timeframe.
              </p>
            </div>
          </div>

          {loading || !data ? (
            <div className="h-48 w-full animate-pulse rounded-xl bg-gray-100" />
          ) : (
            <>
              <div className="h-48 w-full flex items-end justify-between gap-1 pt-6 px-2 border-b border-gray-100">
                {data.bars.map((bar, idx) => (
                  <div
                    key={idx}
                    className="w-full bg-emerald-50 hover:bg-[#059669] rounded-t-md transition-all group relative cursor-pointer"
                    style={{ height: `${Math.max(2, (bar.value / maxBarValue) * 100)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1 px-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      ${bar.value.toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium px-2">
                <span>{data.bars[0]?.label}</span>
                <span>{data.bars[data.bars.length - 1]?.label}</span>
              </div>
            </>
          )}
        </div>

        {/* Top Vendors */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden space-y-4">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Top Vendors</h2>
              <p className="text-xs text-gray-400">Highest performing vendors ranked by revenue, for the selected timeframe.</p>
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
                {loading ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-xs">Loading…</td></tr>
                ) : !data || data.topVendors.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-xs">No orders in this period yet.</td></tr>
                ) : (
                  data.topVendors.map((item) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
