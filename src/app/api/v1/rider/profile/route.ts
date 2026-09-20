import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { getOrCreateRiderProfile } from "@/lib/profile";
import { dbConnect } from "@/lib/dbConnect";
import { Rider } from "@/models/Rider";

// UPDATE (rider-dashboard real-data fix): /rider/settings used to be a
// static page with no save behaviour, and the dashboard's Online/Offline
// toggle only ever changed local component state — refreshing the page (or
// opening the dashboard on another device) silently reset it. Both now
// read/write the real Rider document through this route.

export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "rider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const rider = await getOrCreateRiderProfile(session);
  if (!rider) {
    return NextResponse.json({ error: "Rider profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    fullName: rider.fullName,
    email: rider.email,
    phone: rider.phone,
    address: rider.address,
    city: rider.city,
    vehicleType: rider.vehicleType,
    vehicleNumber: rider.vehicleNumber || "",
    licenseNumber: rider.licenseNumber,
    isAvailable: rider.isAvailable,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getOptionalSession();
  if (!session || session.role !== "rider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<{
    fullName: string;
    phone: string;
    address: string;
    city: string;
    vehicleNumber: string;
    isAvailable: boolean;
  }>;

  await dbConnect();
  const rider = await getOrCreateRiderProfile(session);
  if (!rider) {
    return NextResponse.json({ error: "Rider profile not found" }, { status: 404 });
  }

  const update: Record<string, unknown> = {};
  if (body.fullName !== undefined) update.fullName = body.fullName;
  if (body.phone !== undefined) update.phone = body.phone;
  if (body.address !== undefined) update.address = body.address;
  if (body.city !== undefined) update.city = body.city;
  if (body.vehicleNumber !== undefined) update.vehicleNumber = body.vehicleNumber;
  if (body.isAvailable !== undefined) update.isAvailable = body.isAvailable;

  const updated = await Rider.findByIdAndUpdate(rider._id, update, { new: true }).lean();

  return NextResponse.json({
    success: true,
    isAvailable: updated?.isAvailable ?? rider.isAvailable,
  });
}
