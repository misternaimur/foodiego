import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Ticket } from "@/models/Ticket";
import { Restaurant } from "@/models/Restaurant";
import { User } from "@/models/User";

// ============================================================
// UPDATE (admin-support fix, extended by the customer-complaint fix):
// /admin/support used to render a fixed 4-row array of fake tickets. A real
// Ticket model and vendor-facing ticket routes already existed — vendors
// could already file and message on real tickets, but nothing on the admin
// side ever read them, and "userType" was hardcoded to "Vendor" since
// nothing else could file a ticket. Customers can now file one too (see
// src/app/api/v1/client/tickets/**), so userType is derived from each
// ticket's real `raisedByRole` (older tickets that predate that field
// default to "vendor", matching what they always were).
// ============================================================

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const tickets = await Ticket.find().sort({ updatedAt: -1 }).lean();
  const vendorTicketVendorIds = tickets.filter((t) => (t.raisedByRole || "vendor") === "vendor").map((t) => t.vendorId || t.raisedById);
  const customerIds = tickets.filter((t) => t.raisedByRole === "customer").map((t) => t.raisedById);

  const [restaurants, vendorUsers, customerUsers] = await Promise.all([
    Restaurant.find({ userId: { $in: vendorTicketVendorIds } }).select("userId restaurantName").lean(),
    User.find({ _id: { $in: vendorTicketVendorIds } }).select("name").lean(),
    User.find({ _id: { $in: customerIds } }).select("name").lean(),
  ]);
  const restaurantByUserId = new Map(restaurants.map((r) => [String(r.userId), r.restaurantName]));
  const vendorNameById = new Map(vendorUsers.map((u) => [String(u._id), u.name]));
  const customerNameById = new Map(customerUsers.map((u) => [String(u._id), u.name]));

  const payload = tickets.map((t) => {
    const raisedByRole = t.raisedByRole || "vendor";
    const isCustomer = raisedByRole === "customer";
    const ownerId = String(t.vendorId || t.raisedById);
    return {
      ticketId: t.ticketId,
      userType: (isCustomer ? "Customer" : "Vendor") as "Customer" | "Vendor",
      name: isCustomer
        ? customerNameById.get(ownerId) || "Unknown customer"
        : restaurantByUserId.get(ownerId) || vendorNameById.get(ownerId) || "Unknown vendor",
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  });

  return NextResponse.json({ tickets: payload });
}
