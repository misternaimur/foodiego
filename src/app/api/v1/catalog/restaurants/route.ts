import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import { MenuItem, restaurantIdOf } from "@/models/MenuItem";
import { Category } from "@/models/Category";

// ============================================================
// PUBLIC CATALOG: real restaurants + their real menu, grouped by category.
// ------------------------------------------------------------
// UPDATE (real food-catalog fix): before this route existed, every
// customer-facing page (home page's "Picked for you", /restaurants,
// /restaurants/[slug]) read static demo JSON from public/api/*.json —
// fake restaurants, fake menu items, completely disconnected from what a
// vendor actually creates or from foodiego-backend's seeded demo catalog
// (collection "menuItem", ~336 real items across ~18 real restaurants —
// see src/models/MenuItem.ts for why that collection is now the single
// source of truth). Ordering one of those fake items produced an order
// with no real, reliable restaurant/menu-item link.
//
// This route returns real, approved restaurants with their real menu
// grouped into `menuCategories`, in the exact shape
// src/context/AppContext.tsx's existing restaurant-mapping code already
// expects (see its `RawRestaurant`/`Restaurant` mapping) — so no page that
// consumes `useApp().restaurants` needed to change at all, only the fetch
// URL in AppContext.tsx did.
// ============================================================

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// UPDATE (menu-category real-data fix): foodiego-backend's own seeded menu
// items (the ~336-item real catalog — see MenuItem.ts's header comment)
// store `category` as an ObjectId reference into a separate "category"
// collection, not a plain string. Only items created through this app's
// own vendor menu form (src/app/api/v1/vendor/menu/create) write a plain
// string. This crashed with "name.toLowerCase is not a function" the
// first time this route ran against real seeded restaurants (rather than
// the plain-string test items used earlier while building this route),
// since it tried to slugify the raw ObjectId as if it were already a name.
function categoryNameOf(rawCategory: unknown, categoryNameById: Map<string, string>): string {
  if (typeof rawCategory === "string" && rawCategory.trim()) {
    const resolved = categoryNameById.get(rawCategory);
    return resolved || rawCategory;
  }
  if (rawCategory instanceof mongoose.Types.ObjectId) {
    return categoryNameById.get(rawCategory.toString()) || "Menu";
  }
  return "Menu";
}

export async function GET() {
  try {
    await dbConnect();

    const [restaurants, menuItems, categories] = await Promise.all([
      Restaurant.find({ status: "approved" }).lean(),
      // isActive defaults to true for older seeded docs that never set it —
      // only exclude items explicitly marked unavailable/inactive.
      MenuItem.find({ isActive: { $ne: false }, isAvailable: { $ne: false } }).lean(),
      Category.find().lean(),
    ]);

  const categoryNameById = new Map(categories.map((c) => [String(c._id), c.name]));

  const itemsByRestaurant = new Map<string, typeof menuItems>();
  for (const item of menuItems) {
    const restaurantId = restaurantIdOf(item);
    if (!restaurantId) continue;
    const key = String(restaurantId);
    const bucket = itemsByRestaurant.get(key);
    if (bucket) bucket.push(item);
    else itemsByRestaurant.set(key, [item]);
  }

  const data = restaurants.map((r) => {
    const restaurantId = String(r._id);
    const items = itemsByRestaurant.get(restaurantId) || [];

    // Group the flat menu-item list into { name, items } categories, in
    // first-seen order, matching the shape the restaurant detail page
    // (src/app/(public)/restaurants/[slug]/page.tsx) already renders.
    const categoryOrder: string[] = [];
    const categoryItems = new Map<string, typeof items>();
    for (const item of items) {
      const categoryName = categoryNameOf(item.category, categoryNameById);
      if (!categoryItems.has(categoryName)) {
        categoryOrder.push(categoryName);
        categoryItems.set(categoryName, []);
      }
      categoryItems.get(categoryName)!.push(item);
    }

    const menuCategories = categoryOrder.map((name) => ({
      id: slugify(name),
      name,
      items: categoryItems.get(name)!.map((item) => ({
        id: String(item._id),
        name: item.name,
        description: item.description || "",
        price: item.price,
        image: item.image || "",
        isAvailable: item.isActive ?? true,
      })),
    }));

    return {
      _id: restaurantId,
      userId: r.userId ? String(r.userId) : undefined,
      restaurantName: r.restaurantName,
      slug: slugify(r.restaurantName),
      ownerName: r.ownerName,
      email: r.email,
      phone: r.phone,
      address: r.address,
      description: r.description,
      logoUrl: r.logoUrl,
      imageUrl: r.coverImage || r.logoUrl,
      cuisineType: r.cuisineType,
      cuisines: r.cuisineType ? [r.cuisineType] : [],
      openingTime: r.openingTime,
      closingTime: r.closingTime,
      isOpen: r.storeStatus ? r.storeStatus === "open" : r.isOpen,
      status: r.status,
      rating: r.rating || 0,
      deliveryFee: r.deliveryFee || 0,
      minOrder: r.minOrderValue || 0,
      menuCategories,
    };
  });

  return NextResponse.json({ data });
  } catch (err) {
    console.error("Failed to fetch catalog restaurants:", err);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 },
    );
  }
}
