import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getOptionalSession } from "@/lib/dal";
import { Review } from "@/models/Review";

// UPDATE (real reviews fix): src/components/RestaurantReviews.tsx used to
// keep its review list in local component state only — every review
// (including ones a customer submitted) vanished on refresh, and never
// reached the vendor dashboard's own Reviews tab (src/hooks/useReviews.ts),
// which already reads the real `Review` model. This route is the missing
// link: real reads/writes against that same model, keyed by restaurantId.

export async function GET(_req: NextRequest, { params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = await params;

  await dbConnect();
  const reviews = await Review.find({ merchantId: restaurantId }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: String(r._id),
      userName: r.customerName,
      rating: r.rating,
      date: r.createdAt.toISOString(),
      comment: r.text,
    })),
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ restaurantId: string }> }) {
  const session = await getOptionalSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "Please sign in as a customer to leave a review." }, { status: 401 });
  }

  const { restaurantId } = await params;
  const { rating, comment } = (await req.json()) as { rating?: number; comment?: string };

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 });
  }
  if (!comment?.trim()) {
    return NextResponse.json({ error: "comment is required" }, { status: 400 });
  }

  await dbConnect();

  const review = await Review.create({
    merchantId: restaurantId,
    customerId: session.id,
    customerName: session.name,
    rating,
    text: comment.trim(),
  });

  return NextResponse.json(
    {
      review: {
        id: String(review._id),
        userName: review.customerName,
        rating: review.rating,
        date: review.createdAt.toISOString(),
        comment: review.text,
      },
    },
    { status: 201 }
  );
}
