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

  const [restaurant, user] = await Promise.all([
    Restaurant.findOne({ userId: ticket.vendorId }).select("restaurantName").lean(),
    User.findById(ticket.vendorId).select("name email").lean(),
  ]);

  return NextResponse.json({
    ticketId: ticket.ticketId,
    name: restaurant?.restaurantName || user?.name || "Unknown vendor",
    email: user?.email,
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    messages: ticket.messages || [],
  });
}
