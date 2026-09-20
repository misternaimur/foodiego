import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";
import type { ClientAddress } from "../route";

// UPDATE (security-hardening fix): see src/app/api/v1/client/addresses/route.ts —
// these calls now authenticate as the calling user via `backendFetchAsUser`
// instead of the anonymous `backendFetch`, matching foodiego-backend's own
// address routes now requiring a token owned by that same user.

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { addressId } = await params;
  const body = await req.json();

  try {
    const addresses = await backendFetchAsUser<ClientAddress[]>(
      session,
      `/api/users/${session.id}/addresses/${addressId}`,
      { method: "PUT", body }
    );
    return NextResponse.json({ addresses });
  } catch (error) {
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to update address" }, { status });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { addressId } = await params;

  try {
    const addresses = await backendFetchAsUser<ClientAddress[]>(
      session,
      `/api/users/${session.id}/addresses/${addressId}`,
      { method: "DELETE" }
    );
    return NextResponse.json({ addresses });
  } catch (error) {
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to delete address" }, { status });
  }
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { addressId } = await params;

  try {
    const addresses = await backendFetchAsUser<ClientAddress[]>(
      session,
      `/api/users/${session.id}/addresses/${addressId}/default`,
      { method: "PATCH", body: {} }
    );
    return NextResponse.json({ addresses });
  } catch (error) {
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to set default address" }, { status });
  }
}
