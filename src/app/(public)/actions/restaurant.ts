"use server";

import { redirect } from "next/navigation";
import {
  RestaurantRegisterFormSchema,
  type RestaurantFormState,
} from "@/lib/definitions";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { createSession } from "@/lib/session";
import { adminAuth } from "@/lib/firebase/admin";

export interface RestaurantRegistrationFields {
  ownerName: string;
  email: string;
  password: string;
  phone: string;
  restaurantName: string;
  address: string;
  description: string;
  cuisineType?: string;
  openingTime?: string;
  closingTime?: string;
  logoUrl?: string;
}

export async function registerRestaurant(
  idToken: string,
  fields: RestaurantRegistrationFields
): Promise<RestaurantFormState> {
  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return { message: "Your sign-in could not be verified. Please try again." };
  }

  const validatedFields = RestaurantRegisterFormSchema.safeParse(fields);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { uid, email: authEmail } = decoded;
  const data = validatedFields.data;

  await dbConnect();

  let user = await User.findOne({ uid });

  // Role is auto-assigned by which registration form was used: anyone who signs
  // up through this form becomes a "restaurant" account. Only an existing admin
  // account is left untouched.
  if (user && user.role === "admin") {
    return { message: "This account is already registered with a different role." };
  }

  if (!user) {
    const existingByEmail = await User.findOne({ email: data.email }).lean();
    if (existingByEmail) {
      return { errors: { email: ["An account with this email already exists."] } };
    }

    user = await User.create({
      uid,
      name: data.ownerName,
      email: authEmail ?? data.email,
      role: "restaurant",
    });
  } else if (user.role !== "restaurant") {
    // Existing non-admin account (e.g. a "customer") — upgrade it to "restaurant".
    user.role = "restaurant";
    await user.save();
  }

  const existingRestaurant = await Restaurant.findOne({ userId: user._id }).lean();

  if (!existingRestaurant) {
    await Restaurant.create({
      userId: user._id,
      restaurantName: data.restaurantName,
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      description: data.description,
      logoUrl: data.logoUrl,
      cuisineType: data.cuisineType,
      openingTime: data.openingTime,
      closingTime: data.closingTime,
      // TEMP: Admin approval disabled — new restaurants are auto-approved.
      // Restore `status: "pending"` to re-enable the admin-approval flow.
      // status: "pending",
      status: "approved",
    });
  }

  await createSession(idToken);

  // Land on the home page right after registering.
  redirect("/");
}
