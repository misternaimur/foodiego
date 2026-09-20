import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Ticket } from "@/models/Ticket";
import { Restaurant } from "@/models/Restaurant";
import { User } from "@/models/User";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;

  const ticket = await Ticket.findOne({ ticketId: id }).lean();
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const isCustomer = ticket.raisedByRole === "customer";
  const ownerId = ticket.vendorId || ticket.raisedById;

  const [restaurant, user] = await Promise.all([
    isCustomer ? null : Restaurant.findOne({ userId: ownerId }).select("restaurantName").lean(),
    User.findById(ownerId).select("name email").lean(),
  ]);

  return NextResponse.json({
    ticketId: ticket.ticketId,
    userType: isCustomer ? "Customer" : "Vendor",
    name: restaurant?.restaurantName || user?.name || (isCustomer ? "Unknown customer" : "Unknown vendor"),
    email: user?.email,
    orderId: ticket.orderId ? String(ticket.orderId) : undefined,
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    messages: ticket.messages || [],
  });
}
