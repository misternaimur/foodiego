import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Ticket } from "@/models/Ticket";
import { Restaurant } from "@/models/Restaurant";
import { User } from "@/models/User";

// ============================================================
// UPDATE (admin-support fix): /admin/support used to render a fixed
// 4-row array of fake tickets with a "structured state ready to be
// replaced with backend API calls" comment. A real Ticket model and
// vendor-facing ticket routes already existed (src/models/Ticket.ts,
// src/app/api/v1/vendor/tickets/*) — vendors could already file and
// message on real tickets, but nothing on the admin side ever read them.
// This route lists every real ticket for the admin inbox. Every ticket
// today comes from a restaurant (there's no rider/customer ticket-filing
// UI anywhere in this codebase), so "userType" is always "Vendor" for
// real data — the customer/rider filter options on the page still work,
// they just won't match anything until that intake exists.
// ============================================================

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const tickets = await Ticket.find().sort({ updatedAt: -1 }).lean();
  const vendorIds = tickets.map((t) => t.vendorId);

  const [restaurants, users] = await Promise.all([
    Restaurant.find({ userId: { $in: vendorIds } }).select("userId restaurantName").lean(),
    User.find({ _id: { $in: vendorIds } }).select("name").lean(),
  ]);
  const restaurantByUserId = new Map(restaurants.map((r) => [String(r.userId), r.restaurantName]));
  const userNameById = new Map(users.map((u) => [String(u._id), u.name]));

  const payload = tickets.map((t) => ({
    ticketId: t.ticketId,
    userType: "Vendor" as const,
    name: restaurantByUserId.get(String(t.vendorId)) || userNameById.get(String(t.vendorId)) || "Unknown vendor",
    subject: t.subject,
    category: t.category,
    priority: t.priority,
    status: t.status,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));

  return NextResponse.json({ tickets: payload });
}
