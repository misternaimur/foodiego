import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

export interface AvailableDelivery {
  _id: string;
  restaurantName: string;
  deliveryAddress: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: "cash" | "card" | "online";
  createdAt: string;
}

// UPDATE (order-lifecycle fix): this used to query MongoDB directly from
// Next.js with two real bugs - it listed orders the vendor hadn't even
// accepted yet ("pending"), and it never checked the rider's own
// isAvailable toggle (an "offline" rider still saw and could claim every
// order in their city). Both are fixed server-side now in
// foodiego-backend's GET /api/orders/available-for-rider (see
// orderBookingRoutes.js) - this route is a thin proxy to it.
export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "rider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await backendFetchAsUser<Array<{
      _id: string;
      restaurantName?: string;
      deliveryAddress: string;
      totalAmount: number;
      deliveryFee: number;
      paymentMethod: "cash" | "card" | "online";
      createdAt: string;
    }>>(session, "/api/orders/available-for-rider");

    const deliveries: AvailableDelivery[] = orders.map((d) => ({
      _id: String(d._id),
      restaurantName: d.restaurantName || "Restaurant",
      deliveryAddress: d.deliveryAddress,
      totalAmount: d.totalAmount,
      deliveryFee: d.deliveryFee,
      paymentMethod: d.paymentMethod,
      createdAt: d.createdAt,
    }));

    return NextResponse.json({ deliveries });
  } catch (error) {
    console.error("Failed to load available deliveries:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to load available deliveries" }, { status });
  }
}
