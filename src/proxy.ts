import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";
import type { Role } from "@/lib/definitions";

const roleHome: Record<Role, string> = {
  admin: "/admin",
  restaurant: "/dashboard/restaurant",
  rider: "/dashboard/rider",
  customer: "/",
};

const protectedPrefixes = ["/account", "/admin", "/dashboard"];
const authRoutes = ["/login", "/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedPrefixes.some((prefix) => path.startsWith(prefix));
  const isAuthRoute = authRoutes.includes(path);

  const session = isProtectedRoute || isAuthRoute ? await decrypt(req.cookies.get("session")?.value) : null;

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  if (session && path.startsWith("/admin") && session.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (session && path.startsWith("/dashboard/restaurant") && session.role !== "restaurant") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (session && path.startsWith("/dashboard/rider") && session.role !== "rider") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL(roleHome[session.role], req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
