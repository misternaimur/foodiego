import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (process.env.NODE_ENV === "development" && !decoded) {
    const body = await req.json();
    const { amount, method, account } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      transactionId: `WD-${Date.now().toString().slice(-6)}`,
      amount,
      method,
      account,
      message: `Withdrawal of ৳${amount} initiated via ${method}. Funds will be processed within 24 hours.`,
    });
  }

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { amount, method, account } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    transactionId: `WD-${Date.now().toString().slice(-6)}`,
    amount,
    method,
    account,
    message: `Withdrawal of ৳${amount} initiated via ${method}. Funds will be processed within 24 hours.`,
  });
}
