"use client";

import { useState, useTransition } from "react";
import { Check, LoaderCircle, Pencil, X } from "lucide-react";
import { setVendorCommissionRate } from "@/app/(main)/actions/admin";
import { DEFAULT_PLATFORM_COMMISSION_RATE_PERCENT } from "@/lib/commission";

// UPDATE (per-vendor-commission fix): the only way to change a vendor's
// commission rate used to be editing a hardcoded constant in code, applied
// identically to every vendor. This is the admin-facing control for the
// new per-restaurant Restaurant.commissionRate field.
export default function VendorCommissionInput({
  restaurantId,
  commissionRate,
}: {
  restaurantId: string;
  commissionRate?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(commissionRate ?? DEFAULT_PLATFORM_COMMISSION_RATE_PERCENT));
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isCustom = typeof commissionRate === "number";

  const handleSave = () => {
    const rate = Number(value);
    setError(null);
    startTransition(async () => {
      const result = await setVendorCommissionRate(restaurantId, Number.isNaN(rate) ? null : rate);
      if (!result.ok) {
        setError(result.message ?? "Could not save");
        return;
      }
      setEditing(false);
    });
  };

  const handleResetToDefault = () => {
    setError(null);
    startTransition(async () => {
      const result = await setVendorCommissionRate(restaurantId, null);
      if (!result.ok) {
        setError(result.message ?? "Could not save");
        return;
      }
      setValue(String(DEFAULT_PLATFORM_COMMISSION_RATE_PERCENT));
      setEditing(false);
    });
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors ${
          isCustom ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100" : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
        }`}
      >
        {commissionRate ?? DEFAULT_PLATFORM_COMMISSION_RATE_PERCENT}%
        {!isCustom && <span className="text-gray-400">(default)</span>}
        <Pencil size={10} />
      </button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={100}
          step={0.5}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={pending}
          className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-xs focus:border-[#065f46] focus:outline-none"
        />
        <button onClick={handleSave} disabled={pending} className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50" aria-label="Save">
          {pending ? <LoaderCircle size={13} className="animate-spin" /> : <Check size={13} />}
        </button>
        <button onClick={() => setEditing(false)} disabled={pending} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Cancel">
          <X size={13} />
        </button>
      </div>
      {isCustom && (
        <button onClick={handleResetToDefault} disabled={pending} className="text-[10px] font-semibold text-gray-400 hover:text-gray-600">
          Reset to {DEFAULT_PLATFORM_COMMISSION_RATE_PERCENT}% default
        </button>
      )}
      {error && <p className="text-[10px] font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
