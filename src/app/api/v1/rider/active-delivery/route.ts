import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { getOrCreateRiderProfile } from "@/lib/profile";
import { dbConnect } from "@/lib/dbConnect";
import { OrderBooking } from "@/models/OrderBooking";

export interface ActiveDelivery {
  _id: string;
  restaurantName: string;
  deliveryAddress: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  itemsSummary: string;
  customerName: string;
}

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "rider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const rider = await getOrCreateRiderProfile(session);
  if (!rider) {
    return NextResponse.json({ delivery: null });
  }

  const order = await OrderBooking.findOne({
    riderId: rider._id,
    status: { $nin: ["delivered", "cancelled"] },
  })
    .populate("customerId", "name")
    .sort({ createdAt: -1 })
    .lean();

  if (!order) {
    return NextResponse.json({ delivery: null });
  }

  const customer = order.customerId as unknown as { name?: string } | null;

  const delivery: ActiveDelivery = {
    _id: String(order._id),
    restaurantName: order.restaurantName || "Restaurant",
    deliveryAddress: order.deliveryAddress,
    totalAmount: order.totalAmount,
    status: order.status,
    itemsSummary: order.items?.map((i) => i.name).join(", ") || "",
    customerName: customer?.name || "Customer",
  };

  return NextResponse.json({ delivery });
}
