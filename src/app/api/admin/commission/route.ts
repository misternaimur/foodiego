import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { OrderBooking } from "@/models/OrderBooking";
import { Restaurant } from "@/models/Restaurant";
import { commissionRateOf } from "@/lib/commission";

// ============================================================
// UPDATE (admin-commission fix, extended by the per-vendor-commission
// fix): this page used to render 4 hardcoded commission rows and a
// "Pending Commission" figure that was a literal `4850.20` constant. It
// now computes real per-order commission from every restaurant's real
// OrderBooking history, using each restaurant's own commissionRate when an
// admin has set one (see Restaurant.ts / src/lib/commission.ts), otherwise
// the 15% platform default. "Total Commission (This Month)" sums delivered
// orders this calendar month; "Pending Commission" sums orders still in
// the delivery pipeline (confirmed/preparing/out_for_delivery) — commission
// not yet finalized.
// ============================================================

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
    Restaurant.find().select("restaurantName commissionRate").lean(),
  ]);

  const restaurantById = new Map(restaurants.map((r) => [String(r._id), r]));
  const rateFor = (restaurantId: unknown) => commissionRateOf(restaurantById.get(String(restaurantId)));
  const grossOf = (o: { totalAmount?: number; deliveryFee?: number }) =>
    Math.max(0, (o.totalAmount || 0) - (o.deliveryFee || 0));

  const rows = delivered.map((o) => {
    const gross = grossOf(o);
    const rate = rateFor(o.restaurantId);
    const commission = gross * rate;
    return {
      orderId: String(o._id),
      vendor: restaurantById.get(String(o.restaurantId))?.restaurantName || o.restaurantName || "Unknown vendor",
      orderAmount: gross,
      commissionRate: rate * 100,
      commissionAmount: commission,
      vendorEarning: gross - commission,
      date: o.updatedAt,
    };
  });

  const totalCommissionThisMonth = delivered
    .filter((o) => new Date(o.updatedAt) >= monthStart)
    .reduce((sum, o) => sum + grossOf(o) * rateFor(o.restaurantId), 0);

  const pendingCommission = inFlight.reduce((sum, o) => sum + grossOf(o) * rateFor(o.restaurantId), 0);

  return NextResponse.json({
    rows,
    totalCommissionThisMonth,
    pendingCommission,
  });
}
