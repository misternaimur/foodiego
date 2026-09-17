import "server-only";
import dbConnect from "@/lib/dbConnect";
import Restaurant from "@/models/Restaurant";

export interface VendorProfileData {
  id: string;
  restaurantName: string;
  email: string;
  phone?: string;
  status: "pending" | "approved" | "rejected";
  cuisineType?: string;
  address?: string;
  isOpen: boolean;
}

/**
 * Badge counts keyed by the badgeKey values defined in config/roles/vendor.config.ts
 * (currently just "activeOrders" on the Orders nav item).
 * TODO: replace the hardcoded value with a real query against your Order model
 * filtered by restaurantId once one exists.
 */
export async function getVendorBadgeCounts(restaurantId?: string): Promise<Record<string, number>> {
  await dbConnect();

  try {
    return {
      activeOrders: 0,
    };
  } catch (error) {
    console.error("Error fetching vendor badge counts:", error);
    return {};
  }
}

export async function updateVendorOpenStatus(restaurantId: string, isOpen: boolean) {
  await dbConnect();

  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isOpen },
      { new: true, runValidators: true }
    );
    return updatedRestaurant;
  } catch (error) {
    console.error("Error updating vendor status:", error);
    throw new Error("Failed to update vendor status");
  }
}