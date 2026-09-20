import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { OrderBooking } from "@/models/OrderBooking";

// ============================================================
// UPDATE (admin-refunds fix): this page used to render 4 hardcoded fake
// refund requests and "approve"/"reject" only ever touched local React
// state (reset on every page refresh). There's no dedicated refund-request
// flow anywhere in this app (a customer can't file a refund reason
// anywhere), so the real, honest equivalent is: an order that was
// cancelled AFTER the customer had already paid (paymentStatus "paid")
// is money that is actually owed back — that's the real refund queue.
// There's no cancellation-reason field collected anywhere either, so
// "reason" is left generic rather than inventing one. Approve/Reject
// persist to the real order via OrderBooking.refundStatus (see the model
// comment) instead of local-only state.
// ============================================================

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const orders = await OrderBooking.find({ status: "cancelled", paymentStatus: "paid" })
    .populate("customerId", "name")
    .sort({ updatedAt: -1 })
    .lean();

  const refunds = orders.map((o) => {
    const customer = o.customerId as unknown as { name?: string } | null;
    return {
      orderId: String(o._id),
      customer: customer?.name || "Guest",
      amount: o.totalAmount || 0,
      reason: "Order cancelled after payment",
      status: o.refundStatus || "pending",
      requestedDate: o.updatedAt,
    };
  });

  return NextResponse.json({ refunds });
}
