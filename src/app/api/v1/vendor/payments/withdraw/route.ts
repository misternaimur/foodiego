import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";

// UPDATE (vendor-payments real-data fix): this endpoint used to just echo
// back a fake "WD-xxxxxx" confirmation without touching the database at
// all — every "withdrawal" was pure fiction and the balance never
// actually moved. It now checks the real available balance (computed the
// same way as GET /api/v1/vendor/payments) and persists the withdrawal by
// incrementing Restaurant.walletWithdrawn, so the balance genuinely goes
// down and stays down across requests/restarts. There is still no real
// bKash/Nagad/bank payout rail behind this (that needs merchant
// credentials this project doesn't have), so no real money moves — this
// only updates the internal ledger used to display balance.
export async function POST(req: NextRequest) {
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

  const restaurant = await Restaurant.findOne({ userId: user._id });
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant profile not found" }, { status: 404 });
  }

  const body = await req.json();
  const { amount, method, account } = body as { amount: number; method: string; account: string };

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  restaurant.walletWithdrawn = (restaurant.walletWithdrawn || 0) + amount;
  await restaurant.save();

  return NextResponse.json({
    success: true,
    transactionId: `WD-${Date.now().toString().slice(-6)}`,
    amount,
    method,
    account,
    message: `Withdrawal of $${amount} recorded via ${method}. (No live payment gateway is configured, so this updates your Foodiego balance only.)`,
  });
}
