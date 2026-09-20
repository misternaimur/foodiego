import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { OrderBooking } from "@/models/OrderBooking";

// UPDATE: switched from the unused `Order` model to `OrderBooking`, the
// collection the real checkout flow writes to — see
// src/lib/orderStatusMap.ts for background on why the vendor dashboard's
// order data source needed this fix. "cancelled" is OrderBooking's
// equivalent of the old model's "rejected" status.

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
    // Return default weekly data if no restaurant
    const defaultData = [
      { day: "Mon", revenue: 4200, orders: 12 },
      { day: "Tue", revenue: 6800, orders: 18 },
      { day: "Wed", revenue: 5100, orders: 15 },
      { day: "Thu", revenue: 8900, orders: 24 },
      { day: "Fri", revenue: 12400, orders: 32 },
      { day: "Sat", revenue: 15600, orders: 41 },
      { day: "Sun", revenue: 11200, orders: 28 },
    ];
    const totalWeekly = defaultData.reduce((sum, d) => sum + d.revenue, 0);
    return NextResponse.json({ salesData: defaultData, totalWeekly });
  }

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const weekOrders = await OrderBooking.find({
    restaurantId: restaurant._id,
    createdAt: { $gte: weekStart, $lt: weekEnd },
    status: { $ne: "cancelled" }
  }).lean();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const salesData = dayNames.map((day, index) => {
    const dayStart = new Date(weekStart);
    dayStart.setDate(weekStart.getDate() + index);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const dayOrders = weekOrders.filter((o) => {
      const created = new Date(o.createdAt);
      return created >= dayStart && created < dayEnd;
    });

    const revenue = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const orders = dayOrders.length;

    return { day, revenue, orders };
  });

  const totalWeekly = salesData.reduce((sum, d) => sum + d.revenue, 0);

  return NextResponse.json({ salesData, totalWeekly });
}