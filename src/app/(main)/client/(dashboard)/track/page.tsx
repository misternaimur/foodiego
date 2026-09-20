"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Bike, Package, Phone, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { ordersApi, orderRestaurantName, type Order } from "@/lib/clientApi";
import OrderChatPanel from "@/components/chat/OrderChatPanel";

const STEP_ORDER: Order["status"][] = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];

const steps = [
  { key: "placed", label: "Order Placed", statuses: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"] },
  { key: "preparing", label: "Preparing", statuses: ["preparing", "out_for_delivery", "delivered"] },
  { key: "way", label: "On the Way", statuses: ["out_for_delivery", "delivered"] },
  { key: "delivered", label: "Delivered", statuses: ["delivered"] },
];

export default function ClientTrackOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .list()
      .then((data) => setOrders(data.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoaderCircle size={26} className="animate-spin text-[#15462D]" />
      </div>
    );
  }

  const activeOrder = orders.find((o) => o.status !== "delivered" && o.status !== "cancelled");

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
  const itemsSummary = activeOrder.items.map((i) => `${i.name} x${i.quantity}`).join(", ");
  const currentStepLabel =
    activeOrder.status === "out_for_delivery"
      ? "On the Way"
      : activeOrder.status === "preparing" || activeOrder.status === "confirmed"
      ? "Preparing"
      : "Order Received";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Track Live Order</h1>
        <p className="mt-1 text-sm text-gray-500">
          #{activeOrder._id.slice(-6).toUpperCase()} &middot; {orderRestaurantName(activeOrder)}
        </p>
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
            <p className="text-xl font-extrabold text-gray-900">৳{activeOrder.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="relative mt-6 flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#15462D_0,transparent_25%),radial-gradient(circle_at_70%_55%,#F6A429_0,transparent_25%)] opacity-40" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#15462D]/10">
            <Bike size={22} className="text-[#15462D]" />
          </div>
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

        {/* Rider info */}
        {activeOrder.riderId && typeof activeOrder.riderId === "object" ? (
          <>
            <div className="mt-8 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-[#15462D]">
                  {activeOrder.riderId.fullName?.charAt(0).toUpperCase() || "R"}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{activeOrder.riderId.fullName}</p>
                  <p className="text-xs text-gray-500">Your delivery rider</p>
                </div>
              </div>
              {activeOrder.riderId.phone && (
                <a
                  href={`tel:${activeOrder.riderId.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  <Phone size={13} /> Call
                </a>
              )}
            </div>

            <div className="mt-4">
              <OrderChatPanel orderId={activeOrder._id} peerLabel="your rider" />
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
