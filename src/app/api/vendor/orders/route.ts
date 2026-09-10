import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

const orders = [
  {
    id: "#FG10234",
    status: "picked_up" as const,
    timeAgo: "15m ago",
    customer: {
      name: "Rahim Ahmed",
      phone: "+880 1711-000000",
      address: "House 12, Road 4, Block C, Banani, Dhaka",
      orderCount: 15,
      avatar: "",
      email: "rahim.ahmed@example.com",
    },
    items: [
      {
        id: "item_1",
        name: "Classic Burger",
        quantity: 2,
        price: 350,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200",
        addons: [{ name: "Extra Cheese", price: 50 }],
      },
      {
        id: "item_2",
        name: "French Fries",
        quantity: 1,
        price: 100,
        image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=200",
      },
    ],
    paymentMethod: "bKash" as const,
    paymentStatus: "paid" as const,
    subtotal: 750,
    deliveryFee: 100,
    total: 850,
    createdAt: "Today, 14:32",
    notes: "Please add extra sauce on the side.",
  },
  {
    id: "#FG10235",
    status: "new" as const,
    timeAgo: "2m ago",
    customer: {
      name: "Sarah T.",
      phone: "+880 1911-000000",
      address: "Apt 7B, Green View Complex, Dhanmondi, Dhaka",
      orderCount: 8,
    },
    items: [
      {
        id: "item_3",
        name: "Spicy Chicken Wrap",
        quantity: 1,
        price: 300,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: "item_4",
        name: "Cola",
        quantity: 1,
        price: 120,
        image: "",
      },
    ],
    paymentMethod: "cash" as const,
    paymentStatus: "pending" as const,
    subtotal: 420,
    deliveryFee: 0,
    total: 420,
    createdAt: "Today, 14:25",
  },
  {
    id: "#FG10233",
    status: "preparing" as const,
    timeAgo: "8m ago",
    customer: {
      name: "Nahid R.",
      phone: "+880 1511-000000",
      address: "Flat 3A, Sunshine Tower, Gulshan, Dhaka",
      orderCount: 12,
    },
    items: [
      {
        id: "item_5",
        name: "Margherita Pizza",
        quantity: 1,
        price: 450,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: "item_6",
        name: "Garlic Bread",
        quantity: 1,
        price: 120,
        image: "https://images.unsplash.com/photo-1601319713084-4e8f5b7a9a5f?auto=format&fit=crop&q=80&w=200",
      },
    ],
    paymentMethod: "card" as const,
    paymentStatus: "paid" as const,
    subtotal: 570,
    deliveryFee: 50,
    total: 620,
    createdAt: "Today, 14:17",
    notes: "Extra basil please.",
  },
  {
    id: "#FG10232",
    status: "ready" as const,
    timeAgo: "12m ago",
    customer: {
      name: "Sadia K.",
      phone: "+880 1811-000000",
      address: "House 8, Road 11, Dhanmondi, Dhaka",
      orderCount: 5,
    },
    items: [
      {
        id: "item_7",
        name: "Chicken Wings",
        quantity: 2,
        price: 320,
        image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=200",
      },
    ],
    paymentMethod: "bKash" as const,
    paymentStatus: "paid" as const,
    subtotal: 640,
    deliveryFee: 80,
    total: 720,
    createdAt: "Today, 14:13",
  },
  {
    id: "#FG10231",
    status: "picked_up" as const,
    timeAgo: "25m ago",
    customer: {
      name: "Tanvir M.",
      phone: "+880 1611-000000",
      address: "Apt 4B, Green View Complex, Dhanmondi, Dhaka",
      orderCount: 22,
    },
    items: [
      {
        id: "item_8",
        name: "Brownie",
        quantity: 2,
        price: 180,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: "item_9",
        name: "Milkshake",
        quantity: 1,
        price: 220,
        image: "",
      },
    ],
    paymentMethod: "cash" as const,
    paymentStatus: "paid" as const,
    subtotal: 580,
    deliveryFee: 60,
    total: 640,
    createdAt: "Today, 13:55",
  },
  {
    id: "#FG10230",
    status: "delivered" as const,
    timeAgo: "1h ago",
    customer: {
      name: "Farzana S.",
      phone: "+880 1712-000000",
      address: "House 22, Road 6, Banani, Dhaka",
      orderCount: 18,
    },
    items: [
      {
        id: "item_10",
        name: "Spicy Chicken Pizza (L)",
        quantity: 1,
        price: 650,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=200",
      },
    ],
    paymentMethod: "bKash" as const,
    paymentStatus: "paid" as const,
    subtotal: 650,
    deliveryFee: 80,
    total: 730,
    createdAt: "Today, 13:30",
  },
  {
    id: "#FG10229",
    status: "new" as const,
    timeAgo: "3m ago",
    customer: {
      name: "Kamal H.",
      phone: "+880 1912-000000",
      address: "House 45, Road 12, Badda, Dhaka",
      orderCount: 3,
    },
    items: [
      {
        id: "item_11",
        name: "Veggie Burger",
        quantity: 1,
        price: 380,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: "item_12",
        name: "Onion Rings",
        quantity: 1,
        price: 120,
        image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=200",
      },
    ],
    paymentMethod: "card" as const,
    paymentStatus: "pending" as const,
    subtotal: 500,
    deliveryFee: 50,
    total: 550,
    createdAt: "Today, 14:27",
  },
  {
    id: "#FG10228",
    status: "preparing" as const,
    timeAgo: "10m ago",
    customer: {
      name: "Rina P.",
      phone: "+880 1311-000000",
      address: "Flat 2C, Lakeview Heights, Gulshan, Dhaka",
      orderCount: 7,
    },
    items: [
      {
        id: "item_13",
        name: "BBQ Chicken Pizza",
        quantity: 1,
        price: 700,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: "item_14",
        name: "Cola",
        quantity: 2,
        price: 120,
        image: "",
      },
    ],
    paymentMethod: "bKash" as const,
    paymentStatus: "paid" as const,
    subtotal: 940,
    deliveryFee: 80,
    total: 1020,
    createdAt: "Today, 14:20",
    notes: "Family size, please.",
  },
  {
    id: "#FG10227",
    status: "picked_up" as const,
    timeAgo: "35m ago",
    customer: {
      name: "Arif B.",
      phone: "+880 1411-000000",
      address: "House 77, Road 15, Mohammadpur, Dhaka",
      orderCount: 31,
    },
    items: [
      {
        id: "item_15",
        name: "Chicken Tikka Pizza",
        quantity: 1,
        price: 600,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: "item_16",
        name: "Cheesy Pasta",
        quantity: 1,
        price: 350,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200",
      },
    ],
    paymentMethod: "card" as const,
    paymentStatus: "paid" as const,
    subtotal: 950,
    deliveryFee: 100,
    total: 1050,
    createdAt: "Today, 13:25",
  },
  {
    id: "#FG10226",
    status: "delivered" as const,
    timeAgo: "1h 30m ago",
    customer: {
      name: "Tasnim M.",
      phone: "+880 1211-000000",
      address: "Flat 5A, Hill View Apartments, Dhanmondi, Dhaka",
      orderCount: 14,
    },
    items: [
      {
        id: "item_17",
        name: "Fish Sandwich",
        quantity: 2,
        price: 280,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200",
      },
    ],
    paymentMethod: "cash" as const,
    paymentStatus: "paid" as const,
    subtotal: 560,
    deliveryFee: 70,
    total: 630,
    createdAt: "Today, 13:00",
  },
  {
    id: "#FG10225",
    status: "ready" as const,
    timeAgo: "20m ago",
    customer: {
      name: "Fahim K.",
      phone: "+880 1811-000000",
      address: "House 31, Road 8, Eskaton, Dhaka",
      orderCount: 9,
    },
    items: [
      {
        id: "item_18",
        name: "Beef Burger",
        quantity: 1,
        price: 420,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: "item_19",
        name: "Sweet Potato Fries",
        quantity: 1,
        price: 150,
        image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: "item_20",
        name: "Chocolate Shake",
        quantity: 1,
        price: 200,
        image: "",
      },
    ],
    paymentMethod: "bKash" as const,
    paymentStatus: "paid" as const,
    subtotal: 770,
    deliveryFee: 90,
    total: 860,
    createdAt: "Today, 14:10",
  },
];

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { orderId, action } = body;

  if (!orderId || !action) {
    return NextResponse.json({ error: "Missing orderId or action" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    orderId,
    action,
    message: `Order ${action} processed successfully`,
  });
}
