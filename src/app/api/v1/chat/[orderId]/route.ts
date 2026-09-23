import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { MAX_CHAT_MESSAGE_LENGTH, notifyChatPeer, resolveChatAccess } from "@/lib/chat";
import { ChatMessage as ChatMessageModel, type ChatMessageDocument } from "@/models/ChatMessage";

// ============================================================
// ORDER CHAT API
// ------------------------------------------------------------
// GET  /api/v1/chat/:orderId?channel=<channel>[&since=<ISO date>]
// POST /api/v1/chat/:orderId?channel=<channel>   body: { message }
//
// channel is "customer_rider" or "restaurant_rider". Every request passes
// resolveChatAccess (src/lib/chat.ts), so only the order's customer, its
// assigned rider, or its restaurant owner can use the matching thread.
// The client polls GET with ?since=<createdAt of the newest message it
// has>; $gte (not $gt) so a message in the same millisecond is never
// skipped - the client drops the repeated boundary message by _id.
// ============================================================

// How much history a fresh (non-?since) load returns.
const HISTORY_LIMIT = 200;

export interface ChatMessage {
  _id: string;
  orderId: string;
  channel: "customer_rider" | "restaurant_rider";
  senderId: string;
  senderRole: "customer" | "rider" | "restaurant";
  message: string;
  createdAt: string;
}

function serialize(doc: Pick<ChatMessageDocument, "_id" | "orderId" | "channel" | "senderId" | "senderRole" | "message" | "createdAt">): ChatMessage {
  return {
    _id: String(doc._id),
    orderId: String(doc.orderId),
    channel: doc.channel,
    senderId: String(doc.senderId),
    senderRole: doc.senderRole,
    message: doc.message,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getOptionalSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in to use chat." }, { status: 401 });
  }

  const { orderId } = await params;
  const access = await resolveChatAccess(session, orderId, req.nextUrl.searchParams.get("channel"));
  if (!access.ok) {
    return NextResponse.json({ error: access.message }, { status: access.status });
  }

  const query: Record<string, unknown> = { orderId: access.orderId, channel: access.channel };

  const sinceParam = req.nextUrl.searchParams.get("since");
  let docs;
  if (sinceParam) {
    const since = new Date(sinceParam);
    if (Number.isNaN(since.getTime())) {
      return NextResponse.json({ error: "since must be a valid date" }, { status: 400 });
    }
    query.createdAt = { $gte: since };
    docs = await ChatMessageModel.find(query).sort({ createdAt: 1 }).limit(HISTORY_LIMIT).lean();
  } else {
    // Newest HISTORY_LIMIT messages, returned oldest-first so the UI can append.
    docs = (await ChatMessageModel.find(query).sort({ createdAt: -1 }).limit(HISTORY_LIMIT).lean()).reverse();
  }

  return NextResponse.json({
    messages: docs.map(serialize),
    selfRole: access.selfRole,
    peer: { name: access.peer.name, role: access.peer.role },
    canSend: access.canSend,
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getOptionalSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in to use chat." }, { status: 401 });
  }

  const { orderId } = await params;
  const access = await resolveChatAccess(session, orderId, req.nextUrl.searchParams.get("channel"));
  if (!access.ok) {
    return NextResponse.json({ error: access.message }, { status: access.status });
  }
  if (!access.canSend) {
    return NextResponse.json({ error: "This order is finished, so its chat is closed." }, { status: 409 });
  }

  const body = (await req.json().catch(() => ({}))) as { message?: unknown };
  const text = typeof body.message === "string" ? body.message.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }
  if (text.length > MAX_CHAT_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_CHAT_MESSAGE_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  // The sender always comes from the session, never from the request body.
  const saved = await ChatMessageModel.create({
    orderId: access.orderId,
    channel: access.channel,
    senderId: session.id,
    senderRole: access.selfRole,
    message: text,
  });

  await notifyChatPeer(access, text);

  return NextResponse.json({ message: serialize(saved) }, { status: 201 });
}
