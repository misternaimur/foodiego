import { NextResponse } from "next/server";
import type { Types } from "mongoose";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import Restaurant from "@/models/Restaurant";
import { OrderBooking } from "@/models/OrderBooking";
import { Review } from "@/models/Review";
import { MenuItem } from "@/models/MenuItem";
import { isStorableImageUrl } from "@/lib/imageUrl";

export interface OperatingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface RestaurantProfile {
  id: string;
  name: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  coverImage: string;
  logoUrl: string;
  address: string;
  latitude: number;
  longitude: number;
  minOrderValue: number;
  deliveryFee: number;
  packagingFeeEnabled: boolean;
  packagingFee: number;
  storeStatus: "open" | "closed";
  operatingHours: OperatingHours[];
  tradeLicenseUrl: string | null;
  ownerNidUrl: string | null;
  ownerName: string;
  cuisineType: string;
  description: string;
  status: string;
  openingTime: string;
  closingTime: string;
  /** Real figures for the profile page's stat cards; only sent by GET. */
  stats?: RestaurantStats;
}

export interface RestaurantStats {
  totalOrders: number;
  deliveredOrders: number;
  ordersThisMonth: number;
  /** % change in orders this calendar month vs last month; null when last month had none. */
  monthlyGrowth: number | null;
  avgRating: number;
  reviewCount: number;
  activeMenuItems: number;
  totalMenuItems: number;
}

export const DEFAULT_OPERATING_HOURS: OperatingHours[] = [
  { day: "Monday", isOpen: true, openTime: "10:00", closeTime: "22:00" },
  { day: "Tuesday", isOpen: true, openTime: "10:00", closeTime: "22:00" },
  { day: "Wednesday", isOpen: true, openTime: "10:00", closeTime: "22:00" },
  { day: "Thursday", isOpen: true, openTime: "10:00", closeTime: "22:00" },
  { day: "Friday", isOpen: true, openTime: "10:00", closeTime: "23:00" },
  { day: "Saturday", isOpen: true, openTime: "10:00", closeTime: "23:00" },
  { day: "Sunday", isOpen: false, openTime: "10:00", closeTime: "22:00" },
];

export const demoProfile: RestaurantProfile = {
  id: "rest_001",
  name: "FoodieGo Restaurant",
  tagline: "Authentic flavors, delivered fast",
  phone: "+880 1XXXXXXXXX",
  email: "restaurant@foodiego.com",
  website: "www.foodiego.com",
  coverImage: "https://images.unsplash.com/photo-1414235027342-9e0e5e2b1b5a?w=1200&h=400&fit=crop",
  logoUrl: "https://images.unsplash.com/photo-1514992175981-7c3d6e3a85b3?w=200&h=200&fit=crop&crop=circle",
  address: "123, Main Road, Dhaka 1000, Bangladesh",
  latitude: 23.7937,
  longitude: 90.4066,
  minOrderValue: 150,
  deliveryFee: 50,
  packagingFeeEnabled: true,
  packagingFee: 15,
  storeStatus: "open",
  operatingHours: DEFAULT_OPERATING_HOURS,
  tradeLicenseUrl: null,
  ownerNidUrl: null,
  ownerName: "",
  cuisineType: "",
  description: "",
  status: "approved",
  openingTime: "",
  closingTime: "",
};

function mapRestaurantToProfile(restaurant: Record<string, unknown>): RestaurantProfile {
  const operatingHours: OperatingHours[] =
    (restaurant.operatingHours as OperatingHours[] | undefined) || DEFAULT_OPERATING_HOURS;

  return {
    id: restaurant._id?.toString() || "",
    name: (restaurant.restaurantName as string) || "",
    tagline: (restaurant.tagline as string) || "",
    phone: (restaurant.phone as string) || "",
    email: (restaurant.email as string) || "",
    website: (restaurant.website as string) || "",
    // UPDATE (real-profile fix): no stock-photo fallback any more - an empty
    // string lets the profile page show an "upload" placeholder instead of
    // someone else's restaurant. `coverImageUrl` is the field name the
    // foodiego-backend seed script uses for the same thing.
    coverImage: (restaurant.coverImage as string) || (restaurant.coverImageUrl as string) || "",
    logoUrl: (restaurant.logoUrl as string) || "",
    address: (restaurant.address as string) || "",
    latitude: (restaurant.latitude as number) || demoProfile.latitude,
    longitude: (restaurant.longitude as number) || demoProfile.longitude,
    minOrderValue: (restaurant.minOrderValue as number) || 0,
    deliveryFee: (restaurant.deliveryFee as number) || 0,
    packagingFeeEnabled: (restaurant.packagingFeeEnabled as boolean) ?? false,
    packagingFee: (restaurant.packagingFee as number) || 0,
    storeStatus:
      (restaurant.storeStatus as "open" | "closed") ||
      (restaurant.isOpen ? "open" : "closed"),
    operatingHours,
    tradeLicenseUrl: (restaurant.tradeLicenseUrl as string) || null,
    ownerNidUrl: (restaurant.ownerNidUrl as string) || null,
    ownerName: (restaurant.ownerName as string) || "",
    cuisineType: (restaurant.cuisineType as string) || "",
    description: (restaurant.description as string) || "",
    status: (restaurant.status as string) || "pending",
    openingTime: (restaurant.openingTime as string) || "",
    closingTime: (restaurant.closingTime as string) || "",
  };
}

