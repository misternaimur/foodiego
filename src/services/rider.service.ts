import "server-only";
import dbConnect from "@/lib/dbConnect";
import Rider from "@/models/Rider";

export interface RiderProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  vehicleType?: string;
  licenseNumber?: string;
}

/**
 * Badge counts keyed by the badgeKey values defined in config/roles/rider.config.ts
 * (currently just "activeDeliveries" on the Deliveries nav item).
 * TODO: replace the hardcoded value with a real query once an Order/Delivery
 * model exists to count a rider's active assignments.
 */
export async function getRiderBadgeCounts(riderId?: string): Promise<Record<string, number>> {
  await dbConnect();

  try {
    // riderId is optional for now since there's no real query yet; once wired,
    // require it and filter by it.
    return {
      activeDeliveries: 0,
    };
  } catch (error) {
    console.error("Error fetching rider badge counts:", error);
    return {};
  }
}

/**
 * Updates a rider's live availability. Note: this is NOT the same as `status`
 * (pending/approved/rejected), which is the admin-approval field and must
 * never be set to "online"/"offline"/"busy" — that would violate the model's
 * enum and corrupt the approval state.
 */
export async function updateRiderAvailability(riderId: string, isAvailable: boolean) {
  await dbConnect();

  try {
    const updatedRider = await Rider.findByIdAndUpdate(
      riderId,
      { isAvailable },
      { new: true, runValidators: true }
    );
    return updatedRider;
  } catch (error) {
    console.error("Error updating rider availability:", error);
    throw new Error("Failed to update rider availability");
  }
}