import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import Restaurant from "@/models/Restaurant";

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
    coverImage: (restaurant.coverImage as string) || demoProfile.coverImage,
    logoUrl: (restaurant.logoUrl as string) || demoProfile.logoUrl,
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
    return NextResponse.json(demoProfile as RestaurantProfile);
  }

  return NextResponse.json(mapRestaurantToProfile(restaurant as unknown as Record<string, unknown>));
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

  const updateData: Record<string, unknown> = {
    restaurantName: body.name,
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
