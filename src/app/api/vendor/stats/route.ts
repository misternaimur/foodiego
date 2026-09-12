import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";

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
  }  const [restaurants] = await Promise.all([
    Restaurant.find({ status: "approved" }).lean(),
  ]);

  const totalRestaurants = restaurants.length;

  const dashboardStats = {
    todaySales: 24850,
    ordersCount: 186,
    pendingCount: 12,
    activeCount: 24,
    rating: 4.8,
    salesTrend: [
      { day: "Mon", revenue: 18500 },
      { day: "Tue", revenue: 22300 },
      { day: "Wed", revenue: 19800 },
      { day: "Thu", revenue: 26700 },
      { day: "Fri", revenue: 28900 },
      { day: "Sat", revenue: 24800 },
      { day: "Sun", revenue: 19200 },
    ],
    totalWeekly: 148500,
    bestSellers: [
      {
        id: "1",
        name: "Signature Chicken Burger",
        orders: 48,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: "2",
        name: "Wood-fired Pepperoni Pizza",
        orders: 32,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: "3",
        name: "Spicy Wings Combo",
        orders: 24,
        image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=200",
      },
    ],
    ratingBreakdown: [
      { stars: 5, percentage: 80 },
      { stars: 4, percentage: 15 },
      { stars: 3, percentage: 3 },
      { stars: 2, percentage: 1 },
      { stars: 1, percentage: 1 },
    ],
    recentOrders: [
      {
        id: "#FG10234",
        customer: "Rahim A.",
        items: "2x Classic Burger, 1x Fries",
        amount: 850,
        time: "14:32",
        status: "new",
      },
      {
        id: "#FG10231",
        customer: "Nahid R.",
        items: "1x Margherita Pizza",
        amount: 450,
        time: "14:18",
        status: "preparing",
      },
      {
        id: "#FG10229",
        customer: "Sadia K.",
        items: "3x Chicken Wrap, 1x Cola",
        amount: 620,
        time: "13:55",
        status: "accepted",
      },
      {
        id: "#FG10227",
        customer: "Tanvir M.",
        items: "1x Spicy Wings",
        amount: 380,
        time: "13:22",
        status: "delivered",
      },
      {
        id: "#FG10225",
        customer: "Farzana S.",
        items: "2x Brownie, 1x Milkshake",
        amount: 520,
        time: "13:10",
        status: "delivered",
      },
    ],
    totalRestaurants,
  };

  return NextResponse.json(dashboardStats);
}
