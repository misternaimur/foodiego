// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";

const protectedPrefixes = ["/account", "/admin", "/dashboard", "/vendor", "/rider", "/client"];
const authRoutes = ["/auth/login", "/auth/register"];

export function getDashboardPathByRole(role: string): string {
  const normalizedRole = role ? role.toLowerCase() : "";
  switch (normalizedRole) {
    case "admin":
      return "/admin";
    case "restaurant":
    case "vendor":
      return "/vendor";
    case "rider":
      return "/rider";
    case "customer":
    case "client":
    default:
      return "/admin";
  }
}

function isRoleAuthorizedForPath(role: string, path: string): boolean {
  const normalizedRole = role ? role.toLowerCase() : "";
  if (path.startsWith("/admin")) {
    return normalizedRole === "admin";
  }
  if (path.startsWith("/vendor")) {
    return normalizedRole === "vendor" || normalizedRole === "restaurant";
  }
  if (path.startsWith("/rider")) {
    return normalizedRole === "rider";
  }
  if (path.startsWith("/client")) {
    return normalizedRole === "client" || normalizedRole === "customer";
  }
  return true;
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedPrefixes.some((prefix) => path.startsWith(prefix));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
  const isHomeRoute = path === "/";

  const session = await verifySessionCookie(req.cookies.get("session")?.value);

  // If user is logged in and visits auth routes, redirect to their role dashboard
  if (isAuthRoute && session) {
    const dashboardPath = getDashboardPathByRole(session.role);
    return NextResponse.redirect(new URL(dashboardPath, req.nextUrl));
  }

  // Redirect root "/" for logged in users to their dashboard
  if (isHomeRoute && session) {
    const dashboardPath = getDashboardPathByRole(session.role);
    return NextResponse.redirect(new URL(dashboardPath, req.nextUrl));
  }

  // Redirect generic "/account" or "/dashboard" paths to role dashboard
  if ((path === "/account" || path === "/dashboard") && session) {
    const dashboardPath = getDashboardPathByRole(session.role);
    return NextResponse.redirect(new URL(dashboardPath, req.nextUrl));
  }

  // Block unauthenticated users accessing protected routes
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/auth/login", req.nextUrl);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Enforce role-based access for protected role sub-trees
  if (session && isProtectedRoute) {
    if (!isRoleAuthorizedForPath(session.role, path)) {
      const dashboardPath = getDashboardPathByRole(session.role);
      return NextResponse.redirect(new URL(dashboardPath, req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};