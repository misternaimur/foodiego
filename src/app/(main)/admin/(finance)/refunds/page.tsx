"use client";

import React, { useEffect, useState } from 'react';
import {
  Search,
  Check,
  X,
} from 'lucide-react';

// UPDATE (admin-refunds fix): see src/app/api/admin/refunds/route.ts for
// the full explanation — this page used to render 4 hardcoded fake
// refund rows and its approve/reject buttons only mutated local state
// (lost on refresh). It now lists real cancelled-and-paid orders as the
// refund queue and persists approve/reject decisions to the real order.

interface RefundRecord {
  orderId: string;
  customer: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedDate: string;
}

const STATUS_LABEL: Record<RefundRecord["status"], "Pending" | "Approved" | "Rejected"> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState<string>("");

  const load = () => {
    fetch("/api/admin/refunds")
      .then((res) => res.json())
      .then((data) => setRefunds(data.refunds || []))
      .catch(() => setRefunds([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filteredRefunds = refunds.filter(item => {
    const matchesTab = activeTab === 'All' || STATUS_LABEL[item.status] === activeTab;
    const matchesSearch = item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = refunds.filter(r => r.status === 'pending').length;

  const decide = async (orderId: string, status: 'approved' | 'rejected') => {
    setRefunds(prev => prev.map(item => item.orderId === orderId ? { ...item, status } : item));
    try {
      await fetch(`/api/admin/refunds/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      load();
    }
  };

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              Refunds
              {pendingCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full">
                  {pendingCount} Pending
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Orders that were cancelled after payment and need a refund decision.
            </p>
          </div>
        </div>

        {/* Main Content Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">

          {/* Navigation Tabs Header */}
          <div className="border-b border-gray-200 px-6 pt-4 flex gap-8 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('All')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'All'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              All ({refunds.length})
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'Pending'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Pending</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('Approved')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'Approved'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab('Rejected')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'Rejected'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID or Customer..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Reason</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Requested Date</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs">Loading refund records…</td>
                  </tr>
                ) : filteredRefunds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No refund records found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRefunds.map((item) => (
                    <tr key={item.orderId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">#{item.orderId.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{item.customer}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">${item.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={item.reason}>
                        {item.reason}
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 tracking-wider">
                            Pending
                          </span>
                        )}
                        {item.status === 'approved' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider">
                            Approved
                          </span>
                        )}
                        {item.status === 'rejected' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 tracking-wider">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {new Date(item.requestedDate).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => decide(item.orderId, 'approved')}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer font-bold"
                                title="Approve"
                              >
                                <Check size={15} />
                              </button>
                              <button
                                onClick={() => decide(item.orderId, 'rejected')}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer font-bold"
                                title="Reject"
                              >
                                <X size={15} />
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-gray-400 font-medium px-2">Processed</span>
                          )}
                        </div>
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
              Showing {filteredRefunds.length} of {refunds.length} entries
            </span>
          </div>

        </div>

      </div>
    </main>
  );
}
