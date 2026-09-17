'use client';

import React, { useState } from 'react';
import { Search, Filter, Paperclip, Send, AlertCircle, Clock, MessageSquare } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  updated: string;
}

interface Message {
  id: string;
  sender: 'user' | 'support';
  name?: string;
  text: string;
  time: string;
}

const tickets: Ticket[] = [
  { id: '#TK-8492', subject: 'Missing payment for Order #1024', category: 'Payment', priority: 'High', updated: '10 mins ago' },
  { id: '#TK-8488', subject: 'Customer claims missing item', category: 'Order Issue', priority: 'Medium', updated: '2 hours ago' },
  { id: '#TK-8475', subject: 'Menu update request not processed', category: 'Technical', priority: 'Low', updated: 'Yesterday' },
];

const messages: Message[] = [
  {
    id: '1',
    sender: 'user',
    text: "Hello, I haven't received the payout for Order #1024 delivered yesterday. It shows as 'Pending' in my dashboard.",
    time: '10:30 AM',
  },
  {
    id: '2',
    sender: 'support',
    name: 'Sarah (Support Agent)',
    text: 'Hi there. I apologize for the delay. Let me look into Order #1024 for you right now.',
    time: '10:32 AM',
  },
  {
    id: '3',
    sender: 'support',
    text: "It appears there was a brief glitch with our payment gateway yesterday evening. I have manually re-initiated the transfer. It should reflect in your account within 24 hours.",
    time: '10:33 AM',
  },
];

const priorityStyles: Record<string, string> = {
  High: 'bg-red-50 text-red-600 border-red-100',
  Medium: 'bg-amber-50 text-amber-600 border-amber-100',
  Low: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function SupportTicketsPage() {
  const [activeTab, setActiveTab] = useState('Open');
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Support Tickets</h1>
            <p className="mt-2 text-gray-500">Manage and track your inquiries with FoodieGo Support.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-[#00A36C] hover:bg-[#008f5a] text-white font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all">
            <span className="text-lg leading-none">+</span>
            <span>Create New Ticket</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Ticket List */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm">
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-gray-100 px-6 pt-4">
              {['Open', 'In Progress', 'Resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-3 text-sm font-semibold transition-colors ${
                    activeTab === tab ? 'text-[#00A36C]' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab === 'Open' ? 'Open (3)' : tab === 'In Progress' ? 'In Progress (1)' : 'Resolved (12)'}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00A36C] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ticket ID or subject..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A36C]/20 focus:border-[#00A36C] transition-all"
                />
              </div>
              <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm py-2.5 px-4 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter size={16} />
                Filter
              </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <div className="col-span-3">Ticket ID</div>
              <div className="col-span-4">Subject</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-1 text-right">Updated</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-50">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full grid grid-cols-12 gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedTicket.id === ticket.id ? 'bg-[#ecfdf5]' : ''
                  }`}
                >
                  <div className="col-span-3 text-sm font-semibold text-gray-900">{ticket.id}</div>
                  <div className="col-span-4 text-sm text-gray-700 truncate">{ticket.subject}</div>
                  <div className="col-span-2 text-sm text-gray-500">{ticket.category}</div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${priorityStyles[ticket.priority]}`}>
                      {ticket.priority === 'High' && <AlertCircle size={12} className="mr-1" />}
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="col-span-1 text-sm text-gray-400 text-right flex items-center justify-end gap-1">
                    {selectedTicket.id === ticket.id && <Clock size={14} className="text-[#00A36C]" />}
                    {ticket.updated}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Chat View */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
            {/* Ticket Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-gray-900">{selectedTicket.id}</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${priorityStyles[selectedTicket.priority]}`}>
                  {selectedTicket.priority} Priority
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedTicket.subject}</h3>
              <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                <MessageSquare size={12} />
                Ticket Created • Oct 24, 10:30 AM
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#00A36C] text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                  }`}>
                    {msg.sender === 'support' && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-6 rounded-full bg-[#00A36C] flex items-center justify-center text-white text-[10px] font-bold">S</div>
                        <span className="text-xs font-semibold text-gray-600">{msg.name}</span>
                      </div>
                    )}
                    <p>{msg.text}</p>
                    <span className={`text-[10px] mt-1.5 block ${msg.sender === 'user' ? 'text-white/70 text-right' : 'text-gray-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                <button className="text-[#00A36C] hover:text-[#008f5a] transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
