"use client";

import React, { useState } from 'react';
import { 
  Headphones, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MessageSquare 
} from 'lucide-react';

interface SupportTicket {
  id: string;
  ticketId: string;
  userType: 'Customer' | 'Vendor' | 'Rider';
  name: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}

const initialTickets: SupportTicket[] = [
  {
    id: "1",
    ticketId: "TCK-8921",
    userType: "Customer",
    name: "Alex Johnson",
    subject: "Delayed order delivery for Downtown Core area",
    priority: "High",
    status: "Open",
    date: "Oct 24, 14:10"
  },
  {
    id: "2",
    ticketId: "TCK-8922",
    userType: "Vendor",
    name: "Greenhouse Cafe",
    subject: "Payout settlement issue for weekly batch",
    priority: "Medium",
    status: "In Progress",
    date: "Oct 24, 15:30"
  },
  {
    id: "3",
    ticketId: "TCK-8923",
    userType: "Rider",
    name: "Rahim Ahmed",
    subject: "App crash while updating order status",
    priority: "High",
    status: "Open",
    date: "Oct 24, 16:05"
  },
  {
    id: "4",
    ticketId: "TCK-8924",
    userType: "Customer",
    name: "Sarah Williams",
    subject: "Refund request for damaged item",
    priority: "Low",
    status: "Resolved",
    date: "Oct 23, 11:20"
  }
];

export default function SupportTicketsPage() {
  // Structured state ready to be replaced with backend API calls (e.g., GET /api/support/tickets)
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter logic ready for backend query parameters mapping
  const filteredTickets = tickets.filter(ticket => {
    const matchesTab = activeTab === 'All' || ticket.status === activeTab;
    const matchesSearch = ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || ticket.userType === roleFilter;
    return matchesTab && matchesSearch && matchesRole;
  });

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              Support Tickets
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                {openCount} Open
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and resolve customer, vendor, and rider inquiries seamlessly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert("Exporting support tickets report...")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <span>Export Tickets</span>
            </button>
          </div>
        </div>

        {/* Main Content Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Tabs Navigation Header */}
          <div className="border-b border-gray-200 px-6 pt-4 flex gap-8 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('All')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'All'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              All Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('Open')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'Open'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Open</span>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100">
                {openCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('In Progress')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'In Progress'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>In Progress</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100">
                {inProgressCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('Resolved')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'Resolved'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Resolved
            </button>
          </div>

          {/* Filters Bar */}
          <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px] max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ticket ID, name, or subject..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent"
              />
            </div>

            {/* User Type Role Filter Dropdown */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#065f46] focus:border-transparent cursor-pointer"
              >
                <option value="All">User Type: All</option>
                <option value="Customer">Customer</option>
                <option value="Vendor">Vendor</option>
                <option value="Rider">Rider</option>
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
                <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Ticket ID</th>
                  <th className="px-6 py-3.5">User Type</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Subject</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No support tickets found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{ticket.ticketId}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${
                          ticket.userType === 'Customer' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                          ticket.userType === 'Vendor' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {ticket.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{ticket.name}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={ticket.subject}>
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${
                          ticket.priority === 'High' ? 'text-rose-600' :
                          ticket.priority === 'Medium' ? 'text-amber-600' : 'text-gray-500'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {ticket.status === 'Open' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 tracking-wider">
                            Open
                          </span>
                        )}
                        {ticket.status === 'In Progress' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 tracking-wider">
                            In Progress
                          </span>
                        )}
                        {ticket.status === 'Resolved' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider">
                            Resolved
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{ticket.date}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => alert(`Opening chat and thread details for ticket ${ticket.ticketId}`)}
                          className="p-1.5 text-gray-400 hover:text-[#059669] hover:bg-emerald-50 rounded-lg transition-colors inline-block cursor-pointer"
                          title="View Ticket Conversation"
                        >
                          <MessageSquare size={16} />
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
              Showing 1 to {filteredTickets.length} of {tickets.length} entries
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