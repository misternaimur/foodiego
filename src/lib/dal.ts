import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import type { Role } from "@/lib/definitions";

export const getOptionalSession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const decoded = await verifySessionCookie(cookie);

  if (!decoded) return null;

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    userId: decoded.uid,
    role: user.role,
    name: user.name,
    email: user.email,
  };
});

export const verifySession = cache(async () => {
  const session = await getOptionalSession();

  if (!session) {
    redirect("/auth/login");
  }

  return session;
});

function getRoleDashboard(role: string): string {
  const norm = role ? role.toLowerCase() : "";
  if (norm === "admin") return "/admin";
  if (norm === "restaurant" || norm === "vendor") return "/vendor";
  if (norm === "rider") return "/rider";
  return "/client";
}

export const verifyRole = cache(async (...roles: (Role | "vendor" | "client")[]) => {
  const session = await verifySession();

  const userRole = session.role ? session.role.toLowerCase() : "";
  const allowed = roles.some((r) => {
    const rNorm = r.toLowerCase();
    if (rNorm === userRole) return true;
    if ((rNorm === "restaurant" || rNorm === "vendor") && (userRole === "restaurant" || userRole === "vendor")) return true;
    if ((rNorm === "customer" || rNorm === "client") && (userRole === "customer" || userRole === "client")) return true;
    return false;
  });

  if (!allowed) {
    redirect(getRoleDashboard(session.role));
  }

  return session;
});
