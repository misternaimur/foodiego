import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { getOrCreateRiderProfile } from "@/lib/profile";
import { dbConnect } from "@/lib/dbConnect";
import { OrderBooking } from "@/models/OrderBooking";

// ============================================================
// REAL RIDER STATS
// ------------------------------------------------------------
// UPDATE (rider-dashboard real-data fix): RiderDashboard.tsx's "Today's
// Deliveries", "Today's Earnings", "Delivery Success", and "Performance"
// numbers were hardcoded ("12", "$142.50", "98%", "38.5 km"...). This route
// computes them for real from the rider's own OrderBooking history.
//
// A rider's payout per delivery isn't tracked as its own ledger anywhere in
// this codebase, so — same engineering call as the vendor payments route
// (see src/app/api/v1/vendor/payments/route.ts's comment) — this uses each
// delivered order's `deliveryFee` as the rider's earning for that delivery.
// That's the one real number available; a proper payout system (a
// percentage split, tips, etc.) would need its own design.
//
// "Avg delivery time" is approximated from delivered orders' `updatedAt -
// createdAt` (the whole order lifetime, not just the rider's leg — the
// closest real timestamp this schema has). There's no real distance/GPS
// data anywhere in this codebase, so distance is intentionally left out
// rather than inventing a number — see src/app/api/v1/rider/available-deliveries
// for the one real location signal that does exist (the rider's city).
// ============================================================

export interface RiderSummary {
  todayDeliveries: number;
  todayEarnings: number;
  successRate: number;
  performance: {
    completed: number;
    avgMinutes: number | null;
    rating: number;
  };
  recentActivity: {
    id: string;
    title: string;
    text: string;
    time: string;
  }[];
}

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "rider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const rider = await getOrCreateRiderProfile(session);
  if (!rider) {
    return NextResponse.json({ error: "Rider profile not found" }, { status: 404 });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [todayOrders, allOrders, recentOrders] = await Promise.all([
    OrderBooking.find({ riderId: rider._id, createdAt: { $gte: todayStart } }).lean(),
    OrderBooking.find({ riderId: rider._id }).lean(),
    OrderBooking.find({ riderId: rider._id })
      .populate("customerId", "name")
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const todayDelivered = todayOrders.filter((o) => o.status === "delivered");
  const todayDeliveries = todayDelivered.length;
  const todayEarnings = todayDelivered.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);

  const finishedOrders = allOrders.filter((o) => o.status === "delivered" || o.status === "cancelled");
  const deliveredOrders = allOrders.filter((o) => o.status === "delivered");
  const successRate = finishedOrders.length > 0 ? Math.round((deliveredOrders.length / finishedOrders.length) * 100) : 100;

  const deliveryDurations = deliveredOrders.map(
    (o) => (new Date(o.updatedAt).getTime() - new Date(o.createdAt).getTime()) / 60000
  );
  const avgMinutes =
    deliveryDurations.length > 0
      ? Math.round(deliveryDurations.reduce((a, b) => a + b, 0) / deliveryDurations.length)
      : null;

  const recentActivity = recentOrders.map((o) => {
    const customer = o.customerId as unknown as { name?: string } | null;
    const restaurantName = o.restaurantName || "a restaurant";
    const title =
      o.status === "delivered"
        ? "Delivery completed"
        : o.status === "cancelled"
        ? "Order cancelled"
        : o.status === "out_for_delivery"
        ? "Picked up, on the way"
        : "Delivery accepted";
    return {
      id: String(o._id),
      title,
      text: `${restaurantName} → ${customer?.name || "customer"}`,
      time: new Date(o.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  });

  const summary: RiderSummary = {
    todayDeliveries,
    todayEarnings,
    successRate,
    performance: {
      completed: deliveredOrders.length,
      avgMinutes,
      rating: rider.rating || 0,
    },
    recentActivity,
  };

  return NextResponse.json(summary);
}
