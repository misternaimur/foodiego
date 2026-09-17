// src/actions/restaurant.ts (অথবা vendor.ts)
"use server";

import { redirect } from "next/navigation";
import {
  RestaurantRegisterFormSchema,
  type RestaurantFormState,
} from "@/lib/definitions";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant"; // মডেল ফাইল অপরিবর্তিত রাখা হয়েছে
import { createSession } from "@/lib/session";
import { adminAuth } from "@/lib/firebase/admin";
import { consumeVerifiedRegistrationOtp } from "@/lib/otp";
import { flattenError } from "zod";

export interface VendorRegistrationFields {
  ownerName: string;
  email: string;
  password: string;
  phone: string;
  restaurantName: string; // বা চাইলে shopName করতে পারেন, তবে ডাটাবেজ স্কিমার সাথে মিল রাখা ভালো
  address: string;
  description: string;
  cuisineType?: string;
  openingTime?: string;
  closingTime?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export async function registerVendor(
  idToken: string,
  fields: VendorRegistrationFields
): Promise<RestaurantFormState> {
  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return { message: "Your sign-in could not be verified. Please try again." };
  }

  const validatedFields = RestaurantRegisterFormSchema.safeParse(fields);
  if (!validatedFields.success) {
    return { errors: flattenError(validatedFields.error).fieldErrors };
  }

  const { uid, email: authEmail } = decoded;
  const data = validatedFields.data;

  try {
    await dbConnect();

    let user = await User.findOne({ uid });

    if (user && user.role === "admin") {
      return { message: "This account is already registered with a different role." };
    }

    if (!user) {
      const existingByEmail = await User.findOne({ email: data.email }).lean();
      if (existingByEmail) {
        return { errors: { email: ["An account with this email already exists."] } };
      }

      // Registration gated behind e-mail OTP verification.
      const otpVerified = await consumeVerifiedRegistrationOtp(data.email);
      if (!otpVerified) {
        return { message: "Please verify your email with the code we sent before continuing." };
      }

      user = await User.create({
        uid,
        name: data.ownerName,
        email: authEmail ?? data.email,
        role: "restaurant", // ডাটাবেজে রোল 'restaurant' বা চাইলে পরিবর্তন করতে পারেন
      });
    } else if (user.role !== "restaurant") {
      user.role = "restaurant";
      await user.save();
    }

    const existingVendor = await Restaurant.findOne({ userId: user._id }).lean();

    if (!existingVendor) {
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
        status: "approved",
      });
    }

    await createSession(idToken);
  } catch (error: unknown) {
    console.error("Vendor registration error:", error);
    
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      return { message: "An account or vendor with this information already exists." };
    }

    return { message: "Something went wrong during registration. Please try again." };
  }

  redirect("/");
}