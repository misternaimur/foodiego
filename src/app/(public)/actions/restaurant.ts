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
import { getAdminAuth } from "@/lib/firebase/admin";
import { consumeVerifiedRegistrationOtp } from "@/lib/otp";

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
    decoded = await getAdminAuth().verifyIdToken(idToken);
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

    // Registration is gated behind e-mail OTP verification.
    const otpVerified = await consumeVerifiedRegistrationOtp(data.email);
    if (!otpVerified) {
      return { message: "Please verify your email with the code we sent before continuing." };
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
      // UPDATE (admin-approval fix): re-enabled. New restaurants now start
      // "pending" and only reach the vendor dashboard once an admin approves
      // them from /admin/vendors (see src/app/(main)/vendor/layout.tsx for
      // the matching pending/rejected gate on the vendor side).
      status: "pending",
    });
  }

  await createSession(idToken);

  // Land on the home page right after registering.
  redirect("/");
}
