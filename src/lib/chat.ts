import "server-only";

import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import type { Role } from "@/lib/definitions";
import { OrderBooking, type OrderBookingStatus } from "@/models/OrderBooking";
import { Rider } from "@/models/Rider";
import { Restaurant } from "@/models/Restaurant";
import { User } from "@/models/User";
import { Notification } from "@/models/Notification";
import { CHAT_CHANNELS, type ChatChannel, type ChatSenderRole } from "@/models/ChatMessage";

// ============================================================
// ORDER CHAT: who may read/write which thread
// ------------------------------------------------------------
// A chat only exists inside an order, and each order has two threads:
//
//   customer_rider   -> the order's customer  <-> the assigned rider
//   restaurant_rider -> the order's restaurant <-> the assigned rider
//
// This runs directly against MongoDB from Next.js rather than proxying to
// foodiego-backend's /api/chat routes: that proxy needed BACKEND_URL and a
// BACKEND_JWT_SECRET matching the backend's JWT_SECRET, and any drift in
// either silently broke every chat (polling errors were swallowed). Both
// sides still share the same "chatMessage" collection and document shape.
// ============================================================

export const MAX_CHAT_MESSAGE_LENGTH = 2000;

// Once an order is finished its threads stay readable but no longer accept messages.
const CLOSED_STATUSES: OrderBookingStatus[] = ["delivered", "cancelled"];

interface ChatSession {
  id: string;
  role: Role;
}

export interface ChatParticipant {
  userId: string;
  name: string;
}

export type ChatAccess =
  | {
      ok: true;
      orderId: string;
      channel: ChatChannel;
      selfRole: ChatSenderRole;
      self: ChatParticipant;
      peer: ChatParticipant & { role: ChatSenderRole };
      canSend: boolean;
    }
  | { ok: false; status: number; message: string };

function fail(status: number, message: string): ChatAccess {
  return { ok: false, status, message };
}

export function isChatChannel(value: unknown): value is ChatChannel {
  return typeof value === "string" && (CHAT_CHANNELS as readonly string[]).includes(value);
}

export async function resolveChatAccess(
  session: ChatSession,
  orderId: string,
  channel: string | null
): Promise<ChatAccess> {
  if (!isChatChannel(channel)) {
    return fail(400, "Invalid chat channel.");
  }
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return fail(400, "Invalid order reference.");
  }

  await dbConnect();

  const order = await OrderBooking.findById(orderId).select("customerId riderId restaurantId status").lean();
  if (!order) {
    return fail(404, "Order not found.");
  }

  const [rider, restaurant, customer] = await Promise.all([
    order.riderId ? Rider.findById(order.riderId).select("userId fullName").lean() : null,
    channel === "restaurant_rider" && order.restaurantId
      ? Restaurant.findById(order.restaurantId).select("userId restaurantName").lean()
      : null,
    channel === "customer_rider" ? User.findById(order.customerId).select("name").lean() : null,
  ]);

  const riderParty: ChatParticipant | null = rider
    ? { userId: String(rider.userId), name: rider.fullName || "Rider" }
    : null;

  // The non-rider side of this channel: the customer or the restaurant owner.
  const otherRole: ChatSenderRole = channel === "customer_rider" ? "customer" : "restaurant";
  const otherParty: ChatParticipant | null =
    channel === "customer_rider"
      ? { userId: String(order.customerId), name: customer?.name || "Customer" }
      : restaurant
        ? { userId: String(restaurant.userId), name: restaurant.restaurantName || "Restaurant" }
        : null;

  let selfRole: ChatSenderRole;
  if (session.role === "rider") {
    if (!riderParty || riderParty.userId !== session.id) {
      return fail(403, "This delivery isn't assigned to you.");
    }
    selfRole = "rider";
  } else if (session.role === otherRole) {
    if (!otherParty || otherParty.userId !== session.id) {
      return fail(403, "You are not part of this chat.");
    }
    selfRole = otherRole;
  } else {
    return fail(403, "You are not part of this chat.");
  }

  if (selfRole === "rider" && !otherParty) {
    return fail(409, "This order isn't linked to a restaurant account, so there's no one to chat with.");
  }
  if (selfRole !== "rider" && !riderParty) {
    return fail(409, "A rider hasn't been assigned to this order yet.");
  }

  const self = selfRole === "rider" ? riderParty! : otherParty!;
  const peer = selfRole === "rider" ? { ...otherParty!, role: otherRole } : { ...riderParty!, role: "rider" as const };

  return {
    ok: true,
    orderId: String(order._id),
    channel,
    selfRole,
    self,
    peer,
    canSend: !CLOSED_STATUSES.includes(order.status),
  };
}

// Where a chat notification should land for each kind of recipient.
function chatLinkFor(role: ChatSenderRole, orderId: string, channel: ChatChannel): string {
  if (role === "customer") return `/client/track?order=${orderId}`;
  if (role === "restaurant") return `/vendor?tab=delivery&chat=${orderId}`;
  return `/rider?chat=${orderId}&channel=${channel}`;
}

/**
 * Tells the other participant there's a new message, via the same
 * "notification" collection the notification bell reads. One unread
 * notification per recipient per thread: a burst of messages refreshes that
 * single entry instead of flooding the bell. Never throws - a notification
 * that fails to save must not fail the message itself.
 */
export async function notifyChatPeer(access: Extract<ChatAccess, { ok: true }>, text: string) {
  const preview = text.length > 120 ? `${text.slice(0, 117)}...` : text;
  const now = new Date();

  try {
    await Notification.updateOne(
      {
        userId: access.peer.userId,
        type: "chat_message",
        link: chatLinkFor(access.peer.role, access.orderId, access.channel),
        read: false,
      },
      {
        $set: {
          title: `New message from ${access.self.name}`,
          message: `Order #${access.orderId.slice(-6).toUpperCase()}: ${preview}`,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true, timestamps: false }
    );
  } catch (error) {
    console.error("Failed to create chat notification:", error);
  }
}
