"use client";

import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { updateOrderStatus } from "@/app/(main)/actions/admin";
import type { OrderBookingStatus } from "@/models/OrderBooking";

const STATUS_OPTIONS: OrderBookingStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const LABELS: Record<OrderBookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderStatusActions({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderBookingStatus;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState(status);

  const handleChange = (next: OrderBookingStatus) => {
    setValue(next);
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, next);
      if (!result.ok) {
        setError(result.message ?? "Could not update status.");
        setValue(status);
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="relative inline-flex items-center">
        {pending && <LoaderCircle size={13} className="absolute -left-5 animate-spin text-gray-400" />}
        <select
          value={value}
          disabled={pending}
          onChange={(e) => handleChange(e.target.value as OrderBookingStatus)}
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:border-[#0d9488] focus:outline-none disabled:opacity-50"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
