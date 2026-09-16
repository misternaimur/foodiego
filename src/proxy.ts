import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";

const protectedPrefixes = ["/account", "/admin", "/dashboard", "/vendor"];
const authRoutes = ["/auth/login", "/auth/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedPrefixes.some((prefix) => path.startsWith(prefix));
  const isAuthRoute = authRoutes.includes(path);

  // Allow public routes to pass through immediately
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const session = await verifySessionCookie(req.cookies.get("session")?.value);

  // 1. Guard protected routes: Redirect to login if unauthenticated
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/auth/login", req.nextUrl);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Guard auth routes: Redirect logged-in users away from login/register pages
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // 3. Centralized Role-Based Routing for /account
  if (path === "/account" && session) {
    switch (session.role) {
      case "admin":
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      case "restaurant":
        return NextResponse.redirect(new URL("/vendor", req.nextUrl));
      case "rider":
        return NextResponse.redirect(new URL("/rider", req.nextUrl));
      default:
        return NextResponse.redirect(new URL("/client/dashboard", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};