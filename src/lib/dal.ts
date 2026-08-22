import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

export const getOptionalSession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const decoded = await verifySessionCookie(cookie);

  if (!decoded) return null;

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user) return null;

  return { userId: decoded.uid, role: user.role, name: user.name };
});

export const verifySession = cache(async () => {
  const session = await getOptionalSession();

  if (!session) {
    redirect("/login");
  }

  return session;
});
