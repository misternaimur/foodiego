import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const body = (await req.json()) as { rating: number };

  try {
    await backendFetchAsUser(session, `/api/orders/${orderId}/rider-rating`, {
      method: "PATCH",
      body: { rating: body.rating },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to rate rider:", error);
    const status = error instanceof BackendError ? error.status : 500;
    const message = error instanceof BackendError ? error.message : "Failed to submit rating";
    return NextResponse.json({ error: message }, { status });
  }
}
