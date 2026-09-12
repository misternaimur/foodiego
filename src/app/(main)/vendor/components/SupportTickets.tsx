"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Send,
  Paperclip,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useVendorSocket } from "@/hooks/useVendorSocket";
import {
  useAllSupportTickets,
  useTicketMessages,
  useReplyToTicket,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
} from "@/hooks/useSupportTickets";
import CreateTicketModal from "./CreateTicketModal";

const statusTabs: { id: TicketStatus; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
];

const priorityIcons: Record<TicketPriority, React.ReactNode> = {
  high: <AlertCircle size={12} className="text-red-500" />,
  medium: <AlertCircle size={12} className="text-amber-500" />,
  low: <AlertCircle size={12} className="text-gray-400" />,
};

const priorityLabels: Record<TicketPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const priorityBadgeColors: Record<TicketPriority, string> = {
  high: "bg-red-50 text-red-700 border border-red-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  low: "bg-gray-50 text-gray-600 border border-gray-200",
};

const statusIcons: Record<TicketStatus, React.ReactNode> = {
  open: <AlertCircle size={14} className="text-blue-500" />,
  in_progress: <Clock size={14} className="text-amber-500" />,
  resolved: <CheckCircle size={14} className="text-teal-500" />,
};

const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

function formatTimeAgo(date: string): string {
  const now = new Date();
  const msgTime = new Date(date);
  const diffMs = now.getTime() - msgTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function priorityText(priority: TicketPriority): string {
  return `${priorityLabels[priority]} Priority`;
}

export default function SupportTickets() {
  const [activeTab, setActiveTab] = useState<TicketStatus>("open");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: tickets = [], isLoading: ticketsLoading } = useAllSupportTickets();
  const { data: ticketDetail } = useTicketMessages(
    selectedTicket?.ticketId ?? null
  );
  const { mutate: sendReply, isPending: isSending } = useReplyToTicket();

  const { isConnected: socketConnected } = useVendorSocket();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [ticketDetail?.messages]);

  const filteredTickets = (tickets ?? []).filter((ticket) => {
    if (ticket.status !== activeTab) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return ticket.ticketId.toLowerCase().includes(term) || ticket.subject.toLowerCase().includes(term);
  });

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyText("");
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyText.trim()) return;

    sendReply({ ticketId: selectedTicket.ticketId, text: replyText });
    setReplyText("");
  };

  const handleTabChange = (status: TicketStatus) => {
    setActiveTab(status);
    setSelectedTicket(null);
  };

  if (!selectedTicket && filteredTickets.length > 0) {
    setSelectedTicket(filteredTickets[0]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage and track your inquiries with FoodieGo Support.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-3 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#059669] transition-colors shadow-lg shadow-[#10B981]/20"
        >
          + Create New Ticket
        </button>
      </div>

      <div className="flex h-[calc(100vh-8rem-2rem)] gap-6">
        {/* LEFT COLUMN - Ticket List */}
        <div className="w-[55%] min-w-0 overflow-y-auto">
          <div className="mb-3 flex gap-1 overflow-x-auto no-scrollbar">
            {statusTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = tickets.filter((t) => t.status === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all relative ${
                    isActive
                      ? "bg-[#10B981] text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-[#E5E7EB]"
                  }`}
                >
                  {tab.label} ({count})
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] rounded-b-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mb-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search ticket ID or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3 py-2.5 text-sm text-gray-800 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={15} />
              <span>Filter</span>
            </button>
          </div>

          <div className="space-y-1">
            {ticketsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100"></div>
                ))}
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?.ticketId === ticket.ticketId;
                const priority = ticket.priority as TicketPriority;
                const status = ticket.status as TicketStatus;

                return (
                  <div
                    key={ticket._id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      isSelected
                        ? "border-[#10B981] bg-emerald-50/30"
                        : "border-[#E5E7EB] bg-white hover:bg-gray-50"
                    }}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{ticket.ticketId}</span>
                          <span className="text-gray-400">·</span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${priorityBadgeColors[priority]}`}
                          >
                            {priorityIcons[priority]}
                            {priorityLabels[priority]}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {ticket.subject}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-gray-100 text-gray-600">
                            {ticket.category}
                          </span>
                          <span className="flex items-center gap-1">
                            {statusIcons[status]}
                            {statusLabels[status]}
                          </span>
                          <span className="ml-auto">{formatTimeAgo(ticket.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {filteredTickets.length === 0 && !ticketsLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-3">
                  <AlertCircle size={32} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">No tickets in this section.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Active Ticket Chat */}
        <div className="w-[45%] min-w-0 overflow-y-auto">
          {selectedTicket && ticketDetail ? (
            <div className="flex h-full flex-col rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
              <div className="border-b border-[#E5E7EB] p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {selectedTicket.ticketId}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${priorityBadgeColors[selectedTicket.priority as TicketPriority]}`}
                      >
                        {priorityText(selectedTicket.priority as TicketPriority)}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {ticketDetail.subject}
                    </h2>
                    <div className="flex items-center gap-3 mt-0.5">
                      <p className="text-xs text-gray-500">
                        Ticket Created •{" "}
                        {new Date(ticketDetail.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <span className={`inline-flex items-center gap-1 text-xs ${
                        socketConnected ? "text-emerald-600" : "text-gray-400"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          socketConnected ? "bg-emerald-500" : "bg-gray-400"
                        }`} />
                        {socketConnected ? "Live" : "Offline"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                      selectedTicket.status === "open"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : selectedTicket.status === "in_progress"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-teal-50 text-teal-700 border border-teal-200"
                    }`}
                  >
                    {statusIcons[selectedTicket.status as TicketStatus]}
                    {statusLabels[selectedTicket.status as TicketStatus]}
                  </span>
                </div>
              </div>

              <div
                ref={messagesEndRef}
                className="flex-1 space-y-4 overflow-y-auto p-4"
              >
                {ticketDetail.messages.map((msg, idx) => {
                  const isMerchant = msg.sender === "merchant";
                  return (
                    <div
                      key={idx}
                      className={`flex ${isMerchant ? "justify-end" : "justify-start"}`}
                    >
                      {!isMerchant && (
                        <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                          {msg.avatar || "SA"}
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          isMerchant
                            ? "bg-[#10B981] text-white"
                            : "bg-gray-50 text-gray-800"
                        }`}
                      >
                        <p className="whitespace-normal">{msg.text}</p>
                        <p
                          className={`mt-1 text-xs ${
                            isMerchant ? "text-emerald-100/70" : "text-gray-400"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#E5E7EB] p-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && replyText.trim() && !isSending) {
                        handleSendReply();
                      }
                    }}
                    className="flex-1 rounded-xl border border-[#E5E7EB] bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || isSending}
                    className="flex h-9 shrink-0 items-center justify-center rounded-xl bg-[#10B981] px-4 text-sm font-semibold text-white hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : !selectedTicket ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-8"
            >
              <div className="text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-3 mx-auto">
                  <AlertCircle size={32} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">Select a ticket to view conversation</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-8"
            >
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">Loading conversation...</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <CreateTicketModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
