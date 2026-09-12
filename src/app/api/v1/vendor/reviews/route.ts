import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

export interface Review {
  id: string;
  orderId: string;
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

export const reviewSummaries: Record<number, { count: number; percentage: number }> = {
  5: { count: 1061, percentage: 85 },
  4: { count: 125, percentage: 10 },
  3: { count: 37, percentage: 3 },
  2: { count: 12, percentage: 1 },
  1: { count: 13, percentage: 1 },
};

export const demoReviews: Review[] = [
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
    rating: 4,
    timeAgo: "Today, 1:22 PM",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    text: "Great chicken wrap, but the coleslaw was a bit soggy. Still, the flavors were excellent and I'd order again.",
    sentiment: "neutral",
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
    orderId: "ORD-9902",
    orderName: "Pepperoni Pizza Feast",
    customerName: "Mike K.",
    rating: 2,
    timeAgo: "Yesterday, 8:30 PM",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    text: "The pizza arrived late and was cold by the time it got to me. The pepperoni was too greasy and the crust was soggy. Will try again hopefully.",
    sentiment: "negative",
    reply: {
      text: "We sincerely apologize for the delayed and cold delivery. We've addressed this with our kitchen team and delivery partner. A full refund has been issued for your next order.",
      createdAt: new Date(Date.now() - 82800000).toISOString(),
      by: "Restaurant Manager",
    },
  },
  {
    id: "rev_005",
    orderId: "ORD-9899",
    orderName: "Classic Burger Meal",
    customerName: "Tanvir M.",
    rating: 5,
    timeAgo: "Yesterday, 6:15 PM",
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    text: "Fantastic service from start to finish! The classic burger hit the spot and the garlic aioli was addictive. Will definitely be ordering again soon!",
    sentiment: "positive",
    reply: {
      text: "Thank you so much! We're thrilled you loved the burger and garlic aioli. Looking forward to serving you again soon!",
      createdAt: new Date(Date.now() - 89400000).toISOString(),
      by: "Restaurant Manager",
    },
  },
  {
    id: "rev_006",
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
    id: "rev_007",
    orderId: "ORD-9888",
    orderName: "Fish & Chips",
    customerName: "Sadia K.",
    rating: 1,
    timeAgo: "2 days ago",
    createdAt: new Date(Date.now() - 176400000).toISOString(),
    text: "Very disappointed. The fish was bland and the chips were undercooked. The portion was also much smaller than expected for the price.",
    sentiment: "negative",
  },
  {
    id: "rev_008",
    orderId: "ORD-9881",
    orderName: "Veggie Burger",
    customerName: "Farzana S.",
    rating: 5,
    timeAgo: "3 days ago",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    text: "Excellent plant-based burger! Even my non-vegetarian family loved it. The fresh ingredients really shine through. Highly recommend!",
    sentiment: "positive",
  },
  {
    id: "rev_009",
    orderId: "ORD-9875",
    orderName: "Milkshake & Brownie",
    customerName: "Arif B.",
    rating: 4,
    timeAgo: "3 days ago",
    createdAt: new Date(Date.now() - 262800000).toISOString(),
    text: "The milkshake was thick and creamy, and the brownie was perfectly sweet. Minor issue — the brownie was slightly crumbly but still delicious.",
    sentiment: "neutral",
  },
  {
    id: "rev_010",
    orderId: "ORD-9862",
    orderName: "Breakfast Burrito",
    customerName: "Rina P.",
    rating: 5,
    timeAgo: "4 days ago",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    text: "Best breakfast burrito I&apos;ve had in Dhaka! The eggs were perfectly cooked and the salsa had great flavor. Will be back for more.",
    sentiment: "positive",
    reply: {
      text: "Thank you! Our breakfast burrito is made fresh daily with locally sourced ingredients. We're so happy you enjoyed it!",
      createdAt: new Date(Date.now() - 342000000).toISOString(),
      by: "Restaurant Manager",
    },
  },
];

const AI_SENTIMENT_INSIGHTS = [
  "Customers frequently praise delivery speed, food quality, and presentation. Minor mentions of cold fries and soggy coleslaw. Overall sentiment is highly positive.",
  "Delivery speed and packaging receive strong praise. Some customers mentioned the fries could be hotter. Recommend adjusting fry holding time.",
  "Customers love the burger variety and fresh ingredients. Occasional complaints about late deliveries during peak hours. Consider adding more delivery staff.",
  "Excellent ratings overall! Customers appreciate the responsive customer service and accurate orders. A few mentions of small portion sizes for sides.",
  "High praise for the authentic flavors and generous portions. Some negative feedback about cold food during longer deliveries. Consider insulated packaging.",
];

export interface ReviewsResponse {
  reviews: Review[];
  overallRating: number;
  totalReviews: number;
  ratingSummary: Record<number, { count: number; percentage: number }>;
  sentimentInsight: string;
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  if (process.env.NODE_ENV === "development" && !decoded) {
    const ratingSummary: Record<number, { count: number; percentage: number }> = {};
    [5, 4, 3, 2, 1].forEach((stars) => {
      ratingSummary[stars] = reviewSummaries[stars] || { count: 0, percentage: 0 };
    });

    return NextResponse.json({
      reviews: demoReviews,
      overallRating: 4.8,
      totalReviews: 1248,
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

  const ratingSummary: Record<number, { count: number; percentage: number }> = {};
  [5, 4, 3, 2, 1].forEach((stars) => {
    ratingSummary[stars] = reviewSummaries[stars] || { count: 0, percentage: 0 };
  });

  return NextResponse.json({
    reviews: demoReviews,
    overallRating: 4.8,
    totalReviews: 1248,
    ratingSummary,
    sentimentInsight: AI_SENTIMENT_INSIGHTS[Math.floor(Math.random() * AI_SENTIMENT_INSIGHTS.length)],
  } as ReviewsResponse);
}
