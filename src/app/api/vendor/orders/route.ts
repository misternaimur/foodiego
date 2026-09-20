import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { OrderBooking, type OrderBookingStatus } from "@/models/OrderBooking";
import { toVendorOrderStatus } from "@/lib/orderStatusMap";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

// UPDATE: this route used to read the (unused, always-empty) `Order` model.
// It now reads `OrderBooking`, which is what the real customer checkout flow
// (src/app/api/v1/client/orders/route.ts) actually writes to, and translates
// each document into the response shape the vendor dashboard already expects
// — see src/lib/orderStatusMap.ts for why that translation exists and how it
// works.

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
    return NextResponse.json([]);
  }

  const orders = await OrderBooking.find({ restaurantId: restaurant._id })
    .populate("customerId", "name email")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const formattedOrders = orders.map((o) => {
    const customer = o.customerId as unknown as { name?: string; email?: string } | null;

    // OrderBooking items don't carry an image/addons snapshot the way the old
    // Order model did — default them so the existing UI still renders fine.
    const items = (o.items || []).map((item, index) => ({
      id: `${o._id}_${index}`,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: "",
      addons: [] as { name: string; price: number }[],
      specialInstructions: item.specialInstructions || "",
    }));

    return {
      id: String(o._id),
      status: toVendorOrderStatus(o.status),
      timeAgo: formatTimeAgo(o.createdAt),
      customer: {
        name: customer?.name || "Guest",
        phone: "",
        address: o.deliveryAddress || "",
        orderCount: 0,
        avatar: "",
        email: customer?.email || "",
      },
      items,
      paymentMethod: o.paymentMethod || "cash",
      paymentStatus: o.paymentStatus || "pending",
      subtotal: Math.max(0, (o.totalAmount || 0) - (o.deliveryFee || 0)),
      deliveryFee: o.deliveryFee || 0,
      total: o.totalAmount || 0,
      createdAt: o.createdAt.toISOString(),
      notes: o.deliveryNote || "",
    };
  });

  return NextResponse.json(formattedOrders);
}

// UPDATE (order-lifecycle fix): this used to update OrderBooking.status
// directly with no validation of the current status — a vendor could
// technically "accept" an order that was already cancelled, or double-fire
// a stale request. It now proxies to foodiego-backend's
// PATCH /api/orders/:id/vendor-action, which enforces the real
// pending->preparing->ready state machine server-side (see
// orderBookingRoutes.js) and is the single place that logic lives — also
// used directly by anything else that talks to foodiego-backend.
const ACTION_TO_VENDOR_ACTION: Record<string, "accept" | "reject" | "ready"> = {
  accept: "accept",
  reject: "reject",
  ready: "ready",
};

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const { orderId, action } = body;

  if (!orderId || !action) {
    return NextResponse.json({ error: "Missing orderId or action" }, { status: 400 });
  }

  const vendorAction = ACTION_TO_VENDOR_ACTION[action];
  if (!vendorAction) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const order = await backendFetchAsUser<{ status: OrderBookingStatus }>(
      { id: user._id.toString(), role: user.role },
      `/api/orders/${orderId}/vendor-action`,
      { method: "PATCH", body: { action: vendorAction } }
    );

    return NextResponse.json({
      success: true,
      orderId,
      action,
      newStatus: toVendorOrderStatus(order.status),
      message: `Order ${action} processed successfully`,
    });
  } catch (error) {
    console.error("Failed to update order status:", error);
    const status = error instanceof BackendError ? error.status : 500;
    const message = error instanceof BackendError ? error.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status });
  }
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
