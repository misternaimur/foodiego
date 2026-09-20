import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { MenuItem } from "@/models/MenuItem";
import { Types } from "mongoose";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  const { id } = await params;

  if (!Types.ObjectId.isValid(id) && !id.startsWith("temp-")) {
    return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "development" && !decoded) {
    return NextResponse.json({
      success: true,
      item: { _id: id, isActive: false },
    });
  }

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  }

  // UPDATE (menu-visibility fix): items are linked by Restaurant._id, not
  // User._id — see the matching comment in vendor/menu/create/route.ts.
  const restaurant = await Restaurant.findOne({ userId: user._id }).lean();
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant profile not found" }, { status: 404 });
  }

  const item = await MenuItem.findOne({ _id: id, vendorId: restaurant._id });
  if (!item) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
  }

  item.isActive = !item.isActive;
  await item.save();

  const updated = await MenuItem.findById(id).lean();
  return NextResponse.json(updated);
}
