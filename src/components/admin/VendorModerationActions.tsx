"use client";

import { useState, useTransition } from "react";
import { Check, X, RotateCcw, LoaderCircle, Ban, RefreshCcw } from "lucide-react";
import {
  approveRestaurant,
  rejectRestaurant,
  resetRestaurantStatus,
  suspendRestaurant,
  reactivateRestaurant,
} from "@/app/(main)/actions/admin";

type Action = "approve" | "reject" | "reset" | "suspend" | "reactivate";

const RUNNERS: Record<Action, (id: string) => Promise<{ ok: boolean; message?: string }>> = {
  approve: approveRestaurant,
  reject: rejectRestaurant,
  reset: resetRestaurantStatus,
  suspend: suspendRestaurant,
  reactivate: reactivateRestaurant,
};

export default function VendorModerationActions({
  restaurantId,
  status,
}: {
  restaurantId: string;
  status: "pending" | "approved" | "rejected" | "suspended";
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState<Action | null>(null);

  const run = (action: Action) => {
    setError(null);
    setRunning(action);
    startTransition(async () => {
      const result = await RUNNERS[action](restaurantId);
      if (!result.ok) setError(result.message ?? "Something went wrong.");
      setRunning(null);
    });
  };

  const btn =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50";

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {(status === "pending" || status === "rejected") && (
          <button
            onClick={() => run("approve")}
            disabled={pending}
            className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}
          >
            {pending && running === "approve" ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <Check size={13} />
            )}
            Approve
          </button>
        )}

        {(status === "pending" || status === "approved") && (
          <button
            onClick={() => run("reject")}
            disabled={pending}
            className={`${btn} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
          >
            {pending && running === "reject" ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <X size={13} />
            )}
            Reject
          </button>
        )}

        {status === "approved" && (
          <button
            onClick={() => run("suspend")}
            disabled={pending}
            className={`${btn} border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100`}
          >
            {pending && running === "suspend" ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <Ban size={13} />
            )}
            Suspend
          </button>
        )}

        {status === "suspended" && (
          <button
            onClick={() => run("reactivate")}
            disabled={pending}
            className={`${btn} bg-emerald-600 text-white hover:bg-emerald-700`}
          >
            {pending && running === "reactivate" ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <RefreshCcw size={13} />
            )}
            Reactivate
          </button>
        )}

        {(status === "approved" || status === "rejected") && (
          <button
            onClick={() => run("reset")}
            disabled={pending}
            className={`${btn} border border-gray-200 bg-white text-gray-600 hover:bg-gray-50`}
          >
            {pending && running === "reset" ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <RotateCcw size={13} />
            )}
            Move to pending
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
