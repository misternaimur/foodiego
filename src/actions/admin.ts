"use server";

// Enables Server Actions for secure server-side operations.
import { revalidatePath } from "next/cache";

// Retrieves the current user's session for authorization checks.
import { getOptionalSession } from "@/lib/dal";

// Establishes a connection to the MongoDB database.
import { dbConnect } from "@/lib/dbConnect";

// Imports the Restaurant model, supported statuses, and status type.
import {
  Restaurant,
  RESTAURANT_STATUSES,
  type RestaurantStatus,
} from "@/models/Restaurant";

// Imports the Rider model, supported statuses, and status type.
import {
  Rider,
  RIDER_STATUSES,
  type RiderStatus,
} from "@/models/Rider";

// Defines the standardized response format for moderation operations.
export interface ModerationResult {
  ok: boolean;
  message?: string;
}

// =====================================================
// RESTAURANT STATUS MANAGEMENT
// =====================================================

// Updates the status of a restaurant application.
// Handles approval, rejection, and status reset operations.
async function setRestaurantStatus(
  restaurantId: string,
  status: RestaurantStatus
): Promise<ModerationResult> {

  // Retrieves the current session to verify the user's identity and role.
  const session = await getOptionalSession();

  // Restricts restaurant moderation actions to authorized administrators.
  if (!session || session.role !== "admin") {
    return {
      ok: false,
      message: "You are not authorised to perform this action.",
    };
  }

  // Validates the requested status against the supported restaurant statuses.
  if (!RESTAURANT_STATUSES.includes(status)) {
    return {
      ok: false,
      message: "Unknown status.",
    };
  }

  // Validates the restaurant ID before querying the database.
  if (!/^[a-fA-F0-9]{24}$/.test(restaurantId)) {
    return {
      ok: false,
      message: "Invalid restaurant reference.",
    };
  }

  // Establishes the database connection before performing the update.
  await dbConnect();

  // Finds the restaurant by ID and updates its moderation status.
  // Returns the updated document using the `new: true` option.
  // `lean()` converts the result into a plain JavaScript object.
  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { status },
    { new: true }
  ).lean();

  // Returns an error if the restaurant application does not exist.
  if (!restaurant) {
    return {
      ok: false,
      message: "Restaurant application not found.",
    };
  }

  // Revalidates affected routes to ensure updated data is displayed.
  revalidatePath("/admin");
  revalidatePath("/admin/vendors");
  revalidatePath("/vendor");
  revalidatePath("/vendor/pending");

  // Returns a successful response after the status update.
  return { ok: true };
}

// Approves a restaurant application.
export async function approveRestaurant(
  restaurantId: string
): Promise<ModerationResult> {
  return setRestaurantStatus(restaurantId, "approved");
}

// Rejects a restaurant application.
export async function rejectRestaurant(
  restaurantId: string
): Promise<ModerationResult> {
  return setRestaurantStatus(restaurantId, "rejected");
}

// Resets a restaurant application to the pending status.
export async function resetRestaurantStatus(
  restaurantId: string
): Promise<ModerationResult> {
  return setRestaurantStatus(restaurantId, "pending");
}


// =====================================================
// RIDER STATUS MANAGEMENT
// =====================================================

// Updates the status of a rider application.
// Shared by approval, rejection, and status reset operations.
async function setRiderStatus(
  riderId: string,
  status: RiderStatus
): Promise<ModerationResult> {

  // Retrieves the current session to verify the user's identity and role.
  const session = await getOptionalSession();

  // Restricts rider moderation actions to authorized administrators.
  if (!session || session.role !== "admin") {
    return {
      ok: false,
      message: "You are not authorised to perform this action.",
    };
  }

  // Validates the requested status against the supported rider statuses.
  if (!RIDER_STATUSES.includes(status)) {
    return {
      ok: false,
      message: "Unknown status.",
    };
  }

  // Validates the rider ID before querying the database.
  if (!/^[a-fA-F0-9]{24}$/.test(riderId)) {
    return {
      ok: false,
      message: "Invalid rider reference.",
    };
  }

  // Establishes the database connection before performing the update.
  await dbConnect();

  // Finds the rider by ID and updates the application status.
  // Returns the updated document using the `new: true` option.
  const rider = await Rider.findByIdAndUpdate(
    riderId,
    { status },
    { new: true }
  ).lean();

  // Returns an error if the rider application does not exist.
  if (!rider) {
    return {
      ok: false,
      message: "Rider application not found.",
    };
  }

  // Revalidates affected routes to ensure updated data is displayed.
  revalidatePath("/admin");
  revalidatePath("/admin/riders");
  revalidatePath("/rider");
  revalidatePath("/rider/pending");

  // Returns a successful response after the status update.
  return { ok: true };
}

// Approves a rider application.
export async function approveRider(
  riderId: string
): Promise<ModerationResult> {
  return setRiderStatus(riderId, "approved");
}

// Rejects a rider application.
export async function rejectRider(
  riderId: string
): Promise<ModerationResult> {
  return setRiderStatus(riderId, "rejected");
}

// Resets a rider application to the pending status.
export async function resetRiderStatus(
  riderId: string
): Promise<ModerationResult> {
  return setRiderStatus(riderId, "pending");
}