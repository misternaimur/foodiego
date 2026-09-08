"use client";

import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Calendar, 
  ChevronDown 
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  customerInitials: string;
  vendor: string;
  amount: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  status: 'Processing' | 'Pending' | 'Ready' | 'Delivered' | 'Cancelled';
  date: string;
}

const initialOrders: Order[] = [
  {
    id: "#ORD-9021",
    customerName: "Jane Doe",
    customerInitials: "JD",
    vendor: "Green Valley Farms",
    amount: "$245.50",
    paymentStatus: "Paid",
    status: "Processing",
    date: "Oct 24, 10:30 AM"
  },
  {
    id: "#ORD-9020",
    customerName: "Michael Smith",
    customerInitials: "MS",
    vendor: "Organic Co.",
    amount: "$1,120.00",
    paymentStatus: "Pending",
    status: "Pending",
    date: "Oct 24, 09:15 AM"
  },
  {
    id: "#ORD-9019",
    customerName: "Alice Johnson",
    customerInitials: "AJ",
    vendor: "Fresh Catch Seafood",
    amount: "$89.99",
    paymentStatus: "Paid",
    status: "Ready",
    date: "Oct 23, 04:45 PM"
  },
  {
    id: "#ORD-9018",
    customerName: "Robert Brown",
    customerInitials: "RB",
    vendor: "City Bakery",
    amount: "$45.00",
    paymentStatus: "Paid",
    status: "Delivered",
    date: "Oct 23, 02:10 PM"
  },
  {
    id: "#ORD-9017",
    customerName: "Emma Wilson",
    customerInitials: "EW",
    vendor: "Local Dairy",
    amount: "$15.50",
    paymentStatus: "Failed",
    status: "Cancelled",
    date: "Oct 23, 11:05 AM"
  }
];

export default function AdminOrderManagementPage() {
  // Structured state ready for API integration (e.g., fetch via useEffect)
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalEntries = 42; // Change this to real API total count later

  // Filter logic (ready to be replaced or bypassed when fetching filtered data from a backend API)
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "All Statuses" || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesStatus;
  });

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Order Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor and process customer orders.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all">
              <Download size={15} className="text-gray-500" />
              <span>Export</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#065f46] hover:bg-[#044e38] text-white rounded-xl text-xs font-semibold shadow-2xs transition-all">
              <Plus size={16} />
              <span>Create Order</span>
            </button>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
            {/* Status Dropdown Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Processing</option>
                <option>Pending</option>
                <option>Ready</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <ChevronDown size={14} />
              </span>
            </div>

            {/* Date Picker Filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Calendar size={14} />
              </span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent bg-white"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Vendor</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Payment</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500 text-xs">
                      No orders found matching your filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 text-xs">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[11px]">
                            {order.customerInitials}
                          </div>
                          <span className="font-medium text-gray-900 text-xs">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {order.vendor}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 text-xs">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4">
                        {order.paymentStatus === 'Paid' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Paid
                          </span>
                        )}
                        {order.paymentStatus === 'Pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                            <span className="text-[10px]">⚠️</span> Pending
                          </span>
                        )}
                        {order.paymentStatus === 'Failed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-100">
                            ✕ Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'Processing' && (
                          <span className="inline-flex px-3 py-1 rounded-md text-[11px] font-semibold bg-emerald-600 text-white shadow-2xs">
                            Processing
                          </span>
                        )}
                        {order.status === 'Pending' && (
                          <span className="inline-flex px-3 py-1 rounded-md text-[11px] font-semibold bg-gray-200 text-gray-700">
                            Pending
                          </span>
                        )}
                        {order.status === 'Ready' && (
                          <span className="inline-flex px-3 py-1 rounded-md text-[11px] font-semibold bg-emerald-500 text-white shadow-2xs">
                            Ready
                          </span>
                        )}
                        {order.status === 'Delivered' && (
                          <span className="inline-flex px-3 py-1 rounded-md text-[11px] font-semibold bg-slate-200 text-slate-700">
                            Delivered
                          </span>
                        )}
                        {order.status === 'Cancelled' && (
                          <span className="inline-flex px-3 py-1 rounded-md text-[11px] font-semibold bg-rose-100 text-rose-700">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => alert(`View details for ${order.id}`)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors inline-block"
                          title="View Order"
                        >
                          <Eye size={16} />
                        </button>
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
              Showing 1 to {filteredOrders.length} of {totalEntries} entries
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-500 transition-all disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              
              <button 
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${currentPage === 1 ? 'bg-[#065f46] text-white shadow-2xs' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                1
              </button>
              <button 
                onClick={() => setCurrentPage(2)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${currentPage === 2 ? 'bg-[#065f46] text-white shadow-2xs' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                2
              </button>
              <button 
                onClick={() => setCurrentPage(3)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${currentPage === 3 ? 'bg-[#065f46] text-white shadow-2xs' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                3
              </button>

              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-500 transition-all"
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