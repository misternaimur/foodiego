"use client";

import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  ChevronDown 
} from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  code: string;
  vendor: string;
  category: string;
  price: string;
  status: 'Active' | 'Disabled';
  imageUrl: string;
}

const initialFoodItems: FoodItem[] = [
  {
    id: "1",
    name: "Artisanal Avocado Toast",
    code: "ID: FD-8921",
    vendor: "Greenhouse Cafe",
    category: "Breakfast",
    price: "$14.50",
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "2",
    name: "Classic Double Burger",
    code: "ID: FD-7742",
    vendor: "Burger Joint Co.",
    category: "Mains",
    price: "$18.00",
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "3",
    name: "Molten Lava Cake",
    code: "ID: FD-3321",
    vendor: "Sweet Treats",
    category: "Desserts",
    price: "$9.50",
    status: "Disabled",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&auto=format&fit=crop&q=80"
  }
];

export default function MenuManagementPage() {
  // Structured state ready for backend API integration / data fetching
  const [items, setItems] = useState<FoodItem[]>(initialFoodItems);
  const [activeTab, setActiveTab] = useState<'All Items' | 'Categories' | 'Pending Items' | 'Reported Items'>('All Items');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalItemsCount = 124; // Real total count from API later

  // Filtering logic ready to be replaced/handled via API query params
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Menu & Food Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage food items, categories, and vendor offerings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer">
              <Download size={15} className="text-gray-500" />
              <span>Export CSV</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#065f46] hover:bg-[#044e38] text-white rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer">
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Main Content Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 px-6 pt-4 flex gap-8 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('All Items')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'All Items'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab('Categories')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'Categories'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('Pending Items')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'Pending Items'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Pending Items</span>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100">
                12
              </span>
            </button>
            <button
              onClick={() => setActiveTab('Reported Items')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'Reported Items'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Reported Items
            </button>
          </div>

          {/* Filters Bar */}
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
            
            {/* Search Filter Input */}
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by vendor, category..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent"
              />
            </div>

            {/* Status Dropdown Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Active">Status: Active</option>
                <option value="Disabled">Status: Disabled</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <ChevronDown size={14} />
              </span>
            </div>

          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Image</th>
                  <th className="px-6 py-3.5">Food Name</th>
                  <th className="px-6 py-3.5">Vendor</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No food items found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-gray-900 text-xs">{item.name}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{item.code}</div>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-gray-700 font-medium">
                        {item.vendor}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-gray-600">
                        {item.category}
                      </td>
                      <td className="px-6 py-3.5 text-xs font-semibold text-gray-900">
                        {item.price}
                      </td>
                      <td className="px-6 py-3.5">
                        {item.status === 'Active' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-600 text-white shadow-2xs">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-200 text-gray-600">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <button 
                          onClick={() => alert(`Actions for item ${item.name}`)}
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
              Showing 1-10 of {totalItemsCount} items
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