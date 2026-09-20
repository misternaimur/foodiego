import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

// UPDATE (security-hardening fix): foodiego-backend's favorites endpoints
// used to have no auth check — any caller could read/toggle any user's
// favorites by guessing an id. They now require a valid token owned by
// that same user (see foodiego-backend/routes/userRoutes.js), so this
// switched from the anonymous `backendFetch` to `backendFetchAsUser`.

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const favorites = await backendFetchAsUser<string[]>(session, `/api/users/${session.id}/favorites`);
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Failed to load favorites:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to load favorites" }, { status });
  }
}

/** Toggles one food id in/out of the customer's favorites. Body: { foodId } */
export async function POST(req: NextRequest) {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { foodId } = (await req.json()) as { foodId?: string };
  if (!foodId) {
    return NextResponse.json({ error: "foodId is required" }, { status: 400 });
  }

  try {
    const favorites = await backendFetchAsUser<string[]>(session, `/api/users/${session.id}/favorites`, {
      method: "POST",
      body: { foodId },
    });
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Failed to update favorites:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to update favorites" }, { status });
  }
}
