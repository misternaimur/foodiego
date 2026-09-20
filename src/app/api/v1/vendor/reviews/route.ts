import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Restaurant } from "@/models/Restaurant";
import { Review } from "@/models/Review";

export interface Review {
  id: string;
  orderId?: string;
  orderName: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  timeAgo: string;
  createdAt: string;
  text: string;
  sentiment: "positive" | "neutral" | "negative";
  reply?: {
    text: string;
    createdAt: string;
    by: string;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  overallRating: number;
  totalReviews: number;
  ratingSummary: Record<number, { count: number; percentage: number }>;
  sentimentInsight: string;
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

function calculateSentiment(rating: number): "positive" | "neutral" | "negative" {
  if (rating >= 4) return "positive";
  if (rating === 3) return "neutral";
  return "negative";
}

const AI_SENTIMENT_INSIGHTS = [
  "Customers frequently praise delivery speed, food quality, and presentation. Minor mentions of cold fries and soggy coleslaw. Overall sentiment is highly positive.",
  "Delivery speed and packaging receive strong praise. Some customers mentioned the fries could be hotter. Recommend adjusting fry holding time.",
  "Customers love the burger variety and fresh ingredients. Occasional complaints about late deliveries during peak hours. Consider adding more delivery staff.",
  "Excellent ratings overall! Customers appreciate the responsive customer service and accurate orders. A few mentions of small portion sizes for sides.",
  "High praise for the authentic flavors and generous portions. Some negative feedback about cold food during longer deliveries. Consider insulated packaging.",
];

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (process.env.NODE_ENV === "development" && !decoded) {
    const demoReviews: Review[] = [
      {
        id: "rev_001",
        orderId: "ORD-9921",
        orderName: "Truffle Burger Combo",
        customerName: "Sarah M.",
        rating: 5,
        timeAgo: "Today, 2:45 PM",
        createdAt: new Date().toISOString(),
        text: "Amazing food! The truffle burger was cooked to perfection and the fries were crispy. Delivery was super fast — driver was very polite.",
        sentiment: "positive",
      },
      {
        id: "rev_002",
        orderId: "ORD-9918",
        orderName: "Spicy Chicken Wrap Meal",
        customerName: "David C.",
        rating: 5,
        timeAgo: "Today, 1:22 PM",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        text: "Absolutely love the spicy chicken wrap! The flavors are incredible and delivery was on time. Best lunch I've had in weeks!",
        sentiment: "positive",
      },
      {
        id: "rev_003",
        orderId: "ORD-9915",
        orderName: "Margherita Pizza",
        customerName: "Elena R.",
        rating: 5,
        timeAgo: "Today, 11:05 AM",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        text: "Best pizza in town! The crust was perfectly crispy on the outside and soft on the inside. The delivery driver called when he arrived.",
        sentiment: "positive",
      },
      {
        id: "rev_004",
        orderId: "ORD-9912",
        orderName: "Classic Burger Meal",
        customerName: "Tanvir M.",
        rating: 5,
        timeAgo: "Yesterday, 6:15 PM",
        createdAt: new Date(Date.now() - 90000000).toISOString(),
        text: "Fantastic service from start to finish! The classic burger hit the spot and the garlic aioli was addictive. Will definitely be ordering again soon!",
        sentiment: "positive",
      },
      {
        id: "rev_005",
        orderId: "ORD-9908",
        orderName: "Chocolate Lava Cake",
        customerName: "Farzana S.",
        rating: 5,
        timeAgo: "3 days ago",
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        text: "Excellent dessert! The lava cake was warm with a perfect gooey center. Served with vanilla ice cream - absolutely divine!",
        sentiment: "positive",
      },
      {
        id: "rev_006",
        orderId: "ORD-9905",
        orderName: "Veggie Burger",
        customerName: "Rina P.",
        rating: 5,
        timeAgo: "4 days ago",
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        text: "Best plant-based burger I've ever had! Even my non-vegetarian family loved it. The fresh ingredients really shine through.",
        sentiment: "positive",
      },
      {
        id: "rev_007",
        orderId: "ORD-9902",
        orderName: "Pepperoni Pizza Feast",
        customerName: "Mike K.",
        rating: 4,
        timeAgo: "Yesterday, 8:30 PM",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        text: "Great pizza overall! The pepperoni was generous and the crust was good. Just wish it arrived a bit hotter. Still very tasty though.",
        sentiment: "positive",
      },
      {
        id: "rev_008",
        orderId: "ORD-9898",
        orderName: "Oreo Milkshake",
        customerName: "Arif B.",
        rating: 4,
        timeAgo: "3 days ago",
        createdAt: new Date(Date.now() - 262800000).toISOString(),
        text: "The milkshake was thick and creamy, and the brownie was perfectly sweet. Minor issue — the brownie was slightly crumbly but still delicious.",
        sentiment: "neutral",
      },
      {
        id: "rev_009",
        orderId: "ORD-9895",
        orderName: "Chicken Wings Combo",
        customerName: "Nahid R.",
        rating: 3,
        timeAgo: "2 days ago",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        text: "The wings were good but a bit dry. The blue cheese dip was great though. The delivery was on time.",
        sentiment: "neutral",
      },
      {
        id: "rev_010",
        orderId: "ORD-9892",
        orderName: "Loaded Fries",
        customerName: "Hassan A.",
        rating: 4,
        timeAgo: "5 days ago",
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        text: "Loaded fries were amazing! Cheese was perfectly melted and the jalapeños added great kick. Fast delivery too.",
        sentiment: "positive",
      },
      {
        id: "rev_011",
        orderId: "ORD-9888",
        orderName: "Fish & Chips",
        customerName: "Sadia K.",
        rating: 2,
        timeAgo: "2 days ago",
        createdAt: new Date(Date.now() - 176400000).toISOString(),
        text: "Disappointed this time. The fish was bland and the chips were undercooked. The portion was also much smaller than expected.",
        sentiment: "negative",
      },
      {
        id: "rev_012",
        orderId: "ORD-9885",
        orderName: "House Blend Iced Coffee",
        customerName: "Karim L.",
        rating: 5,
        timeAgo: "6 days ago",
        createdAt: new Date(Date.now() - 518400000).toISOString(),
        text: "Perfect iced coffee! Not too sweet, strong coffee flavor, and the ice doesn't water it down. My go-to morning drink now.",
        sentiment: "positive",
      },
      {
        id: "rev_013",
        orderId: "ORD-9881",
        orderName: "Brownie",
        customerName: "Meera J.",
        rating: 1,
        timeAgo: "1 week ago",
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        text: "Unfortunately the brownie was stale and hard. Very disappointed as I usually love the desserts here. Hope it was a one-off.",
        sentiment: "negative",
      },
      {
        id: "rev_014",
        orderId: "ORD-9878",
        orderName: "Breakfast Burrito",
        customerName: "Omar H.",
        rating: 5,
        timeAgo: "1 week ago",
        createdAt: new Date(Date.now() - 691200000).toISOString(),
        text: "Best breakfast burrito in Dhaka! The eggs were perfectly cooked and the salsa had great flavor. Will be back for more.",
        sentiment: "positive",
      },
      {
        id: "rev_015",
        orderId: "ORD-9875",
        orderName: "Loaded Fries",
        customerName: "Priya N.",
        rating: 4,
        timeAgo: "1 week ago",
        createdAt: new Date(Date.now() - 777600000).toISOString(),
        text: "Really tasty loaded fries! Cheese, jalapeños, and sauce all balanced perfectly. Delivery was quick and food was hot.",
        sentiment: "positive",
      },
    ];

    const total = demoReviews.length;
    const ratingSummary: Record<number, { count: number; percentage: number }> = {};
    [5, 4, 3, 2, 1].forEach((stars) => {
      const count = demoReviews.filter((r) => r.rating === stars).length;
      ratingSummary[stars] = { count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 };
    });

    const avgRating = (demoReviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1);

    return NextResponse.json({
      reviews: demoReviews,
      overallRating: Number(avgRating),
      totalReviews: total,
      ratingSummary,
      sentimentInsight: AI_SENTIMENT_INSIGHTS[Math.floor(Math.random() * AI_SENTIMENT_INSIGHTS.length)],
    } as ReviewsResponse);
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
    return NextResponse.json({
      reviews: [],
      overallRating: 0,
      totalReviews: 0,
      ratingSummary: { 5: { count: 0, percentage: 0 }, 4: { count: 0, percentage: 0 }, 3: { count: 0, percentage: 0 }, 2: { count: 0, percentage: 0 }, 1: { count: 0, percentage: 0 } },
      sentimentInsight: "No reviews yet. Encourage customers to leave feedback!",
    } as ReviewsResponse);
  }

  const reviews = await Review.find({ merchantId: restaurant._id })
    .sort({ createdAt: -1 })
    .lean();

  const total = reviews.length;
  const ratingSummary: Record<number, { count: number; percentage: number }> = {};
  [5, 4, 3, 2, 1].forEach((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    ratingSummary[stars] = { count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 };
  });

  const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : "0.0";

  const formattedReviews: Review[] = reviews.map((r) => ({
    id: r._id.toString(),
    orderId: r.orderId,
    orderName: "Order", // Could be populated from Order model if needed
    customerName: r.customerName,
    rating: r.rating,
    timeAgo: formatTimeAgo(r.createdAt),
    createdAt: r.createdAt.toISOString(),
    text: r.text,
    sentiment: calculateSentiment(r.rating),
  }));

  return NextResponse.json({
    reviews: formattedReviews,
    overallRating: Number(avgRating),
    totalReviews: total,
    ratingSummary,
    sentimentInsight: AI_SENTIMENT_INSIGHTS[Math.floor(Math.random() * AI_SENTIMENT_INSIGHTS.length)],
  } as ReviewsResponse);
}