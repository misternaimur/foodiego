"use client";

import React, { useEffect, useState } from 'react';
import {
  Search,
  ChevronDown,
  X,
  Send,
  MessageSquare,
  LoaderCircle,
} from 'lucide-react';

// ============================================================
// UPDATE (admin-support fix): this page used to render a fixed 4-row
// array of fake tickets ("structured state ready to be replaced with
// backend API calls") and every action was a plain `alert(...)`. A real
// Ticket model + vendor-facing ticket routes already existed
// (src/models/Ticket.ts, src/app/api/v1/vendor/tickets/*) — vendors could
// already file and message on real tickets — but nothing on the admin
// side ever read or replied to them. This now lists real tickets from
// /api/admin/tickets and opens a real conversation thread (read + reply +
// resolve) via /api/admin/tickets/[id]. Every real ticket today comes
// from a restaurant (no rider/customer ticket-filing UI exists yet), so
// the Customer/Rider filter is kept for future use but will show nothing
// until that intake exists — this isn't a bug, there's just no other
// real source yet.
// ============================================================

interface SupportTicket {
  ticketId: string;
  userType: 'Customer' | 'Vendor' | 'Rider';
  name: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

interface TicketMessage {
  sender: 'merchant' | 'agent';
  text: string;
  timestamp: string;
}

interface TicketDetail {
  ticketId: string;
  name: string;
  email?: string;
  subject: string;
  category: string;
  priority: string;
  status: 'open' | 'in_progress' | 'resolved';
  messages: TicketMessage[];
}

const PRIORITY_LABEL: Record<string, 'High' | 'Medium' | 'Low'> = { high: 'High', medium: 'Medium', low: 'Low' };
const STATUS_LABEL: Record<string, 'Open' | 'In Progress' | 'Resolved'> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);

  const loadTickets = () => {
    fetch("/api/admin/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const status = STATUS_LABEL[ticket.status];
    const matchesTab = activeTab === 'All' || status === activeTab;
    const matchesSearch =
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || ticket.userType === roleFilter;
    return matchesTab && matchesSearch && matchesRole;
  });

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

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
            <div className="relative flex-1 min-w-65 max-w-md">
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
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-xs">Loading tickets…</td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-xs">
                      No support tickets found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.ticketId} className="hover:bg-gray-50/50 transition-colors">
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
                          ticket.priority === 'high' ? 'text-rose-600' :
                          ticket.priority === 'medium' ? 'text-amber-600' : 'text-gray-500'
                        }`}>
                          {PRIORITY_LABEL[ticket.priority]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {ticket.status === 'open' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 tracking-wider">
                            Open
                          </span>
                        )}
                        {ticket.status === 'in_progress' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 tracking-wider">
                            In Progress
                          </span>
                        )}
                        {ticket.status === 'resolved' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider">
                            Resolved
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {new Date(ticket.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setOpenTicketId(ticket.ticketId)}
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

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Showing {filteredTickets.length} of {tickets.length} entries
            </span>
          </div>
        </div>
      </div>

      {openTicketId && (
        <TicketDetailModal
          ticketId={openTicketId}
          onClose={() => setOpenTicketId(null)}
          onChanged={loadTickets}
        />
      )}
    </main>
  );
}

/* ================= TICKET DETAIL MODAL ================= */
function TicketDetailModal({
  ticketId,
  onClose,
  onChanged,
}: {
  ticketId: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => {
    fetch(`/api/admin/tickets/${ticketId}`)
      .then((res) => res.json())
      .then((data) => setDetail(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const handleSend = async (resolve = false) => {
    if (!reply.trim() && !resolve) return;
    setSending(true);
    try {
      await fetch(`/api/admin/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reply.trim() || undefined, resolve }),
      });
      setReply("");
      load();
      onChanged();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <p className="text-sm font-bold text-gray-900">{detail?.subject || ticketId}</p>
            <p className="mt-0.5 text-xs text-gray-400">{ticketId} &middot; {detail?.name}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {loading ? (
            <div className="flex justify-center py-10 text-gray-300"><LoaderCircle className="animate-spin" /></div>
          ) : !detail ? (
            <p className="py-10 text-center text-sm text-gray-400">Ticket not found.</p>
          ) : detail.messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">No messages yet.</p>
          ) : (
            detail.messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "agent" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${m.sender === "agent" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <p className={`mt-1 text-[10px] ${m.sender === "agent" ? "text-emerald-100" : "text-gray-400"}`}>
                    {new Date(m.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {detail && detail.status !== "resolved" && (
          <div className="space-y-2 border-t border-gray-100 p-4">
            <div className="flex items-center gap-2">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type a reply..."
                className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white"
              />
              <button
                onClick={() => handleSend(false)}
                disabled={sending || !reply.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white disabled:opacity-50"
              >
                <Send size={15} />
              </button>
            </div>
            <button
              onClick={() => handleSend(true)}
              disabled={sending}
              className="w-full rounded-lg border border-emerald-200 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
            >
              Mark as Resolved
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
