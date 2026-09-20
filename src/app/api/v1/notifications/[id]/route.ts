import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getOptionalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    await backendFetchAsUser(session, `/api/notifications/${id}/read`, { method: "PATCH" });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to mark notification read:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to update notification" }, { status });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getOptionalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    await backendFetchAsUser(session, `/api/notifications/${id}`, { method: "DELETE" });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to delete notification" }, { status });
  }
}
