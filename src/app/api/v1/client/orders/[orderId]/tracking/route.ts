import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

export interface OrderTracking {
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  restaurantName?: string;
  deliveryAddress: string;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  rider: {
    fullName: string;
    phone?: string;
    lat: number | null;
    lng: number | null;
    updatedAt: string | null;
  } | null;
}

// UPDATE (live-tracking fix): thin proxy to foodiego-backend's
// GET /api/orders/:id/tracking (see orderBookingRoutes.js) — that route
// enforces the order actually belongs to this customer, so this handler
// only needs to forward the authenticated call.
export async function GET(_req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;

  try {
    const tracking = await backendFetchAsUser<OrderTracking>(session, `/api/orders/${orderId}/tracking`);
    return NextResponse.json(tracking);
  } catch (error) {
    console.error("Failed to load order tracking:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to load tracking info" }, { status });
  }
}
