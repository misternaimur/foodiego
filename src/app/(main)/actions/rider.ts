"use server";

import { revalidatePath } from "next/cache";
import { getOptionalSession } from "@/lib/dal";
import { getOrCreateRiderProfile } from "@/lib/profile";
import { dbConnect } from "@/lib/dbConnect";
import { OrderBooking } from "@/models/OrderBooking";

export interface AcceptDeliveryResult {
  ok: boolean;
  message?: string;
}

const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;

/**
 * A rider claims an unassigned delivery. The update filter only matches
 * documents that still have no rider, so if two riders accept the same
 * order at nearly the same moment only the first write succeeds — the
 * second gets `ok: false` instead of silently overwriting the first.
 */
export async function acceptDelivery(orderId: string): Promise<AcceptDeliveryResult> {
  const session = await getOptionalSession();
  if (!session || session.role !== "rider") {
    return { ok: false, message: "You are not authorised to perform this action." };
  }

  if (!OBJECT_ID_RE.test(orderId)) {
    return { ok: false, message: "Invalid delivery reference." };
  }

  await dbConnect();

  const rider = await getOrCreateRiderProfile(session);
  if (!rider || rider.status !== "approved") {
    return { ok: false, message: "Your rider account isn't approved yet." };
  }

  const order = await OrderBooking.findOneAndUpdate(
    {
      _id: orderId,
      $or: [{ riderId: { $exists: false } }, { riderId: null }],
    },
    { riderId: rider._id, status: "confirmed" },
    { new: true }
  ).lean();

  if (!order) {
    return { ok: false, message: "Someone else already picked this up." };
  }

  revalidatePath("/rider");
  revalidatePath("/admin/delivery");
  revalidatePath("/admin/orders");

  return { ok: true };
}
