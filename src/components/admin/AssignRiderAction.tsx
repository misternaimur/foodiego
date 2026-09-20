"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Truck } from "lucide-react";
import { assignRiderToOrder } from "@/app/(main)/actions/admin";

export interface RiderOption {
  id: string;
  fullName: string;
}

export default function AssignRiderAction({
  orderId,
  currentRiderId,
  riders,
}: {
  orderId: string;
  currentRiderId?: string;
  riders: RiderOption[];
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState(currentRiderId || "");

  const handleChange = (riderId: string) => {
    if (!riderId) return;
    setValue(riderId);
    setError(null);
    startTransition(async () => {
      const result = await assignRiderToOrder(orderId, riderId);
      if (!result.ok) setError(result.message ?? "Could not assign rider.");
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="relative inline-flex items-center gap-1.5">
        <Truck size={13} className="text-gray-400" />
        {pending && <LoaderCircle size={12} className="animate-spin text-gray-400" />}
        <select
          value={value}
          disabled={pending}
          onChange={(e) => handleChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:border-[#0d9488] focus:outline-none disabled:opacity-50"
        >
          <option value="" disabled>
            Assign rider
          </option>
          {riders.map((r) => (
            <option key={r.id} value={r.id}>
              {r.fullName}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
