import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { dbConnect } from "@/lib/dbConnect";
import { Rider } from "@/models/Rider";

export interface RiderLocationEntry {
  _id: string;
  fullName: string;
  vehicleType: string;
  isAvailable: boolean;
  lat: number;
  lng: number;
  updatedAt: string;
}

// UPDATE (admin-rider-map fix): Rider.currentLat/currentLng (pushed every
// 20s by an online rider — see src/app/api/v1/rider/location/route.ts) was
// already proven to work for the vendor's own dispatch map
// (src/app/api/v1/vendor/deliveries/active/route.ts) but admin had no
// screen that ever read it — zero visibility into where the fleet actually
// is. This is the same real data, admin-scoped.
export async function GET() {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const riders = await Rider.find({
    status: "approved",
    currentLat: { $ne: null },
    currentLng: { $ne: null },
  })
    .select("fullName vehicleType isAvailable currentLat currentLng locationUpdatedAt")
    .lean();

  const payload: RiderLocationEntry[] = riders.map((r) => ({
    _id: String(r._id),
    fullName: r.fullName,
    vehicleType: r.vehicleType,
    isAvailable: r.isAvailable,
    lat: r.currentLat as number,
    lng: r.currentLng as number,
    updatedAt: r.locationUpdatedAt ? new Date(r.locationUpdatedAt).toISOString() : "",
  }));

  return NextResponse.json({ riders: payload });
}
