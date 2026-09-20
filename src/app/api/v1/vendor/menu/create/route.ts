import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
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

  const body = await req.json();
  const { name, category, price, description, image, addons } = body;

  if (!name || !category || typeof price !== "number") {
    return NextResponse.json(
      { error: "Name, category, and price are required" },
      { status: 400 }
    );
  }

  const item = await MenuItem.create({
    vendorId: user._id,
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
