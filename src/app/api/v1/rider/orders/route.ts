import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { getOrCreateRiderProfile } from "@/lib/profile";
import { dbConnect } from "@/lib/dbConnect";
import { OrderBooking } from "@/models/OrderBooking";

// UPDATE (rider-dashboard real-data fix): backs /rider/orders,
// /rider/deliveries, /rider/earnings and /rider/shift-history, none of
// which fetched anything before this — they rendered a fixed, hardcoded
// list. This is this rider's full real delivery history from OrderBooking.

export interface RiderOrderSummary {
  _id: string;
  restaurantName: string;
  customerName: string;
  deliveryAddress: string;
  deliveryNote?: string;
  totalAmount: number;
  deliveryFee: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "rider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const rider = await getOrCreateRiderProfile(session);
  if (!rider) {
    return NextResponse.json({ orders: [] });
  }

  const orders = await OrderBooking.find({ riderId: rider._id })
    .populate("customerId", "name")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const payload: RiderOrderSummary[] = orders.map((o) => {
    const customer = o.customerId as unknown as { name?: string } | null;
    return {
      _id: String(o._id),
      restaurantName: o.restaurantName || "Restaurant",
      customerName: customer?.name || "Customer",
      deliveryAddress: o.deliveryAddress,
      deliveryNote: o.deliveryNote || undefined,
      totalAmount: o.totalAmount,
      deliveryFee: o.deliveryFee || 0,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    };
  });

  return NextResponse.json({ orders: payload });
}
