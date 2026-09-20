import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { OrderBooking } from "@/models/OrderBooking";
import { Restaurant } from "@/models/Restaurant";

// ============================================================
// UPDATE (admin-analytics fix): /admin/analytics used to be 100% static
// — fixed stat cards ($84,240.50 / 1,630 orders / $12,420.00, all with
// fake "+14.2%" style deltas), a 15-bar chart drawn from a hardcoded
// array of heights, and a fixed 5-row "Top Vendors" table. This route
// computes all of it from real OrderBooking data platform-wide:
//   - "Sales Overview": gross order value (sum of totalAmount) for the
//     selected period, %change vs the immediately preceding period of
//     equal length.
//   - "Order Overview": order count for the period, same %change method.
//   - "Revenue Overview": platform commission earned for the period (see
//     src/app/api/admin/commission/route.ts for the same 15% flat-rate
//     caveat — there's no per-vendor commission-rate field yet).
//   - The bar chart: real daily revenue buckets ("Today" -> hourly
//     buckets across today; 7/30 Days -> one bucket per day). "Custom" has
//     no date-range picker anywhere in the UI, so it falls back to the
//     same 30-day window as "30 Days".
//   - "Top Vendors": real restaurants ranked by revenue over the period.
// ============================================================

const PLATFORM_COMMISSION_RATE = 0.15;
type Range = "Today" | "7 Days" | "30 Days" | "Custom";

function rangeDays(range: Range): number {
  if (range === "Today") return 1;
  if (range === "7 Days") return 7;
  return 30; // "30 Days" and "Custom" (no picker exists yet)
}

export async function GET(req: NextRequest) {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const range = (req.nextUrl.searchParams.get("range") as Range) || "30 Days";
  const days = rangeDays(range);

  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setDate(periodStart.getDate() - days);
  const prevPeriodStart = new Date(periodStart);
  prevPeriodStart.setDate(prevPeriodStart.getDate() - days);

  const [periodOrders, prevPeriodOrders, allTimeForTopVendors, restaurants] = await Promise.all([
    OrderBooking.find({ createdAt: { $gte: periodStart }, status: { $ne: "cancelled" } }).lean(),
    OrderBooking.find({ createdAt: { $gte: prevPeriodStart, $lt: periodStart }, status: { $ne: "cancelled" } }).lean(),
    OrderBooking.aggregate([
      { $match: { createdAt: { $gte: periodStart }, status: { $ne: "cancelled" }, restaurantId: { $ne: null } } },
      { $group: { _id: "$restaurantId", orders: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]),
    Restaurant.find().select("restaurantName").lean(),
  ]);

  const restaurantNameById = new Map(restaurants.map((r) => [String(r._id), r.restaurantName]));

  const grossOf = (o: { totalAmount?: number; deliveryFee?: number }) =>
    Math.max(0, (o.totalAmount || 0) - (o.deliveryFee || 0));

  const totalSales = periodOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const prevTotalSales = prevPeriodOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const totalOrders = periodOrders.length;
  const prevTotalOrders = prevPeriodOrders.length;
  const totalRevenue = periodOrders.reduce((s, o) => s + grossOf(o) * PLATFORM_COMMISSION_RATE, 0);
  const prevTotalRevenue = prevPeriodOrders.reduce((s, o) => s + grossOf(o) * PLATFORM_COMMISSION_RATE, 0);

  const pctChange = (curr: number, prev: number) => (prev > 0 ? Math.round(((curr - prev) / prev) * 1000) / 10 : 0);

  const bars: { label: string; value: number }[] = [];
  if (range === "Today") {
    for (let h = 0; h < 24; h++) {
      const hourStart = new Date(now);
      hourStart.setHours(h, 0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(h + 1);
      const value = periodOrders
        .filter((o) => {
          const t = new Date(o.createdAt);
          return t >= hourStart && t < hourEnd;
        })
        .reduce((s, o) => s + (o.totalAmount || 0), 0);
      bars.push({ label: `${h}:00`, value });
    }
  } else {
    for (let i = days - 1; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const value = periodOrders
        .filter((o) => {
          const t = new Date(o.createdAt);
          return t >= dayStart && t < dayEnd;
        })
        .reduce((s, o) => s + (o.totalAmount || 0), 0);
      bars.push({ label: dayStart.toLocaleDateString([], { month: "short", day: "numeric" }), value });
    }
  }

  const topVendors = allTimeForTopVendors.map((v: { _id: unknown; orders: number; revenue: number }) => ({
    id: String(v._id),
    vendor: restaurantNameById.get(String(v._id)) || "Unknown vendor",
    orders: v.orders,
    revenue: v.revenue,
  }));

  return NextResponse.json({
    totalSales,
    salesChange: pctChange(totalSales, prevTotalSales),
    totalOrders,
    ordersChange: pctChange(totalOrders, prevTotalOrders),
    totalRevenue,
    revenueChange: pctChange(totalRevenue, prevTotalRevenue),
    bars,
    topVendors,
  });
}
