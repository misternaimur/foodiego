"use server";

import { redirect } from "next/navigation";
import { ProfileSchema, type FormState, type Role } from "@/lib/definitions";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { createSession, deleteSession } from "@/lib/session";
import { getAdminAuth } from "@/lib/firebase/admin";
import { consumeVerifiedRegistrationOtp } from "@/lib/otp";

function roleHome(role: Role) {
  switch (role) {
    case "admin":
      return "/admin";
    case "restaurant":
      return "/vendor";
    case "rider":
      return "/rider";
    default:
      return "/";
  }
}

function getSafeRedirectPath(value: string | undefined, role: Role) {
  if (!value) return roleHome(role);

  const candidate = value.trim();
  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return roleHome(role);
  }

  const allowedPrefix = role === "admin"
    ? "/admin"
    : role === "restaurant"
      ? "/vendor"
      : role === "rider"
        ? "/rider"
        : null;

  return allowedPrefix && (candidate === allowedPrefix || candidate.startsWith(`${allowedPrefix}/`))
    ? candidate
    : roleHome(role);
}

export async function establishSession(
  idToken: string,
  profile?: { name: string; role: Role },
  redirectTo?: string
): Promise<FormState> {
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return { message: "Your sign-in could not be verified. Please try again." };
  }

  const { uid, email } = decoded;

  await dbConnect();

  let user = await User.findOne({ uid });

  if (!user) {
    if (profile) {
      const validatedFields = ProfileSchema.safeParse(profile);
      if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
      }

      const existingByEmail = await User.findOne({ email }).lean();
      if (existingByEmail) {
        return { errors: { email: ["An account with this email already exists."] } };
      }

      // Registration is gated behind e-mail OTP verification.
      const otpVerified = await consumeVerifiedRegistrationOtp(email ?? "");
      if (!otpVerified) {
        return { message: "Please verify your email with the code we sent before continuing." };
      }

      user = await User.create({
        uid,
        name: validatedFields.data.name,
        email,
        role: validatedFields.data.role,
      });
    } else {
      user = await User.create({
        uid,
        name: decoded.name || email?.split("@")[0] || "Member",
        email,
        role: "customer",
      });
    }
  }

  await createSession(idToken);

  const destination = getSafeRedirectPath(redirectTo, user.role);
  redirect(destination);
}

/**
 * Google sign-in, for customer accounts only.
 *
 * A first-time Google user gets a customer account straight away (Google has
 * already verified the address, so the e-mail OTP step used by the password
 * sign-up isn't needed). Restaurant, rider and admin accounts are refused and
 * must keep signing in with e-mail + password, so their approval-gated
 * onboarding can't be bypassed through Google.
 */
export async function establishGoogleSession(idToken: string, redirectTo?: string): Promise<FormState> {
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return { message: "Your Google sign-in could not be verified. Please try again." };
  }

  const { uid, email } = decoded;
  if (decoded.firebase?.sign_in_provider !== "google.com") {
    return { message: "Please use the Google button to sign in with Google." };
  }
  if (!email || !decoded.email_verified) {
    return { message: "Your Google account has no verified e-mail address." };
  }

  await dbConnect();

  let user = await User.findOne({ uid });

  if (!user) {
    // Same address, different Firebase account: an existing e-mail/password
    // account we must not silently take over.
    const existingByEmail = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existingByEmail) {
      return {
        message: "An account with this email already exists. Please sign in with your email and password.",
      };
    }

    user = await User.create({
      uid,
      name: decoded.name || email.split("@")[0] || "Member",
      email,
      role: "customer",
    });
  }

  if (user.role !== "customer") {
    return {
      message: "Google sign-in is only for customer accounts. Restaurant, rider and admin accounts must sign in with email and password.",
    };
  }
  if (user.accountStatus === "suspended") {
    return { message: "This account has been suspended. Please contact support." };
  }

  await createSession(idToken);
  redirect(getSafeRedirectPath(redirectTo, "customer"));
}

export async function logout() {
  await deleteSession();
  redirect("/auth/login");
}
