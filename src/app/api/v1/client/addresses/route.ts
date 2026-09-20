import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

// UPDATE (security-hardening fix): foodiego-backend's address endpoints
// used to have no auth check — any caller could read/add addresses on any
// user's account by guessing an id. They now require a valid token owned
// by that same user (see foodiego-backend/routes/userRoutes.js), so this
// switched from the anonymous `backendFetch` to `backendFetchAsUser`.

export interface ClientAddress {
  _id: string;
  label: string;
  fullName: string;
  phone?: string;
  addressLine: string;
  city: string;
  isDefault: boolean;
}

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const addresses = await backendFetchAsUser<ClientAddress[]>(session, `/api/users/${session.id}/addresses`);
    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Failed to load addresses:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to load addresses" }, { status });
  }
}

export async function POST(req: NextRequest) {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const addresses = await backendFetchAsUser<ClientAddress[]>(session, `/api/users/${session.id}/addresses`, {
      method: "POST",
      body,
    });
    return NextResponse.json({ addresses }, { status: 201 });
  } catch (error) {
    console.error("Failed to add address:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to add address" }, { status });
  }
}
