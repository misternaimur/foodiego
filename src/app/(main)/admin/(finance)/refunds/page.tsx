"use client";

import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Check, 
  X 
} from 'lucide-react';

interface RefundRecord {
  id: string;
  refundId: string;
  orderId: string;
  customer: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedDate: string;
}

const initialRefunds: RefundRecord[] = [
  {
    id: "1",
    refundId: "REF-9012",
    orderId: "ORD-5541",
    customer: "Alex Johnson",
    amount: 125.50,
    reason: "Damaged item received upon delivery",
    status: "Pending",
    requestedDate: "Oct 24, 14:30"
  },
  {
    id: "2",
    refundId: "REF-9013",
    orderId: "ORD-5542",
    customer: "Sarah Williams",
    amount: 45.00,
    reason: "Wrong item delivered",
    status: "Approved",
    requestedDate: "Oct 24, 15:10"
  },
  {
    id: "3",
    refundId: "REF-9014",
    orderId: "ORD-5543",
    customer: "David Brown",
    amount: 210.00,
    reason: "Order cancelled by customer after dispatch",
    status: "Rejected",
    requestedDate: "Oct 24, 16:05"
  },
  {
    id: "4",
    refundId: "REF-9015",
    orderId: "ORD-5544",
    customer: "Emma Davis",
    amount: 89.99,
    reason: "Missing components from package",
    status: "Pending",
    requestedDate: "Oct 24, 17:20"
  }
];

export default function RefundsPage() {
  // Structured state ready for backend API integration (e.g. GET /api/admin/refunds)
  const [refunds, setRefunds] = useState<RefundRecord[]>(initialRefunds);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter logic ready for backend API query mapping
  const filteredRefunds = refunds.filter(item => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = item.refundId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = refunds.filter(r => r.status === 'Pending').length;

  // Handlers ready to be connected with backend API mutations (e.g. PATCH /api/admin/refunds/:id)
  const handleApprove = (id: string) => {
    setRefunds(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
  };

  const handleReject = (id: string) => {
    setRefunds(prev => prev.map(item => item.id === id ? { ...item, status: 'Rejected' } : item));
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
              Manage refund requests, review reasons, and process safe transaction reversals.
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
                placeholder="Search by Refund ID, Order ID, or Customer..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Refund ID</th>
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
                {filteredRefunds.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No refund records found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRefunds.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{item.refundId}</td>
                      <td className="px-6 py-4 font-medium text-gray-600">{item.orderId}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{item.customer}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">${item.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={item.reason}>
                        {item.reason}
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'Pending' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 tracking-wider">
                            Pending
                          </span>
                        )}
                        {item.status === 'Approved' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider">
                            Approved
                          </span>
                        )}
                        {item.status === 'Rejected' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 tracking-wider">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{item.requestedDate}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => alert(`Viewing details for ${item.refundId}`)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          {item.status === 'Pending' ? (
                            <>
                              <button 
                                onClick={() => handleApprove(item.id)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer font-bold"
                                title="Approve"
                              >
                                <Check size={15} />
                              </button>
                              <button 
                                onClick={() => handleReject(item.id)}
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

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Showing 1 to {filteredRefunds.length} of {refunds.length} entries
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