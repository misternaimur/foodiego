"use client";

import React, { useState } from 'react';
import { 
  Filter, 
  Download, 
  Truck, 
  Store, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  TrendingUp 
} from 'lucide-react';

interface DeliveryItem {
  id: string;
  vendor: string;
  riderName: string;
  riderInitials: string;
  customer: string;
  status: 'Waiting for Pickup' | 'Picked Up' | 'On the Way' | 'Failed' | 'Delivered';
  startedAt: string;
}

const initialDeliveries: DeliveryItem[] = [
  {
    id: "#ORD-9021",
    vendor: "Sweet Basil Thai",
    riderName: "Mike K.",
    riderInitials: "MK",
    customer: "Sarah J.",
    status: "Waiting for Pickup",
    startedAt: "10:42 AM"
  },
  {
    id: "#ORD-9018",
    vendor: "Burger Joint",
    riderName: "Alex L.",
    riderInitials: "AL",
    customer: "David W.",
    status: "Picked Up",
    startedAt: "10:35 AM"
  },
  {
    id: "#ORD-9015",
    vendor: "Sushi Master",
    riderName: "Ray J.",
    riderInitials: "RJ",
    customer: "Emily R.",
    status: "On the Way",
    startedAt: "10:15 AM"
  },
  {
    id: "#ORD-8992",
    vendor: "Pizza Express",
    riderName: "Tom C.",
    riderInitials: "TC",
    customer: "Mark H.",
    status: "Failed",
    startedAt: "09:45 AM"
  },
  {
    id: "#ORD-8988",
    vendor: "Healthy Greens",
    riderName: "Sam W.",
    riderInitials: "SW",
    customer: "Chloe T.",
    status: "Delivered",
    startedAt: "09:12 AM"
  }
];

export default function DeliveryLogisticsPage() {
  // Structured state ready to be swapped out with backend API data/fetch calls
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>(initialDeliveries);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalActiveEntries = 142; // Real count from API later

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Delivery & Logistics
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Operational monitoring and active dispatch overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all">
              <Filter size={15} className="text-gray-500" />
              <span>Filter</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#065f46] hover:bg-[#044e38] text-white rounded-xl text-xs font-semibold shadow-2xs transition-all">
              <Download size={15} />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Active Deliveries */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Active Deliveries
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <h2 className="text-3xl font-bold text-gray-900">142</h2>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                    <TrendingUp size={11} /> +12%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                <Truck size={22} />
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-5 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#065f46] h-full rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>

          {/* Card 2: Pending Pickup */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Pending Pickup
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-3xl font-bold text-gray-900">38</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                    Normal Load
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                <Store size={22} />
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-5 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-slate-600 h-full rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>

          {/* Card 3: Completed Today */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Completed Today
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h2 className="text-3xl font-bold text-gray-900">894</h2>
                  <span className="text-xs text-gray-400 font-medium">orders</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-gray-300">
                <CheckCircle2 size={22} />
              </div>
            </div>
            <div className="mt-5 text-xs text-gray-500 font-medium">
              Avg time: <span className="text-gray-900 font-semibold">32 mins</span>
            </div>
          </div>

        </div>

        {/* Active Operations Table Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Table Header Row */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Active Operations</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-600">Live Updates</span>
            </div>
          </div>

          {/* Table Data */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Vendor</th>
                  <th className="px-6 py-3.5">Rider</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Started At</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {deliveries.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 text-xs">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-800 font-medium">
                      {item.vendor}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                          {item.riderInitials}
                        </div>
                        <span className="font-medium text-gray-800 text-xs">{item.riderName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {item.customer}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'Waiting for Pickup' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Waiting for Pickup
                        </span>
                      )}
                      {item.status === 'Picked Up' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Picked Up
                        </span>
                      )}
                      {item.status === 'On the Way' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold bg-emerald-500 text-white shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span> On the Way
                        </span>
                      )}
                      {item.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Failed
                        </span>
                      )}
                      {item.status === 'Delivered' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Delivered
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {item.startedAt}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => alert(`Options for ${item.id}`)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors inline-block rounded-lg hover:bg-gray-100"
                        title="Actions"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Showing 1-5 of {totalActiveEntries} active
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-500 transition-all disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-500 transition-all cursor-pointer"
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