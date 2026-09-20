import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { OrderBooking } from "@/models/OrderBooking";
import { Restaurant } from "@/models/Restaurant";

// ============================================================
// UPDATE (admin-commission fix): this page used to render 4 hardcoded
// commission rows and a "Pending Commission" figure that was a literal
// `4850.20` constant with a "Simulated pending backend sum" comment. It
// now computes real per-order commission from every restaurant's real
// OrderBooking history, using the same PLATFORM_COMMISSION_RATE (15%) as
// the vendor payments route (src/app/api/v1/vendor/payments/route.ts) —
// there is still no per-vendor commission-rate field anywhere in the
// schema, so this is a platform-wide flat rate, same caveat as there.
// "Total Commission (This Month)" sums delivered orders this calendar
// month; "Pending Commission" sums orders still in the delivery pipeline
// (confirmed/preparing/out_for_delivery) — commission not yet finalized.
// ============================================================

const PLATFORM_COMMISSION_RATE = 0.15;

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [delivered, inFlight, restaurants] = await Promise.all([
    OrderBooking.find({ status: "delivered", restaurantId: { $ne: null } })
      .sort({ updatedAt: -1 })
      .limit(200)
      .lean(),
    OrderBooking.find({ status: { $in: ["confirmed", "preparing", "out_for_delivery"] }, restaurantId: { $ne: null } }).lean(),
    Restaurant.find().select("restaurantName").lean(),
  ]);

  const restaurantNameById = new Map(restaurants.map((r) => [String(r._id), r.restaurantName]));
  const grossOf = (o: { totalAmount?: number; deliveryFee?: number }) =>
    Math.max(0, (o.totalAmount || 0) - (o.deliveryFee || 0));

  const rows = delivered.map((o) => {
    const gross = grossOf(o);
    const commission = gross * PLATFORM_COMMISSION_RATE;
    return {
      orderId: String(o._id),
      vendor: restaurantNameById.get(String(o.restaurantId)) || o.restaurantName || "Unknown vendor",
      orderAmount: gross,
      commissionRate: PLATFORM_COMMISSION_RATE * 100,
      commissionAmount: commission,
      vendorEarning: gross - commission,
      date: o.updatedAt,
    };
  });

  const totalCommissionThisMonth = delivered
    .filter((o) => new Date(o.updatedAt) >= monthStart)
    .reduce((sum, o) => sum + grossOf(o) * PLATFORM_COMMISSION_RATE, 0);

  const pendingCommission = inFlight.reduce((sum, o) => sum + grossOf(o) * PLATFORM_COMMISSION_RATE, 0);

  return NextResponse.json({
    rows,
    totalCommissionThisMonth,
    pendingCommission,
  });
}
