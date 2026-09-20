"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Restaurant, RESTAURANT_STATUSES, type RestaurantStatus } from "@/models/Restaurant";
import { Rider, RIDER_STATUSES, type RiderStatus } from "@/models/Rider";
import { User, ACCOUNT_STATUSES, type AccountStatus } from "@/models/User";
import { OrderBooking, ORDER_STATUSES, type OrderBookingStatus } from "@/models/OrderBooking";
import { Notification } from "@/models/Notification";

// UPDATE (notification-system fix): admin approve/reject/suspend actions
// live entirely in Next.js (direct Mongoose), unlike the order-lifecycle
// events which fire from foodiego-backend — both write into the same
// "notification" collection. Failures here are logged, never thrown.
async function notify(
  userId: mongoose.Types.ObjectId | string | undefined,
  type: string,
  title: string,
  message: string,
  link?: string
) {
  if (!userId) return;
  try {
    await Notification.create({ userId, type, title, message, link });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

const OBJECT_ID_RE = /^[a-fA-F0-9]{24}$/;

async function requireAdmin(): Promise<ModerationResult | null> {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return { ok: false, message: "You are not authorised to perform this action." };
  }
  return null;
}

export interface ModerationResult {
  ok: boolean;
  message?: string;
}

async function setRestaurantStatus(
  restaurantId: string,
  status: RestaurantStatus
): Promise<ModerationResult> {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return { ok: false, message: "You are not authorised to perform this action." };
  }

  if (!RESTAURANT_STATUSES.includes(status)) {
    return { ok: false, message: "Unknown status." };
  }

  if (!/^[a-fA-F0-9]{24}$/.test(restaurantId)) {
    return { ok: false, message: "Invalid restaurant reference." };
  }

  await dbConnect();

  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { status },
    { new: true }
  ).lean();

  if (!restaurant) {
    return { ok: false, message: "Restaurant application not found." };
  }

  const RESTAURANT_STATUS_MESSAGES: Partial<Record<RestaurantStatus, [string, string]>> = {
    approved: ["You're approved!", `${restaurant.restaurantName} is now live and taking orders.`],
    rejected: ["Application declined", `Your application for ${restaurant.restaurantName} was not approved.`],
    suspended: ["Account suspended", `${restaurant.restaurantName} has been suspended by the platform.`],
  };
  const entry = RESTAURANT_STATUS_MESSAGES[status];
  if (entry) await notify(restaurant.userId, `vendor_${status}`, entry[0], entry[1], "/vendor");

  revalidatePath("/admin");
  revalidatePath("/admin/vendors");
  revalidatePath("/vendor");
  revalidatePath("/vendor/orders");

  return { ok: true };
}

export async function approveRestaurant(restaurantId: string): Promise<ModerationResult> {
  return setRestaurantStatus(restaurantId, "approved");
}

export async function rejectRestaurant(restaurantId: string): Promise<ModerationResult> {
  return setRestaurantStatus(restaurantId, "rejected");
}

export async function resetRestaurantStatus(restaurantId: string): Promise<ModerationResult> {
  return setRestaurantStatus(restaurantId, "pending");
}

export async function suspendRestaurant(restaurantId: string): Promise<ModerationResult> {
  return setRestaurantStatus(restaurantId, "suspended");
}

export async function reactivateRestaurant(restaurantId: string): Promise<ModerationResult> {
  return setRestaurantStatus(restaurantId, "approved");
}

// UPDATE (per-vendor-commission fix): the only way to change a vendor's
// commission rate used to be editing the PLATFORM_COMMISSION_RATE constant
// in code, which applied to every vendor identically. `null` clears the
// override and falls back to the 15% platform default (see
// src/lib/commission.ts).
export async function setVendorCommissionRate(
  restaurantId: string,
  ratePercent: number | null
): Promise<ModerationResult> {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!OBJECT_ID_RE.test(restaurantId)) {
    return { ok: false, message: "Invalid restaurant reference." };
  }
  if (ratePercent !== null && (Number.isNaN(ratePercent) || ratePercent < 0 || ratePercent > 100)) {
    return { ok: false, message: "Commission rate must be between 0 and 100." };
  }

  await dbConnect();
  // Mongoose silently ignores an `undefined` value in an update object
  // rather than clearing the field, so resetting to the platform default
  // needs an explicit $unset instead of "set to undefined".
  const update = ratePercent === null ? { $unset: { commissionRate: 1 } } : { $set: { commissionRate: ratePercent } };
  const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, update, { new: true }).lean();

  if (!restaurant) {
    return { ok: false, message: "Restaurant not found." };
  }

  revalidatePath("/admin/vendors");
  revalidatePath("/admin/commission");

  return { ok: true };
}

