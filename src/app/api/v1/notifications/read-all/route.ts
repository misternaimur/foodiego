import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

export async function PATCH() {
  const session = await getOptionalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await backendFetchAsUser(session, "/api/notifications/read-all", { method: "PATCH" });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to mark all notifications read:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to update notifications" }, { status });
  }
}
