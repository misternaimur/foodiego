"use client";

import { useEffect, useState } from "react";
import type { RiderOrderSummary } from "@/app/api/v1/rider/orders/route";

// ============================================================
// UPDATE (rider-dashboard real-data fix): /rider/orders,
// /rider/deliveries, /rider/earnings and /rider/shift-history all used to
// render a fixed hardcoded array of orders — none of them fetched
// anything. This shared hook fetches the rider's real order history once
// (from /api/v1/rider/orders, which reads the real OrderBooking
// collection) so all four pages compute their stats/lists from the same
// real data instead of each keeping its own copy of fake numbers.
// ============================================================

export type { RiderOrderSummary };

export function useRiderOrders() {
  const [orders, setOrders] = useState<RiderOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/rider/orders");
        if (!res.ok) return;
        const data = (await res.json()) as { orders: RiderOrderSummary[] };
        if (!cancelled) setOrders(data.orders);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, loading };
}
