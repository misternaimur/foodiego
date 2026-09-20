"use client";

import React, { useEffect, useState } from 'react';
import {
  Percent,
  Clock,
  Search,
} from 'lucide-react';

// UPDATE (admin-commission fix): see src/app/api/admin/commission/route.ts
// for the full explanation — this page used to render 4 hardcoded rows
// and a literal "Simulated pending backend sum" constant. It now fetches
// real per-order commission computed from every restaurant's delivered
// (and in-flight) OrderBooking history.

interface CommissionRow {
  orderId: string;
  vendor: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  vendorEarning: number;
  date: string;
}

export default function CommissionPage() {
  const [rows, setRows] = useState<CommissionRow[]>([]);
  const [totalCommissionThisMonth, setTotalCommissionThisMonth] = useState(0);
  const [pendingCommission, setPendingCommission] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/commission")
      .then((res) => res.json())
      .then((data) => {
        setRows(data.rows || []);
        setTotalCommissionThisMonth(data.totalCommissionThisMonth || 0);
        setPendingCommission(data.pendingCommission || 0);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredCommissions = rows.filter(item =>
    item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Commission
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Platform commission earned across all vendor orders.
            </p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Total Commission (This Month)
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Percent size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-950">
                {loading ? "—" : `$${totalCommissionThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              <p className="text-xs text-gray-400 mt-1">From delivered orders this calendar month.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Pending Commission
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-950">
                {loading ? "—" : `$${pendingCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              <p className="text-xs text-gray-400 mt-1">From orders still being prepared or delivered.</p>
            </div>
          </div>

        </div>

        {/* Commission Table Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden space-y-4">

          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-base font-bold text-gray-900">Commission Table</h2>
            <div className="relative flex-1 max-w-sm">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID or Vendor..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Vendor</th>
                  <th className="px-6 py-3.5">Order Amount</th>
                  <th className="px-6 py-3.5">Commission Rate</th>
                  <th className="px-6 py-3.5">Commission Amount</th>
                  <th className="px-6 py-3.5">Vendor Earning</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs">Loading commission records…</td>
                  </tr>
                ) : filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No commission records found.
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((item) => (
                    <tr key={item.orderId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">#{item.orderId.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{item.vendor}</td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        ${item.orderAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {item.commissionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#059669]">
                        +${item.commissionAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${item.vendorEarning.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Showing {filteredCommissions.length} of {rows.length} entries
            </span>
          </div>

        </div>

      </div>
    </main>
  );
}
