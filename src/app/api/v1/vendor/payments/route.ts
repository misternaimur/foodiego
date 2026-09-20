import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { OrderBooking } from "@/models/OrderBooking";
import { commissionRateOf } from "@/lib/commission";

// ============================================================
// UPDATE (vendor-payments real-data fix): this route used to return a
// fully fabricated `demoTransactions`/`demoEarningsTrend` array and a
// process-global `mockBalance` variable (shared across every vendor,
// reset on every server restart). It now derives everything from this
// vendor's real OrderBooking history:
//   - "gross" per order = totalAmount - deliveryFee (the delivery fee is
//     the rider's earning, not the vendor's — see OrderBooking.ts).
//   - commission uses this restaurant's own commissionRate when an admin
//     has set one, otherwise the 15% platform default — see
//     src/lib/commission.ts's commissionRateOf().
//   - "Paid" transactions = delivered orders (revenue has been earned).
//     "Pending" = orders still in the delivery pipeline (confirmed/
//     preparing/out_for_delivery) — money not yet finalized.
//   - availableBalance = lifetime net earnings minus `walletWithdrawn`
//     (see Restaurant.ts), a real persisted ledger. There's still no real
//     bKash/Nagad/bank payout integration (needs merchant credentials),
//     so withdrawing only reduces this internal ledger — see
//     src/app/api/v1/vendor/payments/withdraw/route.ts.
// ============================================================

export type PaymentStatus = "Paid" | "Pending" | "Failed";

export interface PaymentTransaction {
  id: string;
  orderId: string;
  customerName: string;
  date: string;
  grossAmount: number;
  commission: number;
  netEarnings: number;
  status: PaymentStatus;
}

export interface PaymentsOverview {
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  platformCommission: number;
  monthlyGrowth: number;
  transactions: PaymentTransaction[];
  earningsTrend: { month: string; gross: number; net: number }[];
  aiInsights: string[];
}

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

  const PLATFORM_COMMISSION_RATE = commissionRateOf(restaurant);

  const orders = await OrderBooking.find({ restaurantId: restaurant._id })
    .populate("customerId", "name")
    .sort({ createdAt: -1 })
    .lean();

  function grossOf(o: (typeof orders)[number]) {
    return Math.max(0, (o.totalAmount || 0) - (o.deliveryFee || 0));
  }

  const delivered = orders.filter((o) => o.status === "delivered");
  const inFlight = orders.filter((o) =>
    ["confirmed", "preparing", "out_for_delivery"].includes(o.status)
  );

  const transactions: PaymentTransaction[] = [...delivered, ...inFlight]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 50)
    .map((o) => {
      const gross = grossOf(o);
      const commission = Math.round(gross * PLATFORM_COMMISSION_RATE * 100) / 100;
      const customer = o.customerId as unknown as { name?: string } | null;
      return {
        id: `TXN-${String(o._id).slice(-8).toUpperCase()}`,
        orderId: `#${String(o._id).slice(-6).toUpperCase()}`,
        customerName: customer?.name || "Customer",
        date: new Date(o.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        grossAmount: gross,
        commission,
        netEarnings: gross - commission,
        status: o.status === "delivered" ? "Paid" : ("Pending" as PaymentStatus),
      };
    });

  const totalEarnings = delivered.reduce((sum, o) => {
    const gross = grossOf(o);
    return sum + (gross - gross * PLATFORM_COMMISSION_RATE);
  }, 0);
  const pendingBalance = inFlight.reduce((sum, o) => {
    const gross = grossOf(o);
    return sum + (gross - gross * PLATFORM_COMMISSION_RATE);
  }, 0);
  const availableBalance = Math.max(0, totalEarnings - (restaurant.walletWithdrawn || 0));

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonthNet = delivered
    .filter((o) => new Date(o.updatedAt) >= thisMonthStart)
    .reduce((s, o) => s + (grossOf(o) * (1 - PLATFORM_COMMISSION_RATE)), 0);
  const lastMonthNet = delivered
    .filter((o) => new Date(o.updatedAt) >= lastMonthStart && new Date(o.updatedAt) < thisMonthStart)
    .reduce((s, o) => s + (grossOf(o) * (1 - PLATFORM_COMMISSION_RATE)), 0);
  const monthlyGrowth = lastMonthNet > 0 ? Math.round(((thisMonthNet - lastMonthNet) / lastMonthNet) * 1000) / 10 : 0;

  const earningsTrend: { month: string; gross: number; net: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthOrders = delivered.filter((o) => {
      const t = new Date(o.updatedAt).getTime();
      return t >= monthStart.getTime() && t < monthEnd.getTime();
    });
    const gross = monthOrders.reduce((s, o) => s + grossOf(o), 0);
    earningsTrend.push({
      month: monthStart.toLocaleDateString("en-US", { month: "short" }),
      gross: Math.round(gross),
      net: Math.round(gross * (1 - PLATFORM_COMMISSION_RATE)),
    });
  }

  const cashCount = orders.filter((o) => o.paymentMethod === "cash").length;
  const onlineCount = orders.length - cashCount;
  const cashPct = orders.length > 0 ? Math.round((cashCount / orders.length) * 100) : 0;
  const aiInsights = [
    `Payment method split: ${cashPct}% cash on delivery, ${100 - cashPct}% online (${onlineCount} orders). Encouraging more online payments can reduce delivery-time cash handling.`,
    `Platform commission is currently ${(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}% per order, applied to the item subtotal (delivery fees go to the rider, not the platform).`,
    delivered.length > 0
      ? `You've completed ${delivered.length} delivered order${delivered.length === 1 ? "" : "s"} so far, earning ${totalEarnings.toFixed(2)} in net revenue after commission.`
      : "No delivered orders yet — earnings will appear here once your first order is completed.",
  ];

  return NextResponse.json({
    totalEarnings,
    availableBalance,
    pendingBalance,
    platformCommission: PLATFORM_COMMISSION_RATE * 100,
    monthlyGrowth,
    transactions,
    earningsTrend,
    aiInsights,
  } as PaymentsOverview);
}
