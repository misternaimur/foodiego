import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";

const protectedPrefixes = ["/account", "/admin", "/dashboard"];
const authRoutes = ["/login", "/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedPrefixes.some((prefix) => path.startsWith(prefix));
  const isAuthRoute = authRoutes.includes(path);

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const session = await verifySessionCookie(req.cookies.get("session")?.value);

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
