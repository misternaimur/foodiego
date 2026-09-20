import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetch, BackendError } from "@/lib/backend";

export interface ClientOrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface ClientOrder {
  _id: string;
  customerId: string;
  restaurantId?: { _id: string; restaurantName: string; logoUrl?: string } | string;
  restaurantName?: string;
  riderId?: { _id: string; fullName: string; phone?: string } | string;
  items: ClientOrderItem[];
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  deliveryNote?: string;
  paymentMethod: "cash" | "card" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt: string;
}

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await backendFetch<ClientOrder[]>(`/api/orders/customer/${session.id}`);
    return NextResponse.json({ orders });
  } catch (error) {
    // UPDATE (production-deploy fix): log the real error — these catch
    // blocks used to swallow it entirely, so a misconfigured/unreachable
    // backend (e.g. missing BACKEND_URL on Vercel) never showed up
    // anywhere, not even in server logs.
    console.error("Failed to load orders:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to load orders" }, { status });
  }
}

interface PlaceOrderBody {
  restaurantName: string;
  items: ClientOrderItem[];
  subtotal: number;
  deliveryFee: number;
  deliveryAddress: string;
  deliveryNote?: string;
  city: string;
  paymentMethod: "cod" | "online";
}

export async function POST(req: NextRequest) {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as PlaceOrderBody;

  if (!body.items?.length || !body.deliveryAddress || !body.restaurantName) {
    return NextResponse.json({ error: "Missing required order details" }, { status: 400 });
  }

  try {
    const order = await backendFetch<ClientOrder>("/api/orders", {
      method: "POST",
      body: {
        customerId: session.id,
        restaurantName: body.restaurantName,
        items: body.items,
        totalAmount: body.subtotal + body.deliveryFee,
        deliveryFee: body.deliveryFee,
        deliveryAddress: body.deliveryAddress,
        deliveryNote: body.deliveryNote || undefined,
        city: body.city,
        paymentMethod: body.paymentMethod === "online" ? "online" : "cash",
      },
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Failed to place order:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to place order" }, { status });
  }
}
