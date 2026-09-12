import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Ticket } from "@/models/Ticket";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const ticket = await Ticket.findOne({ ticketId: id, vendorId: user._id }).lean();
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json({
    ticketId: ticket.ticketId,
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    messages: ticket.messages || [],
  });
}