import mongoose, { Schema, models, model } from "mongoose";

export interface Reply {
  text: string;
  createdAt: Date;
  by: string;
}

export interface ReviewDocument {
  _id: mongoose.Types.ObjectId;
  // UPDATE (real reviews fix): made optional. The vendor dashboard's review
  // tab always tied a review to a specific delivered order, but the
  // customer-facing restaurant page (src/components/RestaurantReviews.tsx)
  // lets a shopper leave general feedback on a restaurant without picking a
  // specific past order — orderId just isn't known in that flow, so it can
  // no longer be a hard requirement.
  orderId?: string;
  merchantId: mongoose.Types.ObjectId;
  // Set when the reviewer is a logged-in customer, so a review can later be
  // traced back to (and only edited/removed by) its author. Optional so old
  // reviews created before this field existed still read back fine.
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  rating: number;
  text: string;
  sentiment: "positive" | "neutral" | "negative";
  reply?: Reply;
  createdAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    orderId: { type: String, index: true },
    merchantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "positive",
    },
    reply: {
      text: { type: String },
      createdAt: { type: Date },
      by: { type: String },
    },
  },
  { timestamps: true }
);

export const Review =
  (models.Review as mongoose.Model<ReviewDocument>) || model<ReviewDocument>("Review", ReviewSchema, "reviews");

export default Review;
