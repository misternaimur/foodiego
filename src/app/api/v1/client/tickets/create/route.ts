import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Ticket, TICKET_CATEGORIES, TicketMessage, generateTicketId } from "@/models/Ticket";
import { Types } from "mongoose";

// UPDATE (customer-complaint fix): the missing piece the audit flagged —
// previously a customer could only leave a normal star review, with no way
// to file a distinct complaint/dispute about a specific order. Mirrors the
// vendor ticket-creation route (src/app/api/v1/vendor/tickets/create/route.ts)
// with raisedByRole "customer" and an optional orderId reference.
export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { subject, category, message, orderId } = body;

  if (!subject || !message) {
    return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  }

  const safeCategory = category && TICKET_CATEGORIES.includes(category) ? category : "Order Issue";

  const initialMessage: TicketMessage = {
    sender: "customer",
    text: message,
    timestamp: new Date(),
  };

  const ticket = await Ticket.create({
    ticketId: generateTicketId(),
    raisedByRole: "customer",
    raisedById: user._id,
    orderId: orderId && Types.ObjectId.isValid(orderId) ? orderId : undefined,
    subject,
    category: safeCategory,
    priority: "medium",
    status: "open",
    messages: [initialMessage],
  });

  return NextResponse.json(ticket, { status: 201 });
}
