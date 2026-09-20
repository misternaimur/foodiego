import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(100000 + Math.random() * 900000).toString();
  return `FG-${timestamp}${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ uid: decoded.uid }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { items, deliveryAddress, deliveryPhone, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart items are required" }, { status: 400 });
    }

    if (!deliveryAddress || !deliveryPhone) {
      return NextResponse.json({ error: "Delivery address and phone are required" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { totalUnitPrice?: number; price: number; quantity: number }) =>
        sum + ((item.totalUnitPrice ?? item.price) * item.quantity),
      0
    );
    const deliveryFee = 2.99;
    const total = subtotal + deliveryFee;

    const orderId = generateOrderId();

    const order = (await Order.create({
      orderId,
      merchantId: new mongoose.Types.ObjectId(),
      customer: {
        name: user.name,
        phone: deliveryPhone,
        address: deliveryAddress,
        email: user.email,
      },
      items: items.map((item: {
        name: string;
        quantity: number;
        price: number;
        totalUnitPrice?: number;
        imageUrl?: string;
        addons?: Array<{ name: string; price: number }>;
      }) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.imageUrl,
        addons: item.addons,
      })),
      status: "new",
      paymentMethod: paymentMethod || "cod",
      paymentStatus: "pending",
      subtotal,
      deliveryFee,
      total,
    })) as { orderId: string; status: string; total: number; paymentMethod: string };

    return NextResponse.json(
      {
        success: true,
        order: {
          orderId: order.orderId,
          status: order.status,
          total: order.total,
          paymentMethod: order.paymentMethod,
          estimatedDelivery: "2-3 business days",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Order Creation Error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
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

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ uid: decoded.uid }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orders = await Order.find({ "customer.email": user.email })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formattedOrders = orders.map((o) => ({
      id: o.orderId,
      status: o.status,
      items: (o.items || []).map((item: { name: string; quantity: number; price: number }) =>
        `${item.name} x${item.quantity}`
      ).join(", "),
      total: o.total || 0,
      paymentMethod: o.paymentMethod || "cash",
      paymentStatus: o.paymentStatus || "pending",
      subtotal: o.subtotal || 0,
      deliveryFee: o.deliveryFee || 0,
      timeAgo: formatTimeAgo(o.createdAt),
      createdAt: o.createdAt.toISOString(),
      customer: {
        name: o.customer?.name || "Unknown",
        phone: o.customer?.phone || "",
        address: o.customer?.address || "",
      },
    }));

    return NextResponse.json({ orders: formattedOrders, count: formattedOrders.length });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Order Fetch Error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
