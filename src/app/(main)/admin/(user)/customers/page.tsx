"use client";

import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  ChevronDown 
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  initials: string;
  email: string;
  totalOrders: number;
  totalSpent: string;
  status: 'Active' | 'Suspended';
  joined: string;
}

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    initials: "JD",
    email: "john.doe@example.com",
    totalOrders: 24,
    totalSpent: "$1,240.50",
    status: "Active",
    joined: "Oct 12, 2023"
  },
  {
    id: "2",
    name: "Alice Smith",
    initials: "AS",
    email: "alice.s@company.net",
    totalOrders: 8,
    totalSpent: "$450.00",
    status: "Suspended",
    joined: "Nov 05, 2023"
  },
  {
    id: "3",
    name: "Bob Williams",
    initials: "BW",
    email: "bwilliams@corp.org",
    totalOrders: 112,
    totalSpent: "$8,920.75",
    status: "Active",
    joined: "Jan 22, 2022"
  }
];

export default function CustomersManagementPage() {
  // Structured state ready for API data replacement (e.g., fetch via useEffect)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalEntries = 124; // Real total count from backend API

  // Filtering logic ready to be transitioned to query parameters on an API call
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Customers
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor customer accounts and activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer">
              <Download size={15} className="text-gray-500" />
              <span>Export</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#065f46] hover:bg-[#044e38] text-white rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer">
              <Plus size={16} />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers by name or ema..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent"
              />
            </div>

            {/* Right Side Filters */}
            <div className="flex items-center gap-3">
              {/* Status Dropdown Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent cursor-pointer"
                >
                  <option value="All">Status: All</option>
                  <option value="Active">Status: Active</option>
                  <option value="Suspended">Status: Suspended</option>
                </select>
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={14} />
                </span>
              </div>

              {/* Advanced Filter Button */}
              <button 
                onClick={() => alert("Open advanced filters modal/drawer")}
                className="p-2.5 bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 rounded-xl transition-all cursor-pointer"
                title="More Filters"
              >
                <Filter size={16} />
              </button>
            </div>

          </div>

          {/* Customers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Total Orders</th>
                  <th className="px-6 py-3.5">Total Spent</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Joined</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No customers found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {customer.initials}
                          </div>
                          <span className="font-semibold text-gray-900 text-xs">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-900">
                        {customer.totalOrders}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-900">
                        {customer.totalSpent}
                      </td>
                      <td className="px-6 py-4">
                        {customer.status === 'Active' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-100">
                            Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {customer.joined}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => alert(`Actions for customer ${customer.name}`)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors inline-block rounded-lg hover:bg-gray-100 cursor-pointer"
                          title="Actions"
                        >
                          <MoreVertical size={16} />
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
              Showing 1 to 3 of {totalEntries} entries
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
                onClick={() => setCurrentPage(1)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentPage === 1 ? 'bg-[#065f46] text-white shadow-2xs' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                1
              </button>
              <button 
                onClick={() => setCurrentPage(2)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentPage === 2 ? 'bg-[#065f46] text-white shadow-2xs' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                2
              </button>
              <button 
                onClick={() => setCurrentPage(3)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentPage === 3 ? 'bg-[#065f46] text-white shadow-2xs' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                3
              </button>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, 3))}
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