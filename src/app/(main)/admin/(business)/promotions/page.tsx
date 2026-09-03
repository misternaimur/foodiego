"use client";

import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Calendar, 
  Percent, 
  Trash2, 
  Edit 
} from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  discount: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired';
}

const initialPromotions: Promotion[] = [
  {
    id: "1",
    name: "Summer Mega Feast Deal",
    discount: "20% OFF",
    startDate: "Jun 01, 2026",
    endDate: "Aug 31, 2026",
    status: "Active"
  },
  {
    id: "2",
    name: "Weekend Brunch Special",
    discount: "$15 Flat",
    startDate: "Oct 01, 2026",
    endDate: "Oct 05, 2026",
    status: "Active"
  },
  {
    id: "3",
    name: "First Order Welcome Promo",
    discount: "30% OFF",
    startDate: "Jan 01, 2026",
    endDate: "Mar 31, 2026",
    status: "Expired"
  },
  {
    id: "4",
    name: "Flash Midnight Delivery",
    discount: "Free Delivery",
    startDate: "Sep 10, 2026",
    endDate: "Sep 15, 2026",
    status: "Active"
  }
];

export default function PromotionsPage() {
  // Structured state ready for backend API endpoints (e.g. GET /api/admin/promotions)
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [activeTab, setActiveTab] = useState<'All Promotions' | 'Active' | 'Expired'>('All Promotions');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Form states for creating a new promotion
  const [newPromoName, setNewPromoName] = useState<string>("");
  const [newDiscount, setNewDiscount] = useState<string>("");
  const [newStartDate, setNewStartDate] = useState<string>("");
  const [newEndDate, setNewEndDate] = useState<string>("");

  // Filter logic ready for backend API query mapping
  const filteredPromotions = promotions.filter(item => {
    const matchesTab = activeTab === 'All Promotions' || item.status === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.discount.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeCount = promotions.filter(p => p.status === 'Active').length;
  const expiredCount = promotions.filter(p => p.status === 'Expired').length;

  // Handler for creating promotion (ready for POST /api/admin/promotions)
  const handleCreatePromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoName || !newDiscount) return;

    const newPromo: Promotion = {
      id: Date.now().toString(),
      name: newPromoName,
      discount: newDiscount,
      startDate: newStartDate || "Today",
      endDate: newEndDate || "Ongoing",
      status: "Active"
    };

    setPromotions([newPromo, ...promotions]);
    setIsModalOpen(false);
    setNewPromoName("");
    setNewDiscount("");
    setNewStartDate("");
    setNewEndDate("");
  };

  const handleDelete = (id: string) => {
    setPromotions(prev => prev.filter(item => item.id !== id));
  };

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Promotions & Offers
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage platform promotions, discount campaigns, and special offers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#065f46] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Promotion</span>
            </button>
          </div>
        </div>

        {/* Main Content Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Navigation Tabs Header */}
          <div className="border-b border-gray-200 px-6 pt-4 flex gap-8 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('All Promotions')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'All Promotions'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              All Promotions ({promotions.length})
            </button>
            <button
              onClick={() => setActiveTab('Active')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'Active'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Active</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                {activeCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('Expired')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'Expired'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Expired</span>
              <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200">
                {expiredCount}
              </span>
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
                placeholder="Search by promotion name or discount..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Promotion Name</th>
                  <th className="px-6 py-3.5">Discount</th>
                  <th className="px-6 py-3.5">Start Date</th>
                  <th className="px-6 py-3.5">End Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredPromotions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No promotions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPromotions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Tag size={14} />
                        </div>
                        <span>{item.name}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#059669]">
                        {item.discount}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{item.startDate}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{item.endDate}</td>
                      <td className="px-6 py-4">
                        {item.status === 'Active' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 tracking-wider">
                            Expired
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete promotion"
                          >
                            <Trash2 size={15} />
                          </button>
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
              Showing 1 to {filteredPromotions.length} of {promotions.length} entries
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

      {/* Simple Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Create New Promotion</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreatePromotion} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Promotion Name
                </label>
                <input 
                  type="text" 
                  required
                  value={newPromoName}
                  onChange={(e) => setNewPromoName(e.target.value)}
                  placeholder="e.g. Autumn Flavor Festival"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Discount Value
                </label>
                <input 
                  type="text" 
                  required
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  placeholder="e.g. 20% OFF or $10 Flat"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input 
                    type="text" 
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    placeholder="e.g. Nov 01, 2026"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <input 
                    type="text" 
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    placeholder="e.g. Nov 15, 2026"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#065f46] hover:bg-[#047857] text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                >
                  Save Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}