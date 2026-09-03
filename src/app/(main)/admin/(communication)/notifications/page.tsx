"use client";

import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  UserPlus, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Filter 
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'alert' | 'success' | 'payment' | 'user' | 'system';
  timestamp: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "High Failed Payment Rate Detected",
    description: "Transaction monitoring flagged a 15% spike in failed card authorizations over the last hour.",
    type: "alert",
    timestamp: "10 minutes ago",
    isRead: false
  },
  {
    id: "2",
    title: "New Vendor Application Submitted",
    description: "Greenhouse Cafe submitted a new vendor application requiring review and approval.",
    type: "user",
    timestamp: "45 minutes ago",
    isRead: false
  },
  {
    id: "3",
    title: "Monthly Payout Successfully Processed",
    description: "Stripe batch payout of $42,500.00 to regional vendors has been completed.",
    type: "payment",
    timestamp: "2 hours ago",
    isRead: true
  },
  {
    id: "4",
    title: "System Security Update Applied",
    description: "MongoDB Atlas cluster permissions and database network rules were successfully updated.",
    type: "system",
    timestamp: "5 hours ago",
    isRead: true
  },
  {
    id: "5",
    title: "Milestone Achieved: 120k Transactions",
    description: "Your platform crossed 124,000 total recorded transactions this month.",
    type: "success",
    timestamp: "Yesterday",
    isRead: true
  }
];

export default function AdminNotificationsPage() {
  // Structured states ready for backend API endpoints (e.g. PATCH /api/notifications/read, DELETE /api/notifications/:id)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<'All' | 'Unread'>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Handler ready for marking all as read via API
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  // Handler ready for deleting/clearing a single notification via API
  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  // Filter list based on active tab
  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'Unread') return !item.isRead;
    return true;
  });

  const unreadCount = notifications.filter(item => !item.isRead).length;

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
              Notifications Center
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage alerts, system updates, and administrative activities.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <CheckCheck size={15} className="text-gray-500" />
              <span>Mark all as read</span>
            </button>
          </div>
        </div>

        {/* Main Content Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          
          {/* Navigation Tabs Header */}
          <div className="border-b border-gray-200 px-6 pt-4 flex gap-8 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('All')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'All'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              All Notifications ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('Unread')}
              className={`pb-3.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'Unread'
                  ? 'border-[#065f46] text-[#065f46]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="px-6 py-16 text-center text-gray-400 text-xs space-y-2">
                <Bell size={28} className="mx-auto text-gray-300 stroke-[1.5]" />
                <p>No notifications found in this view.</p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-5 sm:px-6 flex items-start justify-between gap-4 transition-colors hover:bg-gray-50/60 ${
                    !item.isRead ? 'bg-emerald-50/20' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    
                    {/* Notification Type Icon */}
                    <div className="mt-0.5 shrink-0">
                      {item.type === 'alert' && (
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                          <AlertCircle size={18} />
                        </div>
                      )}
                      {item.type === 'success' && (
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                          <CheckCircle2 size={18} />
                        </div>
                      )}
                      {item.type === 'payment' && (
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                          <DollarSign size={18} />
                        </div>
                      )}
                      {item.type === 'user' && (
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                          <UserPlus size={18} />
                        </div>
                      )}
                      {item.type === 'system' && (
                        <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
                          <Settings size={18} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xs font-bold text-gray-900">{item.title}</h2>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                      <span className="text-[11px] font-medium text-gray-400 block pt-0.5">
                        {item.timestamp}
                      </span>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleDeleteNotification(item.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Showing page {currentPage} of 1
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-400 transition-all disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                disabled
                className="p-2 hover:bg-gray-50 rounded-lg border border-gray-200 text-gray-400 transition-all opacity-40 cursor-pointer"
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