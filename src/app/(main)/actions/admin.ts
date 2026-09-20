"use server";

import { revalidatePath } from "next/cache";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Restaurant, RESTAURANT_STATUSES, type RestaurantStatus } from "@/models/Restaurant";
import { Rider, RIDER_STATUSES, type RiderStatus } from "@/models/Rider";
import { User, ACCOUNT_STATUSES, type AccountStatus } from "@/models/User";
import { OrderBooking, ORDER_STATUSES, type OrderBookingStatus } from "@/models/OrderBooking";

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
