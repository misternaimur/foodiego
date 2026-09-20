import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { OrderBooking } from "@/models/OrderBooking";
import { Rider } from "@/models/Rider";

// ============================================================
// UPDATE (rider-GPS fix): this route used to return a fully hardcoded
// `demoDeliveries`/`demoRiders` array (fake customers, fake riders named
// "Tom Smith"/"Mike K.", fake lat/lng). It now reads this restaurant's
// real OrderBooking history and the real riders available in its city.
// The one piece still not fully real is the delivery *destination*
// coordinate: there's no address-to-coordinate geocoding anywhere in this
// codebase, so `lat`/`lng` are simply left undefined rather than
// fabricated — see DeliveryMap.tsx, which now skips drawing a pin/route
// for a delivery with no real coordinate. The *rider's* position
// (`riderLat`/`riderLng`), on the other hand, is real: it comes from
// Rider.currentLat/currentLng, populated by the rider's own browser via
// /api/v1/rider/location (see RiderDashboard.tsx).
// ============================================================

export interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  assignedRider: string;
  riderId?: string;
  riderName?: string;
  status: "Picked Up" | "Assigning" | "Delayed" | "In Transit" | "Delivered" | "Cancelled";
  eta: string;
  total: number;
  items: number;
  lat?: number;
  lng?: number;
  riderLat?: number;
  riderLng?: number;
  riderSpeed?: number;
}

export interface Rider {
  id: string;
  name: string;
  status: "Available" | "Assigned" | "Offline";
  distance: string;
  vehicle: string;
  lat?: number;
  lng?: number;
}

function toDeliveryStatus(status: string): Delivery["status"] {
  switch (status) {
    case "out_for_delivery":
      return "In Transit";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Assigning";
  }
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const restaurant = await Restaurant.findOne({ userId: user._id }).lean();
  if (!restaurant) {
    return NextResponse.json({ deliveries: [], activeDeliveries: [], riders: [], storeOpen: false });
  }

  // NOTE: Restaurant has no normalized `city` field (only a free-text
  // `address`), so riders aren't filtered to "this restaurant's city" the
  // way the customer-facing available-deliveries route filters by the
  // rider's own city — this just lists approved riders as dispatch
  // candidates, sorted so available ones show first.
  const [orders, allRiders] = await Promise.all([
    OrderBooking.find({ restaurantId: restaurant._id, status: { $ne: "pending" } })
      .populate("customerId", "name")
      .populate("riderId", "fullName currentLat currentLng vehicleType")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    Rider.find({ status: "approved" }).sort({ isAvailable: -1 }).limit(20).lean(),
  ]);

  const deliveries: Delivery[] = orders.map((o) => {
    const customer = o.customerId as unknown as { name?: string } | null;
    const rider = o.riderId as unknown as { _id: unknown; fullName?: string; currentLat?: number; currentLng?: number } | null;
    return {
      id: String(o._id),
      orderId: String(o._id),
      customerName: customer?.name || "Customer",
      customerPhone: "",
      address: o.deliveryAddress,
      assignedRider: rider?.fullName || "Unassigned",
      riderId: rider ? String(rider._id) : undefined,
      riderName: rider?.fullName,
      status: toDeliveryStatus(o.status),
      eta: o.status === "out_for_delivery" ? "En route" : o.status === "delivered" ? "0 min" : "--",
      total: o.totalAmount || 0,
      items: (o.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0),
      riderLat: rider?.currentLat,
      riderLng: rider?.currentLng,
    };
  });

  const activeDeliveries = deliveries.filter((d) =>
    ["Picked Up", "Assigning", "Delayed", "In Transit"].includes(d.status)
  );

  const assignedRiderIds = new Set(deliveries.filter((d) => d.riderId).map((d) => d.riderId));
  const riders: Rider[] = allRiders.map((r) => ({
    id: String(r._id),
    name: r.fullName,
    status: !r.isAvailable ? "Offline" : assignedRiderIds.has(String(r._id)) ? "Assigned" : "Available",
    distance: "—",
    vehicle: r.vehicleType,
    lat: r.currentLat,
    lng: r.currentLng,
  }));

  return NextResponse.json({
    deliveries,
    activeDeliveries,
    riders,
    storeOpen: restaurant.storeStatus !== "closed",
  });
}
