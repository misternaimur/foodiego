import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRole } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Rider } from "@/models/Rider";

// UPDATE (admin-export fix): same fix as /api/admin/export/vendors — the
// "Export List" button on /admin/riders used to do nothing.
function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export async function GET(req: NextRequest) {
  await verifyRole("admin");
  await dbConnect();

  const status = req.nextUrl.searchParams.get("status");
  const q = req.nextUrl.searchParams.get("q");

  const query: Record<string, unknown> = {};
  if (status && status !== "all") query.status = status;
  if (q) {
    query.$or = [
      { fullName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
      { city: { $regex: q, $options: "i" } },
    ];
  }

  const riders = await Rider.find(query).sort({ createdAt: -1 }).lean();

  const header = ["Full Name", "Email", "Phone", "City", "Vehicle Type", "Status", "Rating", "Created At"];
  const rows = riders.map((r) => [
    r.fullName,
    r.email,
    r.phone,
    r.city,
    r.vehicleType,
    r.status,
    r.rating,
    r.createdAt.toISOString(),
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="riders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
