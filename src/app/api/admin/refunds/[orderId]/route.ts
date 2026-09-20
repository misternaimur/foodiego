import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { OrderBooking } from "@/models/OrderBooking";

// UPDATE (admin-refunds fix): persists the admin's approve/reject decision
// on a real order's refundStatus — see src/app/api/admin/refunds/route.ts
// for why a cancelled+paid order is used as the refund record itself.
// Note: actually returning the money to the customer needs a real payment
// gateway (bKash/Nagad/card processor) integration, which this project
// doesn't have credentials for — same limitation as vendor payouts (see
// src/app/api/v1/vendor/payments/withdraw/route.ts). This records the
// admin's decision for real; it doesn't move money.
export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;
  const { status } = (await req.json()) as { status?: "approved" | "rejected" };
  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ error: "status must be 'approved' or 'rejected'" }, { status: 400 });
  }

  await dbConnect();
  const order = await OrderBooking.findByIdAndUpdate(orderId, { refundStatus: status }, { new: true }).lean();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, status: order.refundStatus });
}
