import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRole } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Restaurant, type RestaurantStatus } from "@/models/Restaurant";

// UPDATE (admin-export fix): the "Export List" button on /admin/vendors
// used to do nothing at all. This route re-runs the same status/search
// filter the page itself uses (see src/app/(main)/admin/(user)/vendors/page.tsx)
// against the FULL matching set (no pagination limit) and streams it back
// as a real CSV download.
function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export async function GET(req: NextRequest) {
  await verifyRole("admin");
  await dbConnect();

  const status = req.nextUrl.searchParams.get("status") as RestaurantStatus | "suspended" | null;
  const q = req.nextUrl.searchParams.get("q");

  const query: Record<string, unknown> = {};
  if (status && status !== ("all" as never)) query.status = status;
  if (q) {
    query.$or = [
      { restaurantName: { $regex: q, $options: "i" } },
      { ownerName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { cuisineType: { $regex: q, $options: "i" } },
    ];
  }

  const restaurants = await Restaurant.find(query).sort({ createdAt: -1 }).lean();

  const header = ["Restaurant Name", "Owner", "Email", "Phone", "Status", "Rating", "Created At"];
  const rows = restaurants.map((r) => [
    r.restaurantName,
    r.ownerName,
    r.email,
    r.phone || "",
    r.status,
    r.rating,
    r.createdAt.toISOString(),
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vendors-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
