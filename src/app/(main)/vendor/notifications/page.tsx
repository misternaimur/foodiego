"use client";

import { Bell, Check, Trash2, Star, Clock, DollarSign } from "lucide-react";
import { useVendorSocket } from "@/hooks/useVendorSocket";

const recentNotifications = [
  { id: 1, type: "order", message: "New order #ORD-5521 received", time: "2 min ago", icon: DollarSign, unread: true },
  { id: 2, type: "review", message: "Sarah M. left a 5-star review", time: "15 min ago", icon: Star, unread: true },
  { id: 3, type: "delivery", message: "Rider assigned to order #ORD-5520", time: "1 hour ago", icon: Clock, unread: false },
  { id: 4, type: "payment", message: "Payment of $1,238 received for order #ORD-5519", time: "3 hours ago", icon: DollarSign, unread: false },
  { id: 5, type: "support", message: "Support ticket #TK-8492 updated", time: "Yesterday", icon: Bell, unread: false },
];

export default function VendorNotificationsPage() {
  const { isConnected } = useVendorSocket();

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
        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
          <Check size={14} />
          Mark all as read
        </button>
      </div>

      <div className="space-y-2">
        {recentNotifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
              n.unread
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }}`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                n.unread ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
              }`}
            >
              <n.icon size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{n.message}</p>
              <p className="text-xs text-gray-500">{n.time}</p>
            </div>
            {n.unread && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
            <button className="text-gray-400 hover:text-gray-600">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
