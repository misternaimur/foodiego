import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { MenuItem } from "@/models/MenuItem";
import { OrderBooking } from "@/models/OrderBooking";

// ============================================================
// UPDATE (vendor-analytics real-data fix): this route used to return a
// fully hardcoded `demoAnalyticsData` object. The earlier comment here
// said a real version needed menu items to carry a category and orders
// to carry per-item line data — but OrderBooking documents already store
// `items: [{menuItemId, name, price, quantity}]` (see OrderBooking.ts)
// and MenuItem already has a `category` field, so both are joinable now.
// This route computes:
//   - totalSales/totalOrders/avgOrderValue for the last 7 days, with
//     %-change against the *previous* 7 days.
//   - categoryData: revenue share per MenuItem category, joining each
//     order line's `menuItemId` back to MenuItem.category.
//   - topPerformers: the 5 highest-revenue menu items by name, summed
//     across order lines (quantity * price).
//   - revenueTrend/orderVolume: real day-by-day totals for the last 7
//     days (same period the stats route already computes salesTrend for).
// `ordersPerMinute` has no real minute-level order-arrival data to derive
// from, so it's approximated as this week's average daily order count
// spread evenly across a day — a rough, explicitly-approximate figure.
// ============================================================

const CATEGORY_COLORS = ["#00A36C", "#00B37E", "#4DCA9E", "#A6E9CE", "#D4F4E7", "#7CD9B5"];

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const restaurant = await Restaurant.findOne({ userId: user._id }).lean();
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant profile not found" }, { status: 404 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);

  const [weekOrders, prevWeekOrders, menuItems] = await Promise.all([
    OrderBooking.find({
      restaurantId: restaurant._id,
      createdAt: { $gte: weekStart },
      status: { $ne: "cancelled" },
    }).lean(),
    OrderBooking.find({
      restaurantId: restaurant._id,
      createdAt: { $gte: prevWeekStart, $lt: weekStart },
      status: { $ne: "cancelled" },
    }).lean(),
    MenuItem.find({ $or: [{ vendorId: restaurant._id }, { restaurantId: restaurant._id }] }).lean(),
  ]);

  const categoryByItemId = new Map<string, string>();
  for (const item of menuItems) categoryByItemId.set(String(item._id), item.category || "Other");

  const totalSales = weekOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const totalOrders = weekOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const prevTotalSales = prevWeekOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const prevTotalOrders = prevWeekOrders.length;
  const prevAvgOrderValue = prevTotalOrders > 0 ? prevTotalSales / prevTotalOrders : 0;

  const pctChange = (curr: number, prev: number) =>
    prev > 0 ? Math.round(((curr - prev) / prev) * 1000) / 10 : 0;

  const revenueTrend: { day: string; revenue: number }[] = [];
  const orderVolume: { day: string; orders: number }[] = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    const dayEnd = new Date(day);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const dayOrders = weekOrders.filter((o) => {
      const created = new Date(o.createdAt);
      return created >= day && created < dayEnd;
    });
    revenueTrend.push({ day: dayNames[day.getDay()], revenue: dayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0) });
    orderVolume.push({ day: dayNames[day.getDay()], orders: dayOrders.length });
  }

  const categoryRevenue = new Map<string, number>();
  const itemRevenue = new Map<string, number>();
  for (const order of weekOrders) {
    for (const line of order.items || []) {
      const revenue = (line.price || 0) * (line.quantity || 0);
      const category = categoryByItemId.get(line.menuItemId) || "Other";
      categoryRevenue.set(category, (categoryRevenue.get(category) || 0) + revenue);
      itemRevenue.set(line.name, (itemRevenue.get(line.name) || 0) + revenue);
    }
  }

  const totalCategoryRevenue = Array.from(categoryRevenue.values()).reduce((a, b) => a + b, 0);
  const categoryData = Array.from(categoryRevenue.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, revenue], i) => ({
      name,
      value: totalCategoryRevenue > 0 ? Math.round((revenue / totalCategoryRevenue) * 100) : 0,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }));

  const topPerformers = Array.from(itemRevenue.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, revenue], i) => ({
      name,
      revenue: Math.round(revenue),
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }));

  const ordersPerMinute = Math.round(((totalOrders / 7) / (24 * 60)) * 1000) / 1000;

  return NextResponse.json({
    totalSales,
    totalOrders,
    avgOrderValue: Math.round(avgOrderValue),
    ordersPerMinute,
    salesChange: pctChange(totalSales, prevTotalSales),
    ordersChange: pctChange(totalOrders, prevTotalOrders),
    avgOrderChange: pctChange(avgOrderValue, prevAvgOrderValue),
    revenueTrend,
    categoryData,
    orderVolume,
    topPerformers,
  });
}
