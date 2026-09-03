"use client";

import React, { useState } from 'react';
import { 
  UserPlus, 
  Filter, 
  Download, 
  Search, 
  Star, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Clock,
  UserX,
  Users
} from 'lucide-react';

interface Rider {
  id: string;
  name: string;
  phone: string;
  totalDeliveries: string | number;
  rating: string | number;
  status: 'Online' | 'Offline' | 'Suspended' | 'Pending';
  joined: string;
  avatarType: 'image' | 'initials';
  avatarUrl?: string;
  initials?: string;
}

const initialRiders: Rider[] = [
  {
    id: "1",
    name: "Marcus Johnson",
    phone: "+1 (555) 019-2834",
    totalDeliveries: 1432,
    rating: 4.9,
    status: "Online",
    joined: "Oct 12, 2022",
    avatarType: "image",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "2",
    name: "Elena Smith",
    phone: "+1 (555) 847-3920",
    totalDeliveries: 856,
    rating: 4.7,
    status: "Offline",
    joined: "Jan 05, 2023",
    avatarType: "initials",
    initials: "ES"
  },
  {
    id: "3",
    name: "David Chen",
    phone: "+1 (555) 293-8475",
    totalDeliveries: 342,
    rating: 3.2,
    status: "Suspended",
    joined: "Mar 15, 2023",
    avatarType: "image",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "4",
    name: "Sarah Williams",
    phone: "+1 (555) 938-1029",
    totalDeliveries: "New",
    rating: "N/A",
    status: "Pending",
    joined: "Today",
    avatarType: "initials",
    initials: "SW"
  }
];

export default function RiderManagementPage() {
  // Structured state ready for backend API integration (e.g. useEffect fetch)
  const [riders, setRiders] = useState<Rider[]>(initialRiders);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending Approval' | 'Active' | 'Suspended'>('All');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalRidersCount = 1248;

  // Filter logic ready to map to backend query parameters later
  const filteredRiders = riders.filter(rider => {
    const matchesSearch = rider.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rider.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'Pending Approval') return matchesSearch && rider.status === 'Pending';
    if (activeTab === 'Active') return matchesSearch && (rider.status === 'Online' || rider.status === 'Offline');
    if (activeTab === 'Suspended') return matchesSearch && rider.status === 'Suspended';
    return matchesSearch;
  });

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Rider Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor and manage delivery fleet operations.
            </p>
          </div>
          <div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#065f46] hover:bg-[#044e38] text-white rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer">
              <UserPlus size={16} />
              <span>Invite Rider</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Active */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Active
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">1,248</span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-0.5">
                <TrendingUp size={12} />
                +12%
              </span>
            </div>
          </div>

          {/* Card 2: Pending Approval */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Pending Approval
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">42</span>
              <span className="text-xs text-gray-400 font-medium">requires action</span>
            </div>
          </div>

          {/* Card 3: Avg Delivery Time */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Avg Delivery Time
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">24m</span>
              <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-0.5">
                <TrendingUp size={12} className="rotate-180" />
                -2m
              </span>
            </div>
          </div>

          {/* Card 4: Suspended */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Suspended
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-600">15</span>
              <span className="text-xs text-gray-400 font-medium">this week</span>
            </div>
          </div>

        </div>

        {/* Main Content Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Tabs & Action Bar */}
          <div className="px-6 pt-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Navigation Tabs */}
            <div className="flex gap-8 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('All')}
                className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'All'
                    ? 'border-[#065f46] text-[#065f46]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('Pending Approval')}
                className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'Pending Approval'
                    ? 'border-[#065f46] text-[#065f46]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Pending Approval
              </button>
              <button
                onClick={() => setActiveTab('Active')}
                className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'Active'
                    ? 'border-[#065f46] text-[#065f46]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('Suspended')}
                className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'Suspended'
                    ? 'border-[#065f46] text-[#065f46]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Suspended
              </button>
            </div>

            {/* Filter & Export Buttons */}
            <div className="flex items-center gap-3 pb-3 sm:pb-0">
              <button 
                onClick={() => alert("Open Filter Modal")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <Filter size={14} className="text-gray-500" />
                <span>Filter</span>
              </button>
              <button 
                onClick={() => alert("Exporting data...")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <Download size={14} className="text-gray-500" />
                <span>Export</span>
              </button>
            </div>

          </div>

          {/* Riders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Rider</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Total Deliveries</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Joined</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredRiders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No riders found.
                    </td>
                  </tr>
                ) : (
                  filteredRiders.map((rider) => (
                    <tr key={rider.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {rider.avatarType === 'image' ? (
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                              <img src={rider.avatarUrl} alt={rider.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {rider.initials}
                            </div>
                          )}
                          <span className="font-semibold text-gray-900 text-xs">{rider.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {rider.phone}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-900">
                        {rider.totalDeliveries}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-700">
                        {typeof rider.rating === 'number' ? (
                          <div className="flex items-center gap-1">
                            <span className="text-emerald-600">★</span>
                            <span className="font-semibold text-gray-900">{rider.rating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">{rider.rating}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {rider.status === 'Online' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Online
                          </span>
                        )}
                        {rider.status === 'Offline' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                            Offline
                          </span>
                        )}
                        {rider.status === 'Suspended' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Suspended
                          </span>
                        )}
                        {rider.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {rider.joined}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {rider.status === 'Pending' ? (
                          <button 
                            onClick={() => alert(`Reviewing rider ${rider.name}`)}
                            className="px-3 py-1 bg-[#065f46] hover:bg-[#044e38] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                          >
                            REVIEW
                          </button>
                        ) : (
                          <button 
                            onClick={() => alert(`Actions for rider ${rider.name}`)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors inline-block rounded-lg hover:bg-gray-100 cursor-pointer"
                            title="Actions"
                          >
                            <MoreVertical size={16} />
                          </button>
                        )}
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
              Showing 1 to 4 of {totalRidersCount}
            </span>
            <div className="flex items-center gap-1">
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
              <span className="px-1.5 text-gray-400 text-xs">...</span>
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