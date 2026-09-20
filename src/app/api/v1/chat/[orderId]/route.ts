import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

type Channel = "customer_rider" | "restaurant_rider";

// UPDATE (restaurant-rider chat fix): this route used to hardcode
// CHANNEL = "customer_rider", so a restaurant could never open a chat with
// its delivery rider even though the backend already fully supports a
// "restaurant_rider" channel (see foodiego-backend/routes/chatRoutes.js
// and utils/chatParticipants.js, which already authorizes a restaurant
// owner on that channel). The channel is now read from a `?channel=`
// query param (defaulting to "customer_rider" so existing customer/rider
// chat callers are unaffected), and "restaurant" is allowed as a caller
// role. The backend's own participant check still enforces that only the
// customer, the assigned rider, or the order's restaurant owner can use
// either channel.
function resolveChannel(req: NextRequest): Channel {
  const raw = req.nextUrl.searchParams.get("channel");
  return raw === "restaurant_rider" ? "restaurant_rider" : "customer_rider";
}

export interface ChatMessage {
  _id: string;
  orderId: string;
  channel: "customer_rider" | "restaurant_rider";
  senderId: string;
  senderRole: "customer" | "rider" | "restaurant";
  message: string;
  createdAt: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getOptionalSession();
  if (!session || (session.role !== "customer" && session.role !== "rider" && session.role !== "restaurant")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const channel = resolveChannel(req);
  const since = req.nextUrl.searchParams.get("since");
  const qs = since ? `?since=${encodeURIComponent(since)}` : "";

  try {
    const messages = await backendFetchAsUser<ChatMessage[]>(
      session,
      `/api/chat/${orderId}/${channel}${qs}`
    );
    return NextResponse.json({ messages, selfRole: session.role });
  } catch (error) {
    console.error("Failed to load chat messages:", error);
    const status = error instanceof BackendError ? error.status : 500;
    const message = error instanceof BackendError ? error.message : "Failed to load messages";
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getOptionalSession();
  if (!session || (session.role !== "customer" && session.role !== "rider" && session.role !== "restaurant")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const channel = resolveChannel(req);
  const { message } = (await req.json()) as { message?: string };
  if (!message?.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const saved = await backendFetchAsUser<ChatMessage>(session, `/api/chat/${orderId}/${channel}`, {
      method: "POST",
      body: { message: message.trim() },
    });
    return NextResponse.json({ message: saved }, { status: 201 });
  } catch (error) {
    console.error("Failed to send chat message:", error);
    const status = error instanceof BackendError ? error.status : 500;
    const errorMessage = error instanceof BackendError ? error.message : "Failed to send message";
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
