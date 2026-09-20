import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { OrderBooking } from "@/models/OrderBooking";
import { toVendorOrderStatus, VENDOR_ACTION_TO_ORDER_STATUS } from "@/lib/orderStatusMap";

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
      notes: "",
    };
  });

  return NextResponse.json(formattedOrders);
}

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

  const restaurant = await Restaurant.findOne({ userId: user._id }).lean();
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  const body = await req.json();
  const { orderId, action } = body;

  if (!orderId || !action) {
    return NextResponse.json({ error: "Missing orderId or action" }, { status: 400 });
  }

  const newStatus = VENDOR_ACTION_TO_ORDER_STATUS[action];
  if (!newStatus) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // `orderId` here is the OrderBooking document's own _id (see the `id` field
  // built in GET above) — scoped to this vendor's restaurantId so one vendor
  // can never move another vendor's order.
  const order = await OrderBooking.findOneAndUpdate(
    { _id: orderId, restaurantId: restaurant._id },
    { status: newStatus },
    { new: true }
  ).lean();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    orderId,
    action,
    newStatus: toVendorOrderStatus(newStatus),
    message: `Order ${action} processed successfully`,
  });
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
