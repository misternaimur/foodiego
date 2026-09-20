import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { getOrCreateRiderProfile } from "@/lib/profile";
import { dbConnect } from "@/lib/dbConnect";
import { OrderBooking } from "@/models/OrderBooking";

export interface AvailableDelivery {
  _id: string;
  restaurantName: string;
  deliveryAddress: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: "cash" | "card" | "online";
  createdAt: string;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "rider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const rider = await getOrCreateRiderProfile(session);

  if (!rider || rider.status !== "approved" || !rider.city) {
    return NextResponse.json({ deliveries: [] });
  }

  const deliveries = await OrderBooking.find({
    $or: [{ riderId: { $exists: false } }, { riderId: null }],
    status: { $nin: ["delivered", "cancelled"] },
    city: { $regex: `^${escapeRegex(rider.city)}$`, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const payload: AvailableDelivery[] = deliveries.map((d) => ({
    _id: String(d._id),
    restaurantName: d.restaurantName || "Restaurant",
    deliveryAddress: d.deliveryAddress,
    totalAmount: d.totalAmount,
    deliveryFee: d.deliveryFee,
    paymentMethod: d.paymentMethod,
    createdAt: d.createdAt.toISOString(),
  }));

  return NextResponse.json({ deliveries: payload });
}
