"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Package, Phone, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ordersApi, orderRestaurantName, type Order } from "@/lib/clientApi";
import OrderChatPanel from "@/components/chat/OrderChatPanel";
import LiveTrackingMap from "@/components/client/LiveTrackingMap";
import type { OrderTracking } from "@/app/api/v1/client/orders/[orderId]/tracking/route";

const STEP_ORDER: Order["status"][] = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

const steps = [
  { key: "placed", label: "Order Placed", statuses: ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"] },
  { key: "preparing", label: "Preparing", statuses: ["preparing", "ready", "out_for_delivery", "delivered"] },
  { key: "way", label: "On the Way", statuses: ["out_for_delivery", "delivered"] },
  { key: "delivered", label: "Delivered", statuses: ["delivered"] },
];

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.round(minutes / 60)}h ago`;
}

export default function ClientTrackOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  // A chat notification links here as ?order=<id>, so that order is shown
  // even when the customer has more than one order in flight.
  const requestedOrderId = useSearchParams().get("order");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // UPDATE (order-chat fix): the order list used to load once. A rider is
  // usually assigned *after* the customer opens this page, so the rider
  // card and chat never appeared without a manual refresh. Re-polling keeps
  // status, rider and chat availability current.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await ordersApi.list();
        if (!cancelled) setOrders(data.orders);
      } catch {
        // Keep the last known list; next poll retries.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const activeOrder = activeOrders.find((o) => o._id === (selectedOrderId ?? requestedOrderId)) ?? activeOrders[0];
  const activeOrderId = activeOrder?._id;

  // UPDATE (live-tracking fix): polls the real rider-GPS-backed tracking
  // endpoint (see src/app/api/v1/client/orders/[orderId]/tracking/route.ts)
  // every 10s while there's an active order, replacing what used to be a
  // permanently-static placeholder.
  useEffect(() => {
    if (!activeOrderId) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/v1/client/orders/${activeOrderId}/tracking`, { credentials: "include" });
        if (!res.ok || cancelled) return;
        setTracking(await res.json());
      } catch {
        // Next poll retries.
      }
    };
    poll();
    const interval = setInterval(poll, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      setTracking(null);
    };
  }, [activeOrderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoaderCircle size={26} className="animate-spin text-[#15462D]" />
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
        <Package size={30} className="text-gray-300" />
        <p className="mt-3 text-sm font-semibold text-gray-700">No active orders right now</p>
        <p className="mt-1 text-xs text-gray-400">Once you place an order, you can track it here in real-time.</p>
        <Link
          href="/restaurants"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#15462D] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0e3320]"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const currentIndex = STEP_ORDER.indexOf(activeOrder.status);
  const assignedRider: { fullName: string; phone?: string } | null =
    activeOrder.riderId && typeof activeOrder.riderId === "object"
      ? activeOrder.riderId
      : tracking?.rider
        ? { fullName: tracking.rider.fullName, phone: tracking.rider.phone }
        : null;
  const itemsSummary = activeOrder.items.map((i) => `${i.name} x${i.quantity}`).join(", ");
  const currentStepLabel =
    activeOrder.status === "out_for_delivery"
      ? "On the Way"
      : activeOrder.status === "preparing" || activeOrder.status === "confirmed"
      ? "Preparing"
      : "Order Received";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Track Live Order</h1>
          <p className="mt-1 text-sm text-gray-500">
            #{activeOrder._id.slice(-6).toUpperCase()} &middot; {orderRestaurantName(activeOrder)}
          </p>
        </div>
        {activeOrders.length > 1 && (
          <select
            value={activeOrder._id}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700"
            aria-label="Choose which order to track"
          >
            {activeOrders.map((o) => (
              <option key={o._id} value={o._id}>
                #{o._id.slice(-6).toUpperCase()} · {orderRestaurantName(o)}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#15462D]">{currentStepLabel}</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">
              {activeOrder.status === "out_for_delivery" ? "Your rider is on the way" : "We're getting your order ready"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{itemsSummary}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-500">Order Total</p>
            <p className="text-xl font-extrabold text-gray-900">${activeOrder.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Live tracking map — real rider GPS when the order is out for delivery */}
        <div className="relative mt-6">
          <LiveTrackingMap
            riderLat={tracking?.rider?.lat ?? null}
            riderLng={tracking?.rider?.lng ?? null}
            riderName={tracking?.rider?.fullName}
            className="h-52"
          />
          {tracking?.rider?.lat != null && tracking.rider.updatedAt && (
            <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-gray-600 shadow-sm">
              Updated {timeAgo(tracking.rider.updatedAt)}
            </span>
          )}
        </div>

        {/* Progress steps */}
        <div className="mt-8 space-y-5">
          {steps.map((step, idx) => {
            const done = step.statuses.includes(activeOrder.status);
            const isCurrent = idx === currentIndex || (idx === 0 && currentIndex <= 0);
            return (
              <div key={step.key} className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    done && isCurrent
                      ? "border-amber-500 bg-amber-500"
                      : done
                      ? "border-[#15462D] bg-[#15462D]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {done && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span
                  className={`text-sm ${
                    done && isCurrent ? "font-bold text-amber-600" : done ? "font-medium text-gray-800" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rider info — from the populated order, or the live tracking poll if that saw the assignment first */}
        {assignedRider ? (
          <>
            <div className="mt-8 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-[#15462D]">
                  {assignedRider.fullName?.charAt(0).toUpperCase() || "R"}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{assignedRider.fullName}</p>
                  <p className="text-xs text-gray-500">Your delivery rider</p>
                </div>
              </div>
              {assignedRider.phone && (
                <a
                  href={`tel:${assignedRider.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  <Phone size={13} /> Call
                </a>
              )}
            </div>

            <div className="mt-4">
              <OrderChatPanel orderId={activeOrder._id} peerLabel="your rider" channel="customer_rider" />
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center text-xs text-gray-500">
            A rider will be assigned once the restaurant confirms your order.
          </div>
        )}
      </div>
    </div>
  );
}