async function computeStats(restaurantId: Types.ObjectId): Promise<RestaurantStats> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const notCancelled = { restaurantId, status: { $ne: "cancelled" as const } };
  const menuFilter = { $or: [{ vendorId: restaurantId }, { restaurantId }] };

  const [totalOrders, deliveredOrders, ordersThisMonth, ordersLastMonth, ratingAgg, totalMenuItems, activeMenuItems] =
    await Promise.all([
      OrderBooking.countDocuments(notCancelled),
      OrderBooking.countDocuments({ restaurantId, status: "delivered" }),
      OrderBooking.countDocuments({ ...notCancelled, createdAt: { $gte: monthStart } }),
      OrderBooking.countDocuments({ ...notCancelled, createdAt: { $gte: lastMonthStart, $lt: monthStart } }),
      Review.aggregate<{ avg: number; count: number }>([
        { $match: { merchantId: restaurantId } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]),
      MenuItem.countDocuments(menuFilter),
      MenuItem.countDocuments({ ...menuFilter, isActive: { $ne: false } }),
    ]);

  return {
    totalOrders,
    deliveredOrders,
    ordersThisMonth,
    monthlyGrowth:
      ordersLastMonth > 0 ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 1000) / 10 : null,
    avgRating: ratingAgg[0] ? Math.round(ratingAgg[0].avg * 10) / 10 : 0,
    reviewCount: ratingAgg[0]?.count ?? 0,
    activeMenuItems,
    totalMenuItems,
  };
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (process.env.NODE_ENV === "development" && !decoded) {
    return NextResponse.json(demoProfile as RestaurantProfile);
  }

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const restaurant = await Restaurant.findOne({ userId: user._id }).lean();

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant profile not found" }, { status: 404 });
  }

  const stats = await computeStats(restaurant._id);
  return NextResponse.json({
    ...mapRestaurantToProfile(restaurant as unknown as Record<string, unknown>),
    stats,
  } satisfies RestaurantProfile);
}

export async function PATCH(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (process.env.NODE_ENV === "development" && !decoded) {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      profile: { ...demoProfile, ...body },
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

  const body = await req.json();

  for (const field of ["coverImage", "logoUrl"] as const) {
    if (body[field] !== undefined && !isStorableImageUrl(body[field])) {
      return NextResponse.json({ error: `${field} must be an uploaded image URL` }, { status: 400 });
    }
  }
  if (body.name !== undefined && !String(body.name).trim()) {
    return NextResponse.json({ error: "Restaurant name can't be empty" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {
    restaurantName: body.name,
    ownerName: body.ownerName,
    cuisineType: body.cuisineType,
    description: body.description,
    openingTime: body.openingTime,
    closingTime: body.closingTime,
    tagline: body.tagline,
    phone: body.phone,
    email: body.email,
    website: body.website,
    coverImage: body.coverImage,
    logoUrl: body.logoUrl,
    address: body.address,
    latitude: body.latitude,
    longitude: body.longitude,
    minOrderValue: body.minOrderValue,
    deliveryFee: body.deliveryFee,
    packagingFeeEnabled: body.packagingFeeEnabled,
    packagingFee: body.packagingFee,
    storeStatus: body.storeStatus,
    isOpen: body.storeStatus === "open",
    operatingHours: body.operatingHours,
    tradeLicenseUrl: body.tradeLicenseUrl,
    ownerNidUrl: body.ownerNidUrl,
  };

  // Filter out undefined values to avoid overwriting with undefined
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const existing = await Restaurant.findOne({ userId: user._id });

  let restaurant;
  if (existing) {
    restaurant = await Restaurant.findByIdAndUpdate(existing._id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
  } else {
    restaurant = await Restaurant.create({
      userId: user._id,
      restaurantName: body.name,
      ownerName: user.name,
      email: body.email || user.email,
      address: body.address,
      ...updateData,
    });
    restaurant = restaurant.toObject();
  }

  if (!restaurant) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    profile: mapRestaurantToProfile(restaurant as unknown as Record<string, unknown>),
  });
}
