import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { demoReviews } from "@/app/api/v1/vendor/reviews/route";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const sessionCookie = req.cookies.get("session")?.value;
  const decoded = await verifySessionCookie(sessionCookie);

  const { reviewId } = await params;
  const body = await req.json();
  const { text } = body;

  const review = demoReviews.find((r) => r.id === reviewId);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (process.env.NODE_ENV === "development" && !decoded) {
    review.reply = {
      text: text || "",
      createdAt: new Date().toISOString(),
      by: "Restaurant Manager",
    };

    return NextResponse.json({
      success: true,
      review,
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

  review.reply = {
    text: text || "",
    createdAt: new Date().toISOString(),
    by: user.name || "Restaurant Manager",
  };

  return NextResponse.json({
    success: true,
    review,
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

  const review = demoReviews.find((r) => r.id === reviewId);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (process.env.NODE_ENV === "development" && !decoded) {
    review.reply = undefined;

    return NextResponse.json({
      success: true,
      review,
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

  review.reply = undefined;

  return NextResponse.json({
    success: true,
    review,
    message: `Reply removed from review ${reviewId}`,
  });
}
