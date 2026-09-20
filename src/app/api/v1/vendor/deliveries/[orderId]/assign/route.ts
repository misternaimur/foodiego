import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { OrderBooking } from "@/models/OrderBooking";
import { Rider } from "@/models/Rider";

// UPDATE (rider-GPS fix): this route used to mutate a fake `demoDeliveries`
// array with a rider name pulled from a fixed rider_001..rider_007 lookup
// table — nothing was actually persisted, so it reset on every server
// restart. It now looks up a real Rider by id and persists the assignment
// on the real OrderBooking document (riderId + status -> "confirmed"),
// the same write src/app/(main)/actions/rider.ts's acceptDelivery does
// when a rider claims a delivery themselves.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
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
    return NextResponse.json({ error: "Restaurant profile not found" }, { status: 404 });
  }

  const { orderId } = await params;
  const body = await req.json();
  const { riderId } = body as { riderId: string };

  const rider = await Rider.findById(riderId).lean();
  if (!rider || rider.status !== "approved") {
    return NextResponse.json({ error: "Rider not found or not approved" }, { status: 404 });
  }

  const order = await OrderBooking.findOneAndUpdate(
    { _id: orderId, restaurantId: restaurant._id },
    { riderId: rider._id, status: "confirmed" },
    { new: true }
  ).lean();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    orderId,
    riderId: String(rider._id),
    riderName: rider.fullName,
    message: `Rider ${rider.fullName} assigned to order ${orderId}`,
  });
}
