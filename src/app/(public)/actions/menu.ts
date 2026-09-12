
"use server";

import dbConnect from "@/lib/dbConnect";
import MenuItem from "@/models/MenuItem";
import Restaurant from "@/models/Restaurant";
import { revalidatePath } from "next/cache";

// Creates a new menu item for a restaurant.
export async function createMenuItemAction(
  restaurantId: string,
  formData: {
    name: string;
    description?: string;
    price: number;
    category?: string;
    imageUrl?: string;
  }
) {
  try {
    // Establishes a database connection.
    await dbConnect();

    // Verifies that the restaurant exists.
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return {
        success: false,
        message: "Restaurant not found",
      };
    }

    // Creates a new menu item associated with the restaurant.
    const newItem = await MenuItem.create({
      restaurantId,
      ...formData,
    });

    // Revalidates the vendor menu page to reflect the new item.
    revalidatePath("/vendor/create-menu");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newItem)),
    };
  } catch (error: unknown) {
    // Handles unexpected errors safely.
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

// Retrieves active menu items for a restaurant.
export async function getVendorMenuItems(restaurantId: string) {
  try {
    // Establishes a database connection.
    await dbConnect();

    // Fetches menu items that are not explicitly inactive.
    const items = await MenuItem.find({
      restaurantId,
      isActive: { $ne: false },
    }).lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(items)),
    };
  } catch (error: unknown) {
    // Handles unexpected errors safely.
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}