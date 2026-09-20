"use client";

import { useState, useTransition } from "react";
import { Ban, RefreshCcw, LoaderCircle } from "lucide-react";
import { suspendCustomer, reactivateCustomer } from "@/app/(main)/actions/admin";

type Action = "suspend" | "reactivate";

const RUNNERS: Record<Action, (id: string) => Promise<{ ok: boolean; message?: string }>> = {
  suspend: suspendCustomer,
  reactivate: reactivateCustomer,
};

export default function CustomerModerationActions({
  userId,
  accountStatus,
}: {
  userId: string;
  accountStatus: "active" | "suspended";
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState<Action | null>(null);

  const run = (action: Action) => {
    setError(null);
    setRunning(action);
    startTransition(async () => {
      const result = await RUNNERS[action](userId);
      if (!result.ok) setError(result.message ?? "Something went wrong.");
      setRunning(null);
    });
  };

  const btn =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50";

  return (
    <div className="flex flex-col items-end gap-1.5">
      {accountStatus === "active" ? (
        <button
          onClick={() => run("suspend")}
          disabled={pending}
          className={`${btn} border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100`}
        >
          {pending && running === "suspend" ? <LoaderCircle size={13} className="animate-spin" /> : <Ban size={13} />}
          Suspend
        </button>
      ) : (
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
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
