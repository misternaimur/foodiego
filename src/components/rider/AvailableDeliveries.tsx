"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Bike, MapPin, Wallet, BellRing, LoaderCircle, Check } from "lucide-react";
import { acceptDelivery } from "@/app/(main)/actions/rider";

interface AvailableDelivery {
  _id: string;
  restaurantName: string;
  deliveryAddress: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: "cash" | "card" | "online";
  createdAt: string;
}

const POLL_INTERVAL_MS = 12_000;

// Short two-tone chime via the Web Audio API — no external asset needed.
function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    [880, 1174.66].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.3);
    });
  } catch {
    // Audio isn't available (e.g. autoplay blocked before any user gesture) — safe to skip.
  }
}

export default function AvailableDeliveries() {
  const [deliveries, setDeliveries] = useState<AvailableDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [justArrived, setJustArrived] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const knownIds = useRef<Set<string> | null>(null);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/rider/available-deliveries", { credentials: "include" });
      if (!res.ok) return;
      const data = (await res.json()) as { deliveries: AvailableDelivery[] };

      if (knownIds.current) {
        const freshIds = data.deliveries
          .map((d) => d._id)
          .filter((id) => !knownIds.current!.has(id));
        if (freshIds.length > 0) {
          playChime();
          setJustArrived(new Set(freshIds));
          setTimeout(() => setJustArrived(new Set()), 4000);
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("New delivery available", {
              body: `${freshIds.length} new order${freshIds.length > 1 ? "s" : ""} near you`,
            });
          }
        }
      }

      knownIds.current = new Set(data.deliveries.map((d) => d._id));
      setDeliveries(data.deliveries);
    } catch {
      // Network hiccup — the next poll will retry.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [poll]);

  const handleAccept = (orderId: string) => {
    setAcceptingId(orderId);
    setError(null);
    startTransition(async () => {
      const result = await acceptDelivery(orderId);
      if (result.ok) {
        setDeliveries((prev) => prev.filter((d) => d._id !== orderId));
      } else {
        setError(result.message ?? "Could not accept this delivery.");
        poll();
      }
      setAcceptingId(null);
    });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
            <BellRing className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Available Deliveries Near You</h3>
            <p className="text-xs text-slate-500">Checks for new orders in your city every few seconds.</p>
          </div>
        </div>
        {deliveries.length > 0 && (
          <span className="rounded-full bg-green-500 px-2.5 py-1 text-xs font-bold text-white">
            {deliveries.length}
          </span>
        )}
      </div>

      {error && <p className="mb-3 text-xs font-medium text-rose-600">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-8 text-slate-400">
          <LoaderCircle className="h-5 w-5 animate-spin" />
        </div>
      ) : deliveries.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          No unclaimed deliveries in your area right now. This list refreshes automatically.
        </p>
      ) : (
        <div className="space-y-3">
          {deliveries.map((d) => (
            <div
              key={d._id}
              className={`flex flex-col gap-3 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                justArrived.has(d._id) ? "border-green-400 bg-green-50" : "border-slate-100 bg-slate-50/60"
              }`}
            >
              <div className="min-w-0">
                <p className="font-bold text-slate-900">{d.restaurantName}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{d.deliveryAddress}</span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Wallet className="h-3.5 w-3.5" />
                  ৳{d.totalAmount.toLocaleString()} &middot; {d.paymentMethod === "cash" ? "Cash on delivery" : d.paymentMethod}
                </p>
              </div>
              <button
                onClick={() => handleAccept(d._id)}
                disabled={pending && acceptingId === d._id}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
              >
                {pending && acceptingId === d._id ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Accept
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
        <Bike className="h-3 w-3" /> Only shown while your rider account is approved and this tab is open.
      </p>
    </section>
  );
}
