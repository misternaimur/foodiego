import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

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

let mockBalance = 45200;

export const demoTransactions: PaymentTransaction[] = [
  {
    id: "TXN-98234-A",
    orderId: "#ORD-5521",
    customerName: "Sarah M.",
    date: "Oct 24, 2023",
    grossAmount: 1200,
    commission: 180,
    netEarnings: 1020,
    status: "Paid",
  },
  {
    id: "TXN-98235-B",
    orderId: "#ORD-5522",
    customerName: "David C.",
    date: "Oct 24, 2023",
    grossAmount: 850,
    commission: 127.5,
    netEarnings: 722.5,
    status: "Pending",
  },
  {
    id: "TXN-98236-C",
    orderId: "#ORD-5523",
    customerName: "Elena R.",
    date: "Oct 23, 2023",
    grossAmount: 1050,
    commission: 157.5,
    netEarnings: 892.5,
    status: "Paid",
  },
  {
    id: "TXN-98237-D",
    orderId: "#ORD-5524",
    customerName: "Mike K.",
    date: "Oct 23, 2023",
    grossAmount: 620,
    commission: 93,
    netEarnings: 527,
    status: "Paid",
  },
  {
    id: "TXN-98238-E",
    orderId: "#ORD-5525",
    customerName: "Tanvir M.",
    date: "Oct 23, 2023",
    grossAmount: 780,
    commission: 117,
    netEarnings: 663,
    status: "Failed",
  },
];

export const demoEarningsTrend = [
  { month: "Jan", gross: 35000, net: 29750 },
  { month: "Feb", gross: 42000, net: 35700 },
  { month: "Mar", gross: 38000, net: 32300 },
  { month: "Apr", gross: 45000, net: 38250 },
  { month: "May", gross: 48000, net: 40800 },
  { month: "Jun", gross: 52000, net: 44200 },
];

const AI_INSIGHTS = [
  "Weekend Surge Predicted (+22% orders expected) — consider staffing up your kitchen and enabling auto-assignment for delivery riders.",
  "Top Earning Item: Spicy Beef Burger — 18% of total revenue this month. Consider featuring it in promotions.",
  "Payment method analysis: 68% cash, 32% bKash. Recommend encouraging digital payments to reduce payout delays.",
  "Commission optimization opportunity: Your current 15% rate is below platform average. Consider loyalty promotions to increase volume.",
  "Average order value increased by 14% this week compared to last week. Menu pricing strategy is effective.",
];

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (process.env.NODE_ENV === "development" && !decoded) {
    return NextResponse.json({
      totalEarnings: 245000,
      availableBalance: mockBalance,
      pendingBalance: 12000,
      platformCommission: 15,
      monthlyGrowth: 12.5,
      transactions: demoTransactions,
      earningsTrend: demoEarningsTrend,
      aiInsights: AI_INSIGHTS,
    } as PaymentsOverview);
  }

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    totalEarnings: 245000,
    availableBalance: mockBalance,
    pendingBalance: 12000,
    platformCommission: 15,
    monthlyGrowth: 12.5,
    transactions: demoTransactions,
    earningsTrend: demoEarningsTrend,
    aiInsights: AI_INSIGHTS,
  } as PaymentsOverview);
}

export async function PATCH(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (process.env.NODE_ENV === "development" && !decoded) {
    const body = await req.json();
    const { delta } = body;

    mockBalance = Math.round(mockBalance + (delta || 0));
    if (mockBalance < 0) mockBalance = 0;

    const txNum = demoTransactions.length + 1;
    const newTx = {
      id: `TXN-98${234 + txNum}-LIVE`,
      orderId: `#ORD-${5520 + txNum}`,
      customerName: "Live Customer",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      grossAmount: getRandomInt(500, 1500),
      commission: 0,
      netEarnings: 0,
      status: "Paid" as PaymentStatus,
    };
    newTx.commission = Math.round(newTx.grossAmount * 0.15);
    newTx.netEarnings = newTx.grossAmount - newTx.commission;
    demoTransactions.unshift(newTx);

    return NextResponse.json({
      success: true,
      availableBalance: mockBalance,
      newTransaction: newTx,
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
  const { delta } = body;

  mockBalance = Math.round(mockBalance + (delta || 0));
  if (mockBalance < 0) mockBalance = 0;

  const txNum = demoTransactions.length + 1;
  const newTx = {
    id: `TXN-98${234 + txNum}-LIVE`,
    orderId: `#ORD-${5520 + txNum}`,
    customerName: "Live Customer",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    grossAmount: getRandomInt(500, 1500),
    commission: 0,
    netEarnings: 0,
    status: "Paid" as PaymentStatus,
  };
  newTx.commission = Math.round(newTx.grossAmount * 0.15);
  newTx.netEarnings = newTx.grossAmount - newTx.commission;
  demoTransactions.unshift(newTx);

  return NextResponse.json({
    success: true,
    availableBalance: mockBalance,
    newTransaction: newTx,
  });
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
