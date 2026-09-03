"use client";

import React, { useState } from 'react';
import { 
  Percent, 
  DollarSign, 
  Clock, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  MoreVertical 
} from 'lucide-react';

interface CommissionRecord {
  id: string;
  orderId: string;
  vendor: string;
  orderAmount: number;
  commissionRate: number; // e.g. 10 for 10%
  vendorEarning: number;
  date: string;
}

const initialCommissions: CommissionRecord[] = [
  {
    id: "1",
    orderId: "ORD-5541",
    vendor: "Greenhouse Cafe",
    orderAmount: 250.00,
    commissionRate: 12,
    vendorEarning: 220.00,
    date: "Oct 24, 14:30"
  },
  {
    id: "2",
    orderId: "ORD-5542",
    vendor: "Burger Joint Co.",
    orderAmount: 180.50,
    commissionRate: 10,
    vendorEarning: 162.45,
    date: "Oct 24, 15:05"
  },
  {
    id: "3",
    orderId: "ORD-5543",
    vendor: "Sweet Treats",
    orderAmount: 95.00,
    commissionRate: 15,
    vendorEarning: 80.75,
    date: "Oct 24, 16:12"
  },
  {
    id: "4",
    orderId: "ORD-5544",
    vendor: "Downtown Bistro",
    orderAmount: 420.00,
    commissionRate: 10,
    vendorEarning: 378.00,
    date: "Oct 24, 17:45"
  }
];

export default function CommissionPage() {
  // Structured state ready for backend API integration (e.g. GET /api/admin/commissions)
  const [commissions, setCommissions] = useState<CommissionRecord[]>(initialCommissions);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter logic ready for API query parameters mapping
  const filteredCommissions = commissions.filter(item => 
    item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Computed summary metrics (ready to be replaced with backend aggregated totals)
  const totalCommissionAmount = commissions.reduce((acc, curr) => {
    const commission = (curr.orderAmount * curr.commissionRate) / 100;
    return acc + commission;
  }, 0);

  const pendingCommissionAmount = 4850.20; // Simulated pending backend sum

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
              Manage platform commission rates, payouts, and revenue distribution.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert("Exporting commission report...")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <Download size={15} className="text-gray-500" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Total Commission */}
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
                ${totalCommissionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-400 mt-1">Calculated across all completed vendor orders.</p>
            </div>
          </div>

          {/* Card 2: Pending Commission */}
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
                ${pendingCommissionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-400 mt-1">Scheduled for upcoming payout settlement cycles.</p>
            </div>
          </div>

        </div>

        {/* Commission Table Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden space-y-4">
          
          {/* Table Header & Search Bar */}
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

          {/* Table */}
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
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No commission records found.
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((item) => {
                    const calculatedCommission = (item.orderAmount * item.commissionRate) / 100;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{item.orderId}</td>
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
                          +${calculatedCommission.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ${item.vendorEarning.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">{item.date}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Showing 1 to {filteredCommissions.length} of {commissions.length} entries
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-400 transition-all disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-600 transition-all cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}