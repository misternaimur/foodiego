"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Trash2, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useVendorSocket } from "@/hooks/useVendorSocket";
import type { NotificationItem } from "@/components/shared/NotificationBell";

// UPDATE (notification-system fix): this page used to render a hardcoded
// local array ("New order #ORD-5521 received", "Sarah M. left a 5-star
// review"...) with inert Mark-all-read/delete buttons — nothing was ever
// real. It now reads and manages this vendor's actual notifications from
// foodiego-backend's /api/notifications (see routes/notificationRoutes.js).

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function VendorNotificationsPage() {
  const { isConnected } = useVendorSocket();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/v1/notifications", { credentials: "include" });
      if (!res.ok) return;
      const data = (await res.json()) as { notifications: NotificationItem[] };
      setItems(data.notifications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/v1/notifications/read-all", { method: "PATCH", credentials: "include" }).catch(() => load());
  };

  const handleMarkRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    await fetch(`/api/v1/notifications/${id}`, { method: "PATCH", credentials: "include" }).catch(() => load());
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    setItems((prev) => prev.filter((n) => n._id !== id));
    try {
      await fetch(`/api/v1/notifications/${id}`, { method: "DELETE", credentials: "include" });
    } catch {
      load();
    } finally {
      setBusyId(null);
    }
  };

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Stay updated with your restaurant activity
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${
            isConnected
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-gray-100 text-gray-500 border border-gray-200"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          {isConnected ? "Live" : "Offline"}
        </span>
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <span>Recent Notifications</span>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <Check size={14} />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <LoaderCircle size={22} className="animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <Bell size={28} className="text-gray-300" />
          <p className="mt-3 text-sm font-semibold text-gray-700">No notifications yet</p>
          <p className="mt-1 text-xs text-gray-400">New orders, reviews, and payments will show up here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div
              key={n._id}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
                n.read ? "border-gray-200 bg-white hover:bg-gray-50" : "border-emerald-200 bg-emerald-50/50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  n.read ? "bg-gray-100 text-gray-500" : "bg-emerald-100 text-emerald-600"
                }`}
              >
                <Bell size={18} />
              </div>
              <Link href={n.link || "#"} onClick={() => !n.read && handleMarkRead(n._id)} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                <p className="text-xs text-gray-500">{n.message}</p>
                <p className="mt-0.5 text-[11px] text-gray-400">{timeAgo(n.createdAt)}</p>
              </Link>
              {!n.read && <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
              <button
                onClick={() => handleDelete(n._id)}
                disabled={busyId === n._id}
                className="shrink-0 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label="Delete notification"
              >
                {busyId === n._id ? <LoaderCircle size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
