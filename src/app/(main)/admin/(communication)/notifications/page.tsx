"use client";

import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  UserPlus,
  Settings,
  LoaderCircle,
} from 'lucide-react';
import Link from 'next/link';
import type { NotificationItem } from '@/components/shared/NotificationBell';

// UPDATE (notification-system fix): this page used to render a hardcoded
// local array ("High Failed Payment Rate Detected", a fake "Stripe batch
// payout" line, etc.) with Mark-all-read/delete buttons that only mutated
// local state — nothing was ever real or backend-connected. It now reads
// and manages this admin's actual notifications from foodiego-backend's
// /api/notifications. The type-based icon design is kept, mapped from the
// real notification `type` string (e.g. "order_placed", "vendor_approved")
// onto the same five visual buckets.

type VisualType = 'alert' | 'success' | 'payment' | 'user' | 'system';

function visualTypeOf(type: string): VisualType {
  if (type.includes('rejected') || type.includes('suspended')) return 'alert';
  if (type.includes('delivered') || type.includes('approved')) return 'success';
  if (type.includes('payment')) return 'payment';
  if (type.includes('vendor') || type.includes('rider') || type.includes('registration')) return 'user';
  return 'system';
}

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

const TYPE_ICON: Record<VisualType, React.ReactNode> = {
  alert: <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center"><AlertCircle size={18} /></div>,
  success: <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center"><CheckCircle2 size={18} /></div>,
  payment: <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center"><DollarSign size={18} /></div>,
  user: <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center"><UserPlus size={18} /></div>,
  system: <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center"><Settings size={18} /></div>,
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Unread'>('All');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/v1/notifications', { credentials: 'include' });
      if (!res.ok) return;
      const data = (await res.json()) as { notifications: NotificationItem[] };
      setNotifications(data.notifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    await fetch('/api/v1/notifications/read-all', { method: 'PATCH', credentials: 'include' }).catch(() => load());
  };

  const handleDeleteNotification = async (id: string) => {
    setBusyId(id);
    setNotifications((prev) => prev.filter((item) => item._id !== id));
    try {
      await fetch(`/api/v1/notifications/${id}`, { method: 'DELETE', credentials: 'include' });
    } catch {
      load();
    } finally {
      setBusyId(null);
    }
  };

  const handleOpen = async (item: NotificationItem) => {
    if (item.read) return;
    setNotifications((prev) => prev.map((n) => (n._id === item._id ? { ...n, read: true } : n)));
    await fetch(`/api/v1/notifications/${item._id}`, { method: 'PATCH', credentials: 'include' }).catch(() => {});
  };

  const filteredNotifications = notifications.filter((item) => (activeTab === 'Unread' ? !item.read : true));
  const unreadCount = notifications.filter((item) => !item.read).length;

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
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                <CheckCheck size={15} className="text-gray-500" />
                <span>Mark all as read</span>
              </button>
            )}
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
            {loading ? (
              <div className="px-6 py-16 text-center text-gray-400">
                <LoaderCircle size={24} className="mx-auto animate-spin" />
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="px-6 py-16 text-center text-gray-400 text-xs space-y-2">
                <Bell size={28} className="mx-auto text-gray-300 stroke-[1.5]" />
                <p>No notifications found in this view.</p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item._id}
                  className={`p-5 sm:px-6 flex items-start justify-between gap-4 transition-colors hover:bg-gray-50/60 ${
                    !item.read ? 'bg-emerald-50/20' : 'bg-white'
                  }`}
                >
                  <Link href={item.link || '#'} onClick={() => handleOpen(item)} className="flex items-start gap-3.5 min-w-0">
                    {/* Notification Type Icon */}
                    <div className="mt-0.5 shrink-0">{TYPE_ICON[visualTypeOf(item.type)]}</div>

                    {/* Content */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xs font-bold text-gray-900">{item.title}</h2>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[11px] font-medium text-gray-400 block pt-0.5">
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDeleteNotification(item._id)}
                      disabled={busyId === item._id}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete notification"
                    >
                      {busyId === item._id ? <LoaderCircle size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
