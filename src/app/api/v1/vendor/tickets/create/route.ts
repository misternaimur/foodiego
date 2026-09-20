import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Ticket, TICKET_CATEGORIES, TICKET_PRIORITIES, TicketMessage, generateTicketId } from "@/models/Ticket";

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

  const body = await req.json();
  const { subject, category, message } = body;

  if (!subject || !message) {
    return NextResponse.json(
      { error: "Subject and message are required" },
      { status: 400 }
    );
  }

  const safeCategory = category && TICKET_CATEGORIES.includes(category) ? category : "General";
  const priority = TICKET_PRIORITIES.includes("high") ? "high" : "medium";

  const initialMessage: TicketMessage = {
    sender: "merchant",
    text: message,
    timestamp: new Date(),
  };

  const ticket = await Ticket.create({
    ticketId: generateTicketId(),
    vendorId: user._id,
    subject,
    category: safeCategory,
    priority,
    status: "open",
    messages: [initialMessage],
  });

  return NextResponse.json(ticket, { status: 201 });
}