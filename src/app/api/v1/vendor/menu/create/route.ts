import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { MenuItem } from "@/models/MenuItem";

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (process.env.NODE_ENV === "development" && !decoded) {
    const body = await req.json();
    const { name, category, price, description, image, addons } = body;

    if (!name || !category || typeof price !== "number") {
      return NextResponse.json(
        { error: "Name, category, and price are required" },
        { status: 400 }
      );
    }

    const newItem = {
      _id: `temp-${Date.now()}`,
      vendorId: "rest_001",
      name,
      category,
      price,
      description: description || "",
      image: image || "",
      addons: addons || [],
      isActive: true,
      ordersCount: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  }

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // UPDATE (menu-visibility fix): menu items must be linked by the
  // Restaurant document's own _id, not the User document's _id — the
  // public catalog route (src/app/api/v1/catalog/restaurants/route.ts)
  // groups menu items by Restaurant._id, matching how foodiego-backend's
  // seeded catalog links items via `restaurantId`. Writing `user._id` here
  // instead silently orphaned every vendor-created item from ever showing
  // to customers, even though it saved to the DB and appeared in the
  // vendor's own dashboard (which filtered by the same, self-consistent
  // but wrong, id).
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

  const item = await MenuItem.create({
    vendorId: restaurant._id,
    name,
    category,
    price,
    description: description || "",
    image: image || "",
    addons: addons || [],
    isActive: true,
    ordersCount: 0,
    rating: 0,
  });

  return NextResponse.json({ success: true, item }, { status: 201 });
}
