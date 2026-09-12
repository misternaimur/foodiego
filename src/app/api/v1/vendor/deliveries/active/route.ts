import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

export interface Delivery {
  id: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  assignedRider: string;
  riderId?: string;
  riderAvatar?: string;
  status: "Picked Up" | "Assigning" | "Delayed" | "In Transit" | "Delivered";
  eta: string;
  total: number;
  items: number;
  delayReason?: string;
  lat: number;
  lng: number;
  riderLat?: number;
  riderLng?: number;
  riderSpeed?: number;
}

export interface Rider {
  id: string;
  name: string;
  status: "Available" | "Assigned" | "Offline";
  distance: string;
  vehicle: string;
  lat: number;
  lng: number;
}

export const demoDeliveries: Delivery[] = [
  {
    id: 842,
    orderId: "#FG10234",
    customerName: "Sarah Jenkins",
    customerPhone: "+880 1711-000000",
    address: "123 Main St, Apt 4B",
    assignedRider: "Mike K.",
    riderId: "rider_002",
    status: "Picked Up",
    eta: "14 min",
    total: 850,
    items: 2,
    lat: 23.7845,
    lng: 90.4032,
    riderLat: 23.7891,
    riderLng: 90.4089,
    riderSpeed: 22,
  },
  {
    id: 843,
    orderId: "#FG10235",
    customerName: "David Chen",
    customerPhone: "+880 1911-000000",
    address: "450 West Ave",
    assignedRider: "Anna L.",
    riderId: "rider_007",
    status: "Assigning",
    eta: "--",
    total: 420,
    items: 2,
    lat: 23.7756,
    lng: 90.4108,
  },
  {
    id: 839,
    orderId: "#FG10229",
    customerName: "Elena Rodriguez",
    customerPhone: "+880 1811-000000",
    address: "77 Park Blvd",
    assignedRider: "James P.",
    riderId: "rider_006",
    status: "Delayed",
    delayReason: "Traffic",
    eta: "28 min",
    total: 620,
    items: 3,
    lat: 23.7689,
    lng: 90.3921,
    riderLat: 23.7712,
    riderLng: 90.3987,
    riderSpeed: 18,
  },
  {
    id: 841,
    orderId: "#FG10230",
    customerName: "Farzana S.",
    customerPhone: "+880 1712-000000",
    address: "House 22, Road 6, Banani, Dhaka",
    assignedRider: "Tom Smith",
    riderId: "rider_001",
    status: "In Transit",
    eta: "8 min",
    total: 730,
    items: 1,
    lat: 23.7615,
    lng: 90.4092,
    riderLat: 23.7589,
    riderLng: 90.4011,
    riderSpeed: 35,
  },
  {
    id: 838,
    orderId: "#FG10233",
    customerName: "Nahid R.",
    customerPhone: "+880 1511-000000",
    address: "Flat 3A, Sunshine Tower, Gulshan, Dhaka",
    assignedRider: "Rachel J.",
    riderId: "rider_003",
    status: "In Transit",
    eta: "5 min",
    total: 620,
    items: 2,
    lat: 23.7623,
    lng: 90.4134,
    riderLat: 23.7598,
    riderLng: 90.4156,
    riderSpeed: 28,
  },
  {
    id: 837,
    orderId: "#FG10232",
    customerName: "Sadia K.",
    customerPhone: "+880 1811-000000",
    address: "House 8, Road 11, Dhanmondi, Dhaka",
    assignedRider: "Mike K.",
    riderId: "rider_002",
    status: "Picked Up",
    eta: "12 min",
    total: 720,
    items: 1,
    lat: 23.7501,
    lng: 90.3987,
    riderLat: 23.7542,
    riderLng: 90.3951,
    riderSpeed: 25,
  },
  {
    id: 840,
    orderId: "#FG10227",
    customerName: "Arif B.",
    customerPhone: "+880 1411-000000",
    address: "House 77, Road 15, Mohammadpur, Dhaka",
    assignedRider: "Elena V.",
    riderId: "rider_004",
    status: "Delivered",
    eta: "0 min",
    total: 1050,
    items: 2,
    lat: 23.7587,
    lng: 90.3876,
  },
  {
    id: 835,
    orderId: "#FG10228",
    customerName: "Rina P.",
    customerPhone: "+880 1311-000000",
    address: "Flat 2C, Lakeview Heights, Gulshan, Dhaka",
    assignedRider: "David M.",
    riderId: "rider_005",
    status: "Picked Up",
    eta: "9 min",
    total: 1020,
    items: 2,
    lat: 23.7783,
    lng: 90.4005,
    riderLat: 23.7731,
    riderLng: 90.3967,
    riderSpeed: 20,
  },
  {
    id: 834,
    orderId: "#FG10226",
    customerName: "Tasnim M.",
    customerPhone: "+880 1211-000000",
    address: "Flat 5A, Hill View Apartments, Dhanmondi, Dhaka",
    assignedRider: "James P.",
    riderId: "rider_006",
    status: "In Transit",
    eta: "6 min",
    total: 630,
    items: 1,
    lat: 23.7562,
    lng: 90.3865,
    riderLat: 23.7534,
    riderLng: 90.3897,
    riderSpeed: 30,
  },
  {
    id: 833,
    orderId: "#FG10225",
    customerName: "Farzana S.",
    customerPhone: "+880 1712-000000",
    address: "House 22, Road 6, Banani, Dhaka",
    assignedRider: "Mike K.",
    riderId: "rider_002",
    status: "In Transit",
    eta: "4 min",
    total: 520,
    items: 2,
    lat: 23.7633,
    lng: 90.4081,
    riderLat: 23.7598,
    riderLng: 90.4052,
    riderSpeed: 32,
  },
  {
    id: 832,
    orderId: "#FG10231",
    customerName: "Tanvir M.",
    customerPhone: "+880 1611-000000",
    address: "Apt 4B, Green View Complex, Dhanmondi, Dhaka",
    assignedRider: "Tom Smith",
    riderId: "rider_001",
    status: "Delivered",
    eta: "0 min",
    total: 890,
    items: 1,
    lat: 23.7534,
    lng: 90.4015,
  },
  {
    id: 836,
    orderId: "#FG10224",
    customerName: "Kamal H.",
    customerPhone: "+880 1912-000000",
    address: "House 45, Road 12, Badda, Dhaka",
    assignedRider: "Rachel J.",
    riderId: "rider_003",
    status: "Picked Up",
    eta: "18 min",
    total: 780,
    items: 2,
    lat: 23.7801,
    lng: 90.4212,
    riderLat: 23.7765,
    riderLng: 90.4178,
    riderSpeed: 24,
  },
];

