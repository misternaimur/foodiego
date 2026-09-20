"use server";

import { revalidatePath } from "next/cache";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

export interface RiderActionResult {
  ok: boolean;
  message?: string;
}

const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;

/**
 * UPDATE (order-lifecycle fix): all three rider actions (accept / picked up
 * / delivered) now go through foodiego-backend's
 * PATCH /api/orders/:id/rider-action instead of writing to MongoDB directly
 * from Next.js. The backend enforces the real state machine (which
 * transition is legal from which status, and that a rider only ever
 * touches their own assigned order) in one place - see
 * orderBookingRoutes.js. Previously, "accept" unconditionally overwrote
 * order.status to "confirmed", which could regress a kitchen that had
 * already progressed to "preparing"/"ready"; it no longer touches status at
 * all, only riderId.
 */
async function runRiderAction(orderId: string, action: "accept" | "picked_up" | "delivered"): Promise<RiderActionResult> {
  const session = await getOptionalSession();
  if (!session || session.role !== "rider") {
    return { ok: false, message: "You are not authorised to perform this action." };
  }

  if (!OBJECT_ID_RE.test(orderId)) {
    return { ok: false, message: "Invalid delivery reference." };
  }

  try {
    await backendFetchAsUser(session, `/api/orders/${orderId}/rider-action`, {
      method: "PATCH",
      body: { action },
    });
  } catch (error) {
    console.error(`Rider action "${action}" failed:`, error);
    const message = error instanceof BackendError ? error.message : "Something went wrong. Please try again.";
    return { ok: false, message };
  }

  revalidatePath("/rider");
  revalidatePath("/rider/deliveries");
  revalidatePath("/admin/delivery");
  revalidatePath("/admin/orders");

  return { ok: true };
}

/** A rider claims an unassigned, kitchen-accepted delivery. */
export async function acceptDelivery(orderId: string): Promise<RiderActionResult> {
  return runRiderAction(orderId, "accept");
}

/** Rider has collected the food from the restaurant and is heading out. */
export async function markPickedUp(orderId: string): Promise<RiderActionResult> {
  return runRiderAction(orderId, "picked_up");
}

/** Rider has handed the order to the customer. */
export async function markDelivered(orderId: string): Promise<RiderActionResult> {
  return runRiderAction(orderId, "delivered");
}
