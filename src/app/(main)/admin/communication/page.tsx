"use client";

import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Bike, 
  Store 
} from 'lucide-react';

interface Ticket {
  id: string;
  userName: string;
  userType: 'Customer' | 'Rider' | 'Vendor';
  initials: string;
  subject: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  lastUpdated: string;
}

const initialTickets: Ticket[] = [
  {
    id: "#TK-8492",
    userName: "Jane Doe",
    userType: "Customer",
    initials: "JD",
    subject: "Order missing items, refund request",
    description: "Order #ORD-9921 missing the side...",
    priority: "High",
    status: "Open",
    lastUpdated: "10m ago"
  },
  {
    id: "#TK-8491",
    userName: "Mike Rossi",
    userType: "Rider",
    initials: "MR",
    subject: "App crashing on delivery route",
    description: "iOS app version 2.4 freezes when...",
    priority: "Medium",
    status: "Open",
    lastUpdated: "1h ago"
  },
  {
    id: "#TK-8488",
    userName: "Burger Joint HQ",
    userType: "Vendor",
    initials: "BJ",
    subject: "Payout discrepancy for last week",
    description: "Missing promotional subsidy in...",
    priority: "High",
    status: "In Progress",
    lastUpdated: "Yesterday"
  },
  {
    id: "#TK-8485",
    userName: "Anna Smith",
    userType: "Customer",
    initials: "AS",
    subject: "Change email address on account",
    description: "User lost access to old email, needs...",
    priority: "Low",
    status: "Open",
    lastUpdated: "Yesterday"
  }
];

const CommunicationPage = () => {
  const [activeTab, setActiveTab] = useState<'All Tickets' | 'Open' | 'In Progress' | 'Resolved'>('Open');
  const [searchQuery, setSearchQuery] = useState('');

  // Fixed filtering logic for active tab and search query
  const filteredTickets = initialTickets.filter(ticket => {
    let matchesTab = true;
    if (activeTab === 'Open') {
      matchesTab = ticket.status === 'Open';
    } else if (activeTab === 'In Progress') {
      matchesTab = ticket.status === 'In Progress';
    } else if (activeTab === 'Resolved') {
      matchesTab = ticket.status === 'Resolved';
    }

    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Support Tickets</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage and resolve customer, vendor, and rider inquiries.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d9488] hover:bg-[#0b7c71] text-white rounded-xl text-xs font-bold transition-all shadow-2xs">
          <Plus size={16} />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs">
        
        {/* Tabs & Search Filter Bar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Navigation Tabs with Dynamic Counts */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-semibold text-gray-500">
            {[
              { label: "All Tickets", count: initialTickets.length },
              { label: "Open", count: initialTickets.filter(t => t.status === 'Open').length },
              { label: "In Progress", count: initialTickets.filter(t => t.status === 'In Progress').length },
              { label: "Resolved", count: initialTickets.filter(t => t.status === 'Resolved').length },
            ].map((tab) => {
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label as never)}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive 
                      ? "bg-gray-100 text-gray-900 font-bold" 
                      : "hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="px-1.5 py-0.5 bg-gray-200/80 text-gray-700 rounded-md text-[10px]">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Filter Right Side */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </span>
              <input 
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d9488] transition-all"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-all">
              <SlidersHorizontal size={14} className="text-gray-500" />
              <span>Filter</span>
            </button>
          </div>

        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3.5 px-6 font-semibold">Ticket ID</th>
                <th className="py-3.5 px-4 font-semibold">User Details</th>
                <th className="py-3.5 px-4 font-semibold">Subject</th>
                <th className="py-3.5 px-4 font-semibold">Priority</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const iconMap = {
                    Customer: <User size={12} className="text-gray-500" />,
                    Rider: <Bike size={12} className="text-gray-500" />,
                    Vendor: <Store size={12} className="text-gray-500" />
                  };

                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50/60 transition-colors">
                      
                      {/* Ticket ID */}
                      <td className="py-4 px-6 font-bold text-gray-900">
                        {ticket.id}
                      </td>

                      {/* User Details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {ticket.initials}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 leading-tight">{ticket.userName}</h4>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                              {iconMap[ticket.userType]} {ticket.userType}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="py-4 px-4 max-w-xs">
                        <h4 className="font-semibold text-gray-900 truncate">{ticket.subject}</h4>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{ticket.description}</p>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold inline-block ${
                          ticket.priority === 'High' 
                            ? 'bg-red-50 text-red-600 border border-red-100' 
                            : ticket.priority === 'Medium'
                            ? 'bg-blue-50 text-blue-600 border border-blue-100'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 font-medium text-gray-800">
                          <span className={`w-2 h-2 rounded-full ${
                            ticket.status === 'Open' ? 'bg-red-500' :
                            ticket.status === 'In Progress' ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}></span>
                          {ticket.status}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="py-4 px-6 text-right text-gray-500 font-medium">
                        {ticket.lastUpdated}
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No tickets found in this section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 px-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            Showing <span className="font-semibold text-gray-800">1</span> to <span className="font-semibold text-gray-800">{filteredTickets.length}</span> of <span className="font-semibold text-gray-800">42</span> open tickets
          </div>

          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 rounded-xl bg-[#0d9488] text-white font-bold flex items-center justify-center shadow-2xs">
              1
            </button>
            <button className="w-8 h-8 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-gray-700 flex items-center justify-center">
              2
            </button>
            <button className="w-8 h-8 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-gray-700 flex items-center justify-center">
              3
            </button>
            <span className="px-1 text-gray-400">...</span>
            <button className="w-8 h-8 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-gray-700 flex items-center justify-center">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CommunicationPage;