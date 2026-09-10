import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Ticket } from "@/models/Ticket";

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

  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const filter: Record<string, unknown> = { vendorId: user._id };
  if (status) {
    filter.status = status;
  }
  if (search) {
    filter.$or = [
      { ticketId: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  const tickets = await Ticket.find(filter)
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json(tickets);
}