export const demoRiders: Rider[] = [
  {
    id: "rider_001",
    name: "Tom Smith",
    status: "Available",
    distance: "0.2 mi",
    vehicle: "Bike",
    lat: 23.7541,
    lng: 90.4056,
  },
  {
    id: "rider_002",
    name: "Mike K.",
    status: "Assigned",
    distance: "0.5 mi",
    vehicle: "Bike",
    lat: 23.7598,
    lng: 90.4052,
  },
  {
    id: "rider_003",
    name: "Rachel J.",
    status: "Available",
    distance: "0.3 mi",
    vehicle: "Bike",
    lat: 23.7731,
    lng: 90.3998,
  },
  {
    id: "rider_004",
    name: "Elena V.",
    status: "Assigned",
    distance: "0.8 mi",
    vehicle: "Bike",
    lat: 23.7712,
    lng: 90.3987,
  },
  {
    id: "rider_005",
    name: "David M.",
    status: "Offline",
    distance: "--",
    vehicle: "Bike",
    lat: 23.7801,
    lng: 90.4212,
  },
  {
    id: "rider_006",
    name: "James P.",
    status: "Assigned",
    distance: "1.2 mi",
    vehicle: "Bike",
    lat: 23.7589,
    lng: 90.3987,
  },
  {
    id: "rider_007",
    name: "Anna L.",
    status: "Available",
    distance: "0.4 mi",
    vehicle: "Bike",
    lat: 23.7701,
    lng: 90.4056,
  },
];

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (process.env.NODE_ENV === "development" && !decoded) {
    const activeDeliveries = demoDeliveries.filter(
      (d) => d.status === "Picked Up" || d.status === "Assigning" || d.status === "In Transit"
    );

    return NextResponse.json({
      deliveries: demoDeliveries,
      activeDeliveries,
      riders: demoRiders,
      storeOpen: true,
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

  const activeDeliveries = demoDeliveries.filter(
    (d) => d.status === "Picked Up" || d.status === "Assigning" || d.status === "In Transit"
  );

  return NextResponse.json({
    deliveries: demoDeliveries,
    activeDeliveries,
    riders: demoRiders,
    storeOpen: true,
  });
}
