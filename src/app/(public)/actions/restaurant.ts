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

  if (user && user.role !== "restaurant") {
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
      status: "pending",
    });
  }

  await createSession(idToken);

  redirect("/vendor");
}
