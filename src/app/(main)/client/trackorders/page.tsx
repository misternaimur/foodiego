"use client";

import { CheckCircle2, Bike, Package, Phone } from "lucide-react";
import Link from "next/link";

const steps = [
  { key: "placed", label: "Order Placed", done: true },
  { key: "preparing", label: "Preparing", done: true },
  { key: "way", label: "On the Way", done: true, current: true },
  { key: "delivered", label: "Delivered", done: false },
];

const hasActiveOrder = true;

export default function ClientTrackOrderPage() {
  if (!hasActiveOrder) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Track Live Order</h1>
        <p className="mt-1 text-sm text-gray-500">Order #FG-10234 &middot; Greenhouse Cafe</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#15462D]">On the Way</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">Arriving in ~15 minutes</h2>
            <p className="mt-1 text-sm text-gray-500">Truffle Smashburger, Fries</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-500">Order Total</p>
            <p className="text-xl font-extrabold text-gray-900">$22.50</p>
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
          {steps.map((step) => (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  step.current
                    ? "border-amber-500 bg-amber-500"
                    : step.done
                    ? "border-[#15462D] bg-[#15462D]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {step.done && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <span
                className={`text-sm ${
                  step.current ? "font-bold text-amber-600" : step.done ? "font-medium text-gray-800" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Rider info */}
        <div className="mt-8 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-[#15462D]">
              M
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Marcus Johnson</p>
              <p className="text-xs text-gray-500">Your delivery rider</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">
            <Phone size={13} /> Call
          </button>
        </div>
      </div>
    </div>
  );
}