import "server-only";

import { dbConnect } from "@/lib/dbConnect";
import { Rider, type RiderDocument } from "@/models/Rider";
import { Restaurant, type RestaurantDocument } from "@/models/Restaurant";

interface SessionLike {
  id: string;
  userId: string;
  name: string;
  email?: string;
}

const PLACEHOLDER = "Not provided";

// A logged-in account can hold the "rider" / "restaurant" role without ever
// having completed the dedicated application form (e.g. it was chosen on the
// generic sign-up form). Rather than bouncing the user back to registration,
// provision a minimal profile on first visit so every route stays reachable.
// The user can fill in the real details later from their dashboard settings.

export async function getOrCreateRiderProfile(
  session: SessionLike
): Promise<RiderDocument | null> {
  await dbConnect();

  let rider = await Rider.findOne({ userId: session.id }).lean<RiderDocument>();
  if (rider) return rider;

  try {
    await Rider.create({
      userId: session.id,
      fullName: session.name || "Rider",
      email: session.email || `${session.userId}@foodiego.local`,
      phone: PLACEHOLDER,
      address: PLACEHOLDER,
      city: PLACEHOLDER,
      vehicleType: "bicycle",
      licenseNumber: PLACEHOLDER,
      status: "approved",
    });
  } catch (error) {
    console.warn("Could not auto-provision rider profile:", error);
  }

  rider = await Rider.findOne({ userId: session.id }).lean<RiderDocument>();
  return rider;
}

export async function getOrCreateRestaurantProfile(
  session: SessionLike
): Promise<RestaurantDocument | null> {
  await dbConnect();

  let restaurant = await Restaurant.findOne({ userId: session.id }).lean<RestaurantDocument>();
  if (restaurant) return restaurant;

  try {
    await Restaurant.create({
      userId: session.id,
      restaurantName: session.name ? `${session.name}'s Kitchen` : "My Restaurant",
      ownerName: session.name || "Owner",
      email: session.email || `${session.userId}@foodiego.local`,
      address: PLACEHOLDER,
      status: "approved",
    });
  } catch (error) {
    console.warn("Could not auto-provision restaurant profile:", error);
  }

  restaurant = await Restaurant.findOne({ userId: session.id }).lean<RestaurantDocument>();
  return restaurant;
}
