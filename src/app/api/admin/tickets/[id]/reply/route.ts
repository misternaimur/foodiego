import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Ticket } from "@/models/Ticket";

// UPDATE (admin-support fix): backs the admin support inbox's reply box.
// Mirrors src/app/api/v1/vendor/tickets/[id]/reply/route.ts but posts as
// "agent" (the admin side of the same real Ticket thread the vendor
// already sees on their own /vendor/support page).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  const body = (await req.json()) as { text?: string; resolve?: boolean };

  const ticket = await Ticket.findOne({ ticketId: id });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (body.text?.trim()) {
    ticket.messages.push({ sender: "agent", text: body.text.trim(), timestamp: new Date() });
    if (ticket.status !== "resolved") ticket.status = "in_progress";
  }

  if (body.resolve) {
    ticket.status = "resolved";
  }

  await ticket.save();

  return NextResponse.json({ success: true, status: ticket.status });
}
