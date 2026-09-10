import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { demoDeliveries } from "@/app/api/v1/vendor/deliveries/active/route";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (process.env.NODE_ENV === "development" && !decoded) {
    const { orderId } = await params;
    const body = await req.json();
    const { riderId } = body;

    const riderNames: Record<string, string> = {
      rider_001: "Tom Smith",
      rider_002: "Mike K.",
      rider_003: "Rachel J.",
      rider_004: "Elena V.",
      rider_005: "David M.",
      rider_006: "James P.",
      rider_007: "Anna L.",
    };

    const delivery = demoDeliveries.find((d) => d.orderId === orderId);
    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    const riderName = riderNames[riderId] || riderId;
    delivery.assignedRider = riderName;
    delivery.riderId = riderId;
    delivery.status = "In Transit";
    delivery.eta = "8 min";
    delivery.riderLat = delivery.riderLat || 23.765;
    delivery.riderLng = delivery.riderLng || 90.405;
    delivery.riderSpeed = 22;

    return NextResponse.json({
      success: true,
      orderId,
      riderId,
      riderName,
      message: `Rider ${riderName} assigned to order ${orderId}`,
    });
  }

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const body = await req.json();
  const { riderId } = body;

  const riderNames: Record<string, string> = {
    rider_001: "Tom Smith",
    rider_002: "Mike K.",
    rider_003: "Rachel J.",
    rider_004: "Elena V.",
    rider_005: "David M.",
    rider_006: "James P.",
    rider_007: "Anna L.",
  };

  const delivery = demoDeliveries.find((d) => d.orderId === orderId);
  if (!delivery) {
    return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
  }

  const riderName = riderNames[riderId] || riderId;
  delivery.assignedRider = riderName;
  delivery.riderId = riderId;
  delivery.status = "In Transit";
  delivery.eta = "8 min";
  delivery.riderLat = delivery.riderLat || 23.765;
  delivery.riderLng = delivery.riderLng || 90.405;
  delivery.riderSpeed = 22;

  return NextResponse.json({
    success: true,
    orderId,
    riderId,
    riderName,
    message: `Rider ${riderName} assigned to order ${orderId}`,
  });
}
