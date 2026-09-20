import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { MenuItem } from "@/models/MenuItem";
import { Types } from "mongoose";

// ============================================================
// UPDATE (menu-edit fix): the vendor Menu Management page had a "toggle
// availability" action (.../[id]/toggle) and a "create" action, but
// NOTHING to actually edit an existing item's name/price/category/
// description/image/add-ons — there was no edit button in the UI, and no
// backend route to save a change even if there had been. Editing an item
// silently did nothing because the feature didn't exist yet. This route
// is the missing piece; see useUpdateMenuItem() in useVendorMenu.ts and
// the "edit" mode added to AddMenuItemModal.tsx for the frontend side.
// ============================================================

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // UPDATE (menu-visibility fix): items are linked by Restaurant._id, not
  // User._id — see the matching comment in vendor/menu/create/route.ts.
  const restaurant = await Restaurant.findOne({ userId: user._id }).lean();
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant profile not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, category, price, description, image, addons } = body;

  if (!name || !category || typeof price !== "number") {
    return NextResponse.json(
      { error: "Name, category, and price are required" },
      { status: 400 }
    );
  }

  // Scoped to this vendor's own items — findOneAndUpdate with vendorId in
  // the filter means one vendor can never edit another vendor's item even
  // by guessing its id.
  const updated = await MenuItem.findOneAndUpdate(
    { _id: id, vendorId: restaurant._id },
    {
      name,
      category,
      price,
      description: description || "",
      image: image ?? "",
      addons: addons || [],
    },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, item: updated });
}
