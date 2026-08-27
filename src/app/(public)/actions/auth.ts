"use server";

import { redirect } from "next/navigation";
import { ProfileSchema, type FormState, type Role } from "@/lib/definitions";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { createSession, deleteSession } from "@/lib/session";
import { adminAuth } from "@/lib/firebase/admin";

function roleHome(role: Role) {
  switch (role) {
    case "admin":
      return "/admin";
    case "restaurant":
      return "/vendor/restaurant";
    case "rider":
      return "/rider";
    default:
      return "/";
  }
}

function getSafeRedirectPath(value?: string, fallback?: string) {
  if (!value) return fallback ?? "/";

  const candidate = value.trim();
  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback ?? "/";
  }

  return candidate;
}

export async function establishSession(
  idToken: string,
  profile?: { name: string; role: Role },
  redirectTo?: string
): Promise<FormState> {
  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
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

  const destination = getSafeRedirectPath(redirectTo, roleHome(user.role));
  redirect(destination);
}

export async function logout() {
  await deleteSession();
  redirect("/auth/login");
}
