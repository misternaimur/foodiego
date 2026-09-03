"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Check, X, RotateCcw, LoaderCircle } from "lucide-react";
import {
  approveRider,
  rejectRider,
  resetRiderStatus,
} from "@/app/(main)/actions/admin";

type Action = "approve" | "reject" | "reset";

const RUNNERS: Record<Action, (id: string) => Promise<{ ok: boolean; message?: string }>> = {
  approve: approveRider,
  reject: rejectRider,
  reset: resetRiderStatus,
};

export default function RiderModerationActions({
  riderId,
  status,
}: {
  riderId: string;
  status: "pending" | "approved" | "rejected";
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState<Action | null>(null);

  const run = (action: Action) => {
    setError(null);
    setRunning(action);
    startTransition(async () => {
      const result = await RUNNERS[action](riderId);
      if (!result.ok) setError(result.message ?? "Something went wrong.");
      setRunning(null);
    });
  };

  const baseBtn =
    "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-lg transition-all duration-200 disabled:opacity-50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-end gap-2"
    >
      <div className="flex flex-wrap items-center justify-end gap-2">
        {status !== "approved" && (
          <motion.button
            whileHover={{ scale: 1.03, y: -2, boxShadow: "0 20px 35px -10px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.97, y: 1, boxShadow: "0 5px 15px -5px rgba(16, 185, 129, 0.4)" }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            onClick={() => run("approve")}
            disabled={pending}
            className={`${baseBtn} bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 text-white hover:from-emerald-400 hover:via-emerald-500 hover:to-emerald-600 border-2 border-white/30 border-b-[4px] border-b-emerald-800 active:border-b-0 active:translate-y-1 active:shadow-md`}
          >
            {pending && running === "approve" ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <Check size={13} />
            )}
            Approve
          </motion.button>
        )}

        {status !== "rejected" && (
          <motion.button
            whileHover={{ scale: 1.03, y: -2, boxShadow: "0 20px 35px -10px rgba(246, 164, 41, 0.5)" }}
            whileTap={{ scale: 0.97, y: 1, boxShadow: "0 5px 15px -5px rgba(246, 164, 41, 0.4)" }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            onClick={() => run("reject")}
            disabled={pending}
            className={`${baseBtn} bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-gray-900 font-extrabold hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 border-2 border-white/30 border-b-[4px] border-b-amber-700 active:border-b-0 active:translate-y-1 active:shadow-md`}
          >
            {pending && running === "reject" ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <X size={13} />
            )}
            Reject
          </motion.button>
        )}

        {status !== "pending" && (
          <motion.button
            whileHover={{ scale: 1.03, y: -2, boxShadow: "0 20px 35px -10px rgba(148, 163, 184, 0.5)" }}
            whileTap={{ scale: 0.97, y: 1, boxShadow: "0 5px 15px -5px rgba(148, 163, 184, 0.4)" }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            onClick={() => run("reset")}
            disabled={pending}
            className={`${baseBtn} bg-gradient-to-b from-slate-100 via-gray-100 to-slate-200 text-slate-700 hover:from-slate-50 hover:to-slate-100 border-2 border-white/50 border-b-[4px] border-b-slate-300 active:border-b-0 active:translate-y-1 active:shadow-md`}
          >
            {pending && running === "reset" ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <RotateCcw size={13} />
            )}
            Move to pending
          </motion.button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
