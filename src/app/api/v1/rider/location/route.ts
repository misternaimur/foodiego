import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { getOrCreateRiderProfile } from "@/lib/profile";
import { dbConnect } from "@/lib/dbConnect";
import { Rider } from "@/models/Rider";

// ============================================================
// UPDATE (rider-GPS fix): new endpoint. The rider's dashboard now pushes
// its browser's real Geolocation coordinates here every ~20s while the
// rider is online (see the useEffect in RiderDashboard.tsx). This is the
// one real location source this codebase has — it replaces the fabricated
// lat/lng the vendor's live delivery map used to plot (see
// src/app/api/v1/vendor/deliveries/active/route.ts).
// ============================================================

export async function POST(req: NextRequest) {
  const session = await getOptionalSession();
  if (!session || session.role !== "rider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { lat?: number; lng?: number };
  if (typeof body.lat !== "number" || typeof body.lng !== "number") {
    return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
  }

  await dbConnect();
  const rider = await getOrCreateRiderProfile(session);
  if (!rider) {
    return NextResponse.json({ error: "Rider profile not found" }, { status: 404 });
  }

  await Rider.findByIdAndUpdate(rider._id, {
    currentLat: body.lat,
    currentLng: body.lng,
    locationUpdatedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
