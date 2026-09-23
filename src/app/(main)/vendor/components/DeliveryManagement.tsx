"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { useActiveDeliveries, type Delivery, type Rider } from "@/hooks/useDeliveryManagement";
import { springTransition, staggerContainer, staggerItem } from "@/app/(main)/vendor/components/motion";
import OrderChatPanel from "@/components/chat/OrderChatPanel";

type DeliveryTab = "active" | "riders" | "history";

// UPDATE (rider-GPS fix): "Nearby Riders" used to be a fixed 3-entry fake
// array ("Tom Smith", "Mike K.", "Rachel J.") completely disconnected from
// `data.riders`, which useActiveDeliveries already fetches for real. It
// now renders that real rider list instead of the fake one.
const statusConfig: Record<string, { label: string; className: string }> = {
  "Picked Up": {
    label: "Picked Up",
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  Assigning: {
    label: "Assigning...",
    className: "bg-purple-50 text-purple-600 border-purple-200",
  },
  Delayed: {
    label: "Delayed (Traffic)",
    className: "bg-red-50 text-red-600 border-red-200",
  },
  "In Transit": {
    label: "In Transit",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const riderStatusClasses: Record<Rider["status"], string> = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Assigned: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Offline: "bg-slate-100 text-slate-500 border-slate-200",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function StatusPill({ delivery }: { delivery: Delivery }) {
  const config = statusConfig[delivery.status] || statusConfig.Assigning;
  const label = delivery.status === "Delayed" && delivery.delayReason ? `Delayed (${delivery.delayReason})` : config.label;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      {label}
    </span>
  );
}

function DispatchRow({ delivery, defaultChatOpen = false }: { delivery: Delivery; defaultChatOpen?: boolean }) {
  const isDelayed = delivery.status === "Delayed";
  // UPDATE (restaurant-rider chat fix): the vendor previously had no way
  // to message the rider handling an order — this expands the same
  // OrderChatPanel used elsewhere, on the "restaurant_rider" channel the
  // backend already supported but nothing on the frontend used.
  const [chatOpen, setChatOpen] = useState(defaultChatOpen);
  const shortId = delivery.id.slice(-6).toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className={`rounded-2xl border bg-white p-4 ${isDelayed ? "border-red-200 bg-red-50/80" : "border-slate-200/80"}`}
    >
      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] grid-rows-[auto_auto_auto] gap-x-4 gap-y-4 lg:grid-cols-[3.5rem_minmax(0,1fr)_9.5rem_10.5rem_5rem_5rem] lg:grid-rows-1 lg:gap-4 lg:items-center">
        <div className="flex h-14 items-center justify-center rounded-xl border text-sm font-bold">
          {isDelayed ? (
            <span className="bg-red-50 text-red-700 border-red-200">#{shortId}</span>
          ) : (
            <span className="bg-blue-50 text-blue-700 border-blue-200">#{shortId}</span>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-bold text-slate-900">{delivery.customerName}</p>
          <p className="mt-0.5 truncate text-sm text-slate-500">{delivery.address}</p>
        </div>

        <div className="col-span-2 flex items-center gap-3 lg:col-span-1 lg:flex-col lg:items-start lg:gap-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
            {getInitials(delivery.assignedRider)}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 lg:mb-1">Rider</p>
            <p className="truncate text-sm font-semibold text-slate-700">{delivery.assignedRider}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 lg:mb-1">Status</p>
          <StatusPill delivery={delivery} />
        </div>

        <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 lg:mb-1">ETA</p>
          <p className={`text-base font-bold ${isDelayed ? "text-red-600" : "text-slate-900"}`}>{delivery.eta}</p>
        </div>

        <div className="flex items-center lg:justify-end">
          {delivery.riderId && (
            <button
              type="button"
              onClick={() => setChatOpen((v) => !v)}
              aria-expanded={chatOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                chatOpen ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              aria-label="Chat with rider"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {chatOpen && delivery.riderId && (
        <div className="mt-4">
          <OrderChatPanel orderId={delivery.orderId} peerLabel="the rider" channel="restaurant_rider" />
        </div>
      )}
    </motion.div>
  );
}

function NearbyRidersList({ riders }: { riders: Rider[] }) {
  if (riders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center text-sm text-slate-500">
        No approved riders yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {riders.map((rider) => (
        <div key={rider.id} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
            {getInitials(rider.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{rider.name}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{rider.vehicle}</p>
          </div>
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${riderStatusClasses[rider.status]}`}>
            {rider.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DeliveryManagement() {
  const [activeTab, setActiveTab] = useState<DeliveryTab>("active");
  const { data, isLoading, isError } = useActiveDeliveries();
  // A chat notification links here as ?tab=delivery&chat=<orderId>; that row opens with its chat expanded.
  const chatOrderId = useSearchParams().get("chat");

  const allDeliveries = data?.deliveries || [];
  const activeDeliveries = allDeliveries.filter((delivery) =>
    ["Picked Up", "Assigning", "Delayed", "In Transit"].includes(delivery.status),
  );
  // UPDATE (order-chat fix): this used to show only the 5 most recent
  // dispatches, so any older in-flight order - and its rider chat - was
  // unreachable. Every active dispatch is listed now.
  const featuredDeliveries = activeDeliveries;
  const deliveredDeliveries = allDeliveries.filter((delivery) => delivery.status === "Delivered");
  const riders = data?.riders || [];

  const tabs: Array<{ id: DeliveryTab; label: string }> = [
    { id: "active", label: "Active Deliveries" },
    { id: "riders", label: "Rider Status" },
    { id: "history", label: "Delivery History" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <motion.div variants={staggerItem}>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Delivery Management</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor active dispatches, rider status, and fulfillment metrics.</p>
        </motion.div>

        <motion.div variants={staggerItem} className="flex w-fit items-center gap-1 rounded-2xl bg-slate-100 p-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={isActive ? "rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm" : "px-4 py-2 text-sm font-medium text-slate-600"}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>
      </motion.div>

      {isError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
          Unable to load delivery data. Please try again later.
        </div>
      ) : activeTab === "active" ? (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-12 gap-6">
          <div className="col-span-12 rounded-3xl border border-slate-200/80 bg-slate-50/50 p-6 lg:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Active Dispatches</h2>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">🟢 {activeDeliveries.length} En Route</span>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-20 animate-pulse rounded-2xl border border-slate-200/80 bg-white" />
                ))}
              </div>
            ) : featuredDeliveries.length > 0 ? (
              <div className="space-y-4">
                {featuredDeliveries.map((delivery) => (
                  <DispatchRow
                    key={`${delivery.orderId}:${delivery.orderId === chatOrderId}`}
                    delivery={delivery}
                    defaultChatOpen={delivery.orderId === chatOrderId}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-52 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-sm text-slate-500">
                No active deliveries right now
              </div>
            )}
          </div>

          <aside className="col-span-12 space-y-6 lg:col-span-4">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-5">
              <h3 className="text-base font-bold text-slate-900">Nearby Riders</h3>
              <div className="mt-4">
                <NearbyRidersList riders={riders} />
              </div>
            </div>
          </aside>
        </motion.div>
      ) : activeTab === "riders" ? (
        <motion.div variants={staggerItem} initial="initial" animate="animate" className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-900">Rider Status</h2>
          <NearbyRidersList riders={riders} />
        </motion.div>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Delivery History</h2>
          {deliveredDeliveries.length > 0 ? (
            deliveredDeliveries.map((delivery) => (
              <div key={delivery.orderId} className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">#{delivery.id.slice(-6).toUpperCase()}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{delivery.customerName}</p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Delivered</span>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center text-sm text-slate-500">No delivery history available.</div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