async function setRiderStatus(
  riderId: string,
  status: RiderStatus
): Promise<ModerationResult> {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return { ok: false, message: "You are not authorised to perform this action." };
  }

  if (!RIDER_STATUSES.includes(status)) {
    return { ok: false, message: "Unknown status." };
  }

  if (!/^[a-fA-F0-9]{24}$/.test(riderId)) {
    return { ok: false, message: "Invalid rider reference." };
  }

  await dbConnect();

  const rider = await Rider.findByIdAndUpdate(riderId, { status }, { new: true }).lean();

  if (!rider) {
    return { ok: false, message: "Rider application not found." };
  }

  const RIDER_STATUS_MESSAGES: Partial<Record<RiderStatus, [string, string]>> = {
    approved: ["You're approved!", "Your rider account is active — you can start accepting deliveries."],
    rejected: ["Application declined", "Your rider application was not approved."],
    suspended: ["Account suspended", "Your rider account has been suspended by the platform."],
  };
  const entry = RIDER_STATUS_MESSAGES[status];
  if (entry) await notify(rider.userId, `rider_${status}`, entry[0], entry[1], "/rider");

  revalidatePath("/admin");
  revalidatePath("/admin/riders");
  revalidatePath("/rider");
  revalidatePath("/rider/pending");

  return { ok: true };
}

export async function approveRider(riderId: string): Promise<ModerationResult> {
  return setRiderStatus(riderId, "approved");
}

export async function rejectRider(riderId: string): Promise<ModerationResult> {
  return setRiderStatus(riderId, "rejected");
}

export async function resetRiderStatus(riderId: string): Promise<ModerationResult> {
  return setRiderStatus(riderId, "pending");
}

export async function suspendRider(riderId: string): Promise<ModerationResult> {
  return setRiderStatus(riderId, "suspended");
}

export async function reactivateRider(riderId: string): Promise<ModerationResult> {
  return setRiderStatus(riderId, "approved");
}

async function setCustomerAccountStatus(
  userId: string,
  accountStatus: AccountStatus
): Promise<ModerationResult> {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!ACCOUNT_STATUSES.includes(accountStatus)) {
    return { ok: false, message: "Unknown status." };
  }
  if (!OBJECT_ID_RE.test(userId)) {
    return { ok: false, message: "Invalid customer reference." };
  }

  await dbConnect();

  const user = await User.findOneAndUpdate(
    { _id: userId, role: "customer" },
    { accountStatus },
    { new: true }
  ).lean();

  if (!user) {
    return { ok: false, message: "Customer not found." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/customers");

  return { ok: true };
}

export async function suspendCustomer(userId: string): Promise<ModerationResult> {
  return setCustomerAccountStatus(userId, "suspended");
}

export async function reactivateCustomer(userId: string): Promise<ModerationResult> {
  return setCustomerAccountStatus(userId, "active");
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderBookingStatus
): Promise<ModerationResult> {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!ORDER_STATUSES.includes(status)) {
    return { ok: false, message: "Unknown status." };
  }
  if (!OBJECT_ID_RE.test(orderId)) {
    return { ok: false, message: "Invalid order reference." };
  }

  await dbConnect();

  const order = await OrderBooking.findByIdAndUpdate(orderId, { status }, { new: true }).lean();
  if (!order) {
    return { ok: false, message: "Order not found." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/delivery");

  return { ok: true };
}

export async function assignRiderToOrder(orderId: string, riderId: string): Promise<ModerationResult> {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!OBJECT_ID_RE.test(orderId) || !OBJECT_ID_RE.test(riderId)) {
    return { ok: false, message: "Invalid reference." };
  }

  await dbConnect();

  const order = await OrderBooking.findByIdAndUpdate(
    orderId,
    { riderId, status: "confirmed" },
    { new: true }
  ).lean();

  if (!order) {
    return { ok: false, message: "Order not found." };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/delivery");

  return { ok: true };
}
