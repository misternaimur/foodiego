import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { Review } from "@/models/Review";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  const { reviewId } = await params;
  const body = await req.json();
  const { text } = body;

  if (process.env.NODE_ENV === "development" && !decoded) {
    return NextResponse.json({
      success: true,
      review: { id: reviewId, reply: { text: text || "", createdAt: new Date().toISOString(), by: "Restaurant Manager" } },
      message: `Reply posted to review ${reviewId}`,
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

  const review = await Review.findById(reviewId);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  review.set("reply", {
    text: text || "",
    createdAt: new Date(),
    by: user.name || "Restaurant Manager",
  });
  await review.save();

  return NextResponse.json({
    success: true,
    review: {
      id: review._id.toString(),
      reply: {
        text: review.reply?.text || "",
        createdAt: review.reply?.createdAt?.toISOString() || new Date().toISOString(),
        by: review.reply?.by || "Restaurant Manager",
      },
    },
    message: `Reply posted to review ${reviewId}`,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  const { reviewId } = await params;

  if (process.env.NODE_ENV === "development" && !decoded) {
    return NextResponse.json({
      success: true,
      review: { id: reviewId, reply: undefined },
      message: `Reply removed from review ${reviewId}`,
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

  const review = await Review.findById(reviewId);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  review.set("reply", undefined);
  await review.save();

  return NextResponse.json({
    success: true,
    review: { id: review._id.toString(), reply: undefined },
    message: `Reply removed from review ${reviewId}`,
  });
}