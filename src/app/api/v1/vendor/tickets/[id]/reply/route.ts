import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Ticket } from "@/models/Ticket";

export async function POST(
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
  const body = await req.json();
  const { text } = body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    return NextResponse.json(
      { error: "Message text is required" },
      { status: 400 }
    );
  }

  const ticket = await Ticket.findOne({ ticketId: id, vendorId: user._id });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  ticket.messages.push({
    sender: "merchant",
    text: text.trim(),
    timestamp: new Date(),
  });

  if (ticket.status === "resolved") {
    ticket.status = "open";
  }
  if (ticket.status === "open") {
    ticket.status = "in_progress";
  }

  await ticket.save();

  return NextResponse.json({ success: true, ticketId: ticket.ticketId });
}