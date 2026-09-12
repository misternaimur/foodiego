import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { MenuItem } from "@/models/MenuItem";

export interface MenuItemAddon {
  name: string;
  price: number;
}

export interface MenuItem {
  _id: string;
  vendorId: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  addons: MenuItemAddon[];
  isActive: boolean;
  ordersCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMenuResponse {
  items: MenuItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateMenuItemInput {
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  addons?: MenuItemAddon[];
}

export interface ToggleMenuItemResponse {
  success: boolean;
  item: MenuItem;
}

export interface CreateMenuItemResponse {
  success: boolean;
  item: MenuItem;
}

export const demoMenuItems: MenuItem[] = [
  {
    _id: "65f1a2b3c4d5e6f7a8b9c001",
    vendorId: "rest_001",
    name: "Classic Cheeseburger",
    category: "Burgers",
    price: 450,
    description: "Juicy beef patty with melted American cheese, lettuce, tomato, and our special sauce on a toasted brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200",
    addons: [
      { name: "Extra Cheese", price: 30 },
      { name: "Bacon", price: 50 },
    ],
    isActive: true,
    ordersCount: 127,
    rating: 4.7,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c002",
    vendorId: "rest_001",
    name: "Spicy Chicken Wrap",
    category: "Burgers",
    price: 380,
    description: "Grilled chicken with spicy mayo, lettuce, tomato, and cheese wrapped in a warm flour tortilla.",
    image: "https://images.unsplash.com/photo-1539046323435-9c9a0e6a6b10?auto=format&fit=crop&q=80&w=200",
    addons: [{ name: "Extra Spicy", price: 20 }],
    isActive: true,
    ordersCount: 89,
    rating: 4.5,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c003",
    vendorId: "rest_001",
    name: "Margherita Pizza (L)",
    category: "Pizza",
    price: 650,
    description: "Classic Margherita with fresh mozzarella, San Marzano tomatoes, and fragrant basil on our signature crust.",
    image: "https://images.unsplash.com/photo-1565593042054-7ceb1c7e2b30?auto=format&fit=crop&q=80&w=200",
    addons: [],
    isActive: true,
    ordersCount: 156,
    rating: 4.8,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c004",
    vendorId: "rest_001",
    name: "Pepperoni Pizza Feast",
    category: "Pizza",
    price: 720,
    description: "Loaded with extra pepperoni, mozzarella, and a sprinkle of oregano on our hand-stretched crust.",
    image: "https://images.unsplash.com/photo-1572746-006262069621-4c8b67e8a90f?auto=format&fit=crop&q=80&w=200",
    addons: [{ name: "Extra Cheese", price: 40 }],
    isActive: false,
    ordersCount: 43,
    rating: 4.3,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c005",
    vendorId: "rest_001",
    name: "Classic Caesar Salad",
    category: "Sides",
    price: 280,
    description: "Fresh romaine lettuce, parmesan, croutons, and creamy Caesar dressing.",
    image: "https://images.unsplash.com/photo-1552730987-65a8dc19a42f?auto=format&fit=crop&q=80&w=200",
    addons: [],
    isActive: true,
    ordersCount: 76,
    rating: 4.2,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c006",
    vendorId: "rest_001",
    name: "Oreo Milkshake",
    category: "Drinks",
    price: 240,
    description: "Creamy vanilla milkshake blended with Oreo cookies and topped with whipped cream.",
    image: "https://images.unsplash.com/photo-1546791456-8c6a038e7a7e?auto=format&fit=crop&q=80&w=200",
    addons: [{ name: "Extra Oreo", price: 25 }],
    isActive: true,
    ordersCount: 112,
    rating: 4.6,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c007",
    vendorId: "rest_001",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 190,
    description: "Warm chocolate cake with a gooey molten center, served with vanilla ice cream.",
    image: "https://images.unsplash.com/photo-1563379926888-8111f1a6680e?auto=format&fit=crop&q=80&w=200",
    addons: [],
    isActive: true,
    ordersCount: 89,
    rating: 4.4,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c008",
    vendorId: "rest_001",
    name: "Loaded Fries",
    category: "Sides",
    price: 180,
    description: "Crispy golden fries topped with melted cheese, jalapeños, and our signature sauce.",
    image: "https://images.unsplash.com/photo-1576542026525-a0f42c0ec0a09?auto=format&fit=crop&q=80&w=200",
    addons: [],
    isActive: true,
    ordersCount: 64,
    rating: 4.1,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c009",
    vendorId: "rest_001",
    name: "Veggie Burger",
    category: "Burgers",
    price: 420,
    description: "Plant-based patty with avocado, lettuce, tomato, and vegan aioli on a whole wheat bun.",
    image: "https://images.unsplash.com/photo-1594983929283-5c5d1b2a0e8e?auto=format&fit=crop&q=80&w=200",
    addons: [{ name: "Extra Avocado", price: 45 }],
    isActive: true,
    ordersCount: 78,
    rating: 4.3,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c00a",
    vendorId: "rest_001",
    name: "Brownie",
    category: "Desserts",
    price: 120,
    description: "Rich chocolate brownie with a perfect chewy texture, dusted with powdered sugar.",
    image: "https://images.unsplash.com/photo-1587668178277-4204544a435a?auto=format&fit=crop&q=80&w=200",
    addons: [],
    isActive: false,
    ordersCount: 32,
    rating: 4.0,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c00b",
    vendorId: "rest_001",
    name: "House Blend Iced Coffee",
    category: "Drinks",
    price: 150,
    description: "Cold-brewed coffee served over ice with optional milk and sugar.",
    image: "https://images.unsplash.com/photo-1514348815076-3bc3b020a8a8?auto=format&fit=crop&q=80&w=200",
    addons: [],
    isActive: true,
    ordersCount: 95,
    rating: 4.5,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
  },
];

function getPaginatedItems(allItems: MenuItem[], page: number, limit: number): PaginatedMenuResponse {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = allItems.slice(startIndex, endIndex);
  return {
    items,
    total: allItems.length,
    page,
    limit,
    totalPages: Math.ceil(allItems.length / limit),
  };
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  if (process.env.NODE_ENV === "development" && !decoded) {
    let filtered = demoMenuItems;
    if (category) {
      filtered = filtered.filter((i) => i.category === category);
    }
    if (search) {
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    const result = getPaginatedItems(filtered, page, limit);
    return NextResponse.json(result as PaginatedMenuResponse);
  }

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ uid: decoded.uid }).lean();
  if (!user || user.role !== "restaurant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const filter: Record<string, unknown> = { vendorId: user._id };
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: "i" };

  const items = await MenuItem.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await MenuItem.countDocuments(filter);

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  } as unknown as PaginatedMenuResponse);
}

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

    const newItem: MenuItem = {
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

    return NextResponse.json(
      { success: true, item: newItem } as CreateMenuItemResponse,
      { status: 201 }
    );
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

  return NextResponse.json(
    { success: true, item } as unknown as CreateMenuItemResponse,
    { status: 201 }
  );
}
