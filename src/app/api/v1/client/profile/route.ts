import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

// UPDATE (security-hardening fix): foodiego-backend's GET/PUT
// /api/users/:id used to have no auth check at all — any caller could
// read or overwrite any user's profile by guessing an id. Those routes
// now require a valid token AND that the caller owns that id (see
// foodiego-backend/routes/userRoutes.js), so this switched from the
// anonymous `backendFetch` to `backendFetchAsUser`, which mints and
// attaches that token for this session.

interface BackendUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await backendFetchAsUser<BackendUser>(session, `/api/users/${session.id}`);
    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
  } catch (error) {
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to load profile" }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone } = body as { name?: string; phone?: string };

  try {
    const user = await backendFetchAsUser<BackendUser>(session, `/api/users/${session.id}`, {
      method: "PUT",
      body: { name, phone },
    });
    return NextResponse.json({
      success: true,
      profile: { name: user.name, email: user.email, phone: user.phone || "" },
    });
  } catch (error) {
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to update profile" }, { status });
  }
}
