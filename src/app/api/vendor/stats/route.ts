import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { MenuItem } from "@/models/MenuItem";
import { OrderBooking } from "@/models/OrderBooking";
import { Review } from "@/models/Review";
import { toVendorOrderStatus } from "@/lib/orderStatusMap";

// UPDATE: switched from the unused `Order` model (collection "orders",
// always empty because nothing writes to it) to `OrderBooking` (collection
// "orderBooking"), which is what a real customer checkout actually creates.
// See src/lib/orderStatusMap.ts for the status-vocabulary translation this
// route relies on to keep its JSON response shape unchanged for the
// dashboard UI (src/app/(main)/vendor/components/DashboardOverview.tsx).

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
    return NextResponse.json({
      todaySales: 0,
      ordersCount: 0,
      pendingCount: 0,
      activeCount: 0,
      rating: 0,
      salesTrend: [],
      totalWeekly: 0,
      bestSellers: [],
      ratingBreakdown: [
        { stars: 5, percentage: 0 },
        { stars: 4, percentage: 0 },
        { stars: 3, percentage: 0 },
        { stars: 2, percentage: 0 },
        { stars: 1, percentage: 0 },
      ],
      recentOrders: [],
      totalRestaurants: 0,
    });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);

  const [
    todayOrders,
    weekOrders,
    recentOrdersData,
    menuItems,
    reviews,
  ] = await Promise.all([
    OrderBooking.find({
      restaurantId: restaurant._id,
      createdAt: { $gte: todayStart },
    }).lean(),
    OrderBooking.find({
      restaurantId: restaurant._id,
      createdAt: { $gte: weekStart },
    }).lean(),
    OrderBooking.find({ restaurantId: restaurant._id })
      .populate("customerId", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    MenuItem.find({ vendorId: restaurant._id }).lean(),
    Review.find({ merchantId: restaurant._id }).lean(),
  ]);

  const todaySales = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const ordersCount = todayOrders.length;
  const pendingCount = todayOrders.filter((o) => toVendorOrderStatus(o.status) === "new").length;
  const activeCount = todayOrders.filter((o) =>
    ["preparing", "ready", "picked_up"].includes(toVendorOrderStatus(o.status))
  ).length;

  const rating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, percentage };
  });

  const salesTrend = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + (6 - i));
    const dayEnd = new Date(day);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const dayOrders = weekOrders.filter((o) => {
      const created = new Date(o.createdAt);
      return created >= day && created < dayEnd;
    });
    const revenue = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    salesTrend.push({ day: dayNames[day.getDay()], revenue });
  }

  const totalWeekly = weekOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const bestSellers = menuItems
    .sort((a, b) => (b.ordersCount || 0) - (a.ordersCount || 0))
    .slice(0, 3)
    .map((item) => ({
      id: item._id.toString(),
      name: item.name,
      orders: item.ordersCount || 0,
      image: item.image || "",
    }));

  const recentOrders = recentOrdersData.map((o) => {
    const customer = o.customerId as unknown as { name?: string } | null;
    return {
      id: String(o._id),
      customer: customer?.name || "Guest",
      items: o.items?.map((i) => `${i.quantity}x ${i.name}`).join(", ") || "",
      amount: o.totalAmount || 0,
      time: new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: toVendorOrderStatus(o.status),
    };
  });

  return NextResponse.json({
    todaySales,
    ordersCount,
    pendingCount,
    activeCount,
    rating: Number(rating.toFixed(1)),
    salesTrend,
    totalWeekly,
    bestSellers,
    ratingBreakdown,
    recentOrders,
    totalRestaurants: 1,
  });
}
