"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, Trash2, LoaderCircle } from "lucide-react";

// ============================================================
// UPDATE (notification-system fix): this replaces a purely decorative bell
// icon (a hardcoded permanent red dot, no click handler, no data behind it)
// that existed on the vendor and admin headers, and adds the same real
// notification surface to the customer navbar and rider shell, neither of
// which had one at all. Backed by foodiego-backend's /api/notifications
// (see routes/notificationRoutes.js) via the Next.js proxy at
// src/app/api/v1/notifications/**.
// ============================================================

export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const POLL_INTERVAL_MS = 30_000;

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

interface NotificationBellProps {
  /** Full className for the bell trigger button, so it can match each role's existing header chrome. */
  buttonClassName?: string;
  iconSize?: number;
}

export default function NotificationBell({
  buttonClassName = "relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
  iconSize = 20,
}: NotificationBellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/notifications", { credentials: "include" });
      if (!res.ok) return;
      const data = (await res.json()) as { notifications: NotificationItem[]; unreadCount: number };
      setItems(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // Next poll retries.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(load, POLL_INTERVAL_MS);
    Promise.resolve().then(load);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenItem = async (item: NotificationItem) => {
    setOpen(false);
    if (!item.read) {
      setItems((prev) => prev.map((n) => (n._id === item._id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      fetch(`/api/v1/notifications/${item._id}`, { method: "PATCH", credentials: "include" }).catch(() => {});
    }
    if (item.link) router.push(item.link);
  };

  const handleMarkAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await fetch("/api/v1/notifications/read-all", { method: "PATCH", credentials: "include" });
    } catch {
      load();
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    const wasUnread = items.find((n) => n._id === id)?.read === false;
    setItems((prev) => prev.filter((n) => n._id !== id));
    if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await fetch(`/api/v1/notifications/${id}`, { method: "DELETE", credentials: "include" });
    } catch {
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={buttonClassName}
        aria-label="Notifications"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Bell size={iconSize} />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] origin-top-right rounded-2xl border border-slate-200/70 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-bold text-slate-900">Notifications</p>
            {unreadCount > 0 && (
              <button type="button" onClick={handleMarkAllRead} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-slate-400">
                <LoaderCircle size={18} className="animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400">You&apos;re all caught up.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className={`group flex items-start gap-2 border-b border-slate-50 px-4 py-3 last:border-none ${item.read ? "" : "bg-emerald-50/50"}`}
                >
                  <button type="button" onClick={() => handleOpenItem(item)} className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-1.5">
                      {!item.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />}
                      <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.message}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{timeAgo(item.createdAt)}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    disabled={busyId === item._id}
                    aria-label="Delete notification"
                    className="shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 disabled:opacity-60"
                  >
                    {busyId === item._id ? <LoaderCircle size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              ))
            )}
          </div>

          {unreadCount === 0 && items.length > 0 && (
            <div className="flex items-center gap-1.5 border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
              <Check size={12} /> All read
            </div>
          )}
        </div>
      )}
    </div>
  );
}
