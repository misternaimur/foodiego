"use server";

import { revalidatePath } from "next/cache";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Restaurant, RESTAURANT_STATUSES, type RestaurantStatus } from "@/models/Restaurant";
import { Rider, RIDER_STATUSES, type RiderStatus } from "@/models/Rider";

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
  revalidatePath("/vendor/pending");

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
