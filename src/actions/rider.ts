"use server";

import { redirect } from "next/navigation";
import {
  RiderRegisterFormSchema,
  type RiderFormState,
} from "@/lib/definitions";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Rider } from "@/models/Rider";
import { createSession } from "@/lib/session";
import { adminAuth } from "@/lib/firebase/admin";

export interface RiderRegistrationFields {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  vehicleType: string;
  vehicleNumber?: string;
  licenseNumber: string;
  photoUrl?: string;
}

export async function registerRider(
  idToken: string,
  fields: RiderRegistrationFields
): Promise<RiderFormState> {
  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return { message: "Your sign-in could not be verified. Please try again." };
  }

  const validatedFields = RiderRegisterFormSchema.safeParse(fields);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { uid, email: authEmail } = decoded;
  const data = validatedFields.data;

  await dbConnect();

  let user = await User.findOne({ uid });

  // Role is auto-assigned by which registration form was used: anyone who signs
  // up through this form becomes a "rider" account. Only an existing admin
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
      name: data.fullName,
      email: authEmail ?? data.email,
      role: "rider",
    });
  } else if (user.role !== "rider") {
    // Existing non-admin account (e.g. a "customer") — upgrade it to "rider".
    user.role = "rider";
    await user.save();
  }

  const existingRider = await Rider.findOne({ userId: user._id }).lean();

  if (!existingRider) {
    await Rider.create({
      userId: user._id,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      vehicleType: data.vehicleType,
      vehicleNumber: data.vehicleNumber,
      licenseNumber: data.licenseNumber,
      photoUrl: data.photoUrl,
      // TEMP: Admin approval disabled — new riders are auto-approved.
      // Restore `status: "pending"` to re-enable the admin-approval flow.
      // status: "pending",
      status: "approved",
    });
  }

  await createSession(idToken);

  // Land on the home page right after registering.
  redirect("/");
}
