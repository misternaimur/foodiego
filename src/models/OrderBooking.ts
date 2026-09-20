import mongoose, { Schema, models, model } from "mongoose";

// ============================================================
// ORDER BOOKING MODEL -> "orderBooking" collection
// ------------------------------------------------------------
// Mirrors foodiego-backend/models/OrderBooking.js, which is where
// customer checkout actually writes these documents (see
// src/app/api/v1/client/orders/route.ts). Defined here too, with
// `strict: false`, so admin pages can read/aggregate this collection
// directly with mongoose instead of round-tripping through that API.
// ============================================================
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;
export type OrderBookingStatus = (typeof ORDER_STATUSES)[number];

export interface OrderBookingItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface OrderBookingDocument {
  _id: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  restaurantId?: mongoose.Types.ObjectId;
  restaurantName?: string;
  riderId?: mongoose.Types.ObjectId;
  items: OrderBookingItem[];
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  deliveryNote?: string;
  city?: string;
  paymentMethod: "cash" | "card" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  status: OrderBookingStatus;
  // UPDATE (order-lifecycle fix): timestamps for the two rider-triggered
  // transitions, so delivery time can be reported honestly (was previously
  // impossible to compute — only createdAt/updatedAt existed, and
  // updatedAt gets clobbered by every unrelated field edit too).
  pickedUpAt?: Date;
  deliveredAt?: Date;
  // UPDATE (rider-rating fix): the Rider model always had a `rating` field,
  // but nothing anywhere ever wrote to it - there was no rider-facing
  // counterpart to the real restaurant/food review system. One rating per
  // delivered order, set once (see the rider-rating route), used to
  // recompute Rider.rating as a simple average.
  riderRating?: number;
  // UPDATE (admin-refunds fix): admin/refunds used to be a fully local
  // mock table with a `handleApprove`/`handleReject` that only updated
  // component state (reset on refresh). There's no dedicated Refund model
  // in this codebase, so a cancelled-and-already-paid order (see
  // src/app/api/admin/refunds/route.ts) is used as the real refund
  // candidate — this field persists the admin's actual approve/reject
  // decision on it instead of pretending to.
  refundStatus?: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const OrderBookingSchema = new Schema<OrderBookingDocument>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    restaurantName: { type: String, trim: true },
    riderId: { type: Schema.Types.ObjectId, ref: "Rider" },
    items: [
      {
        menuItemId: { type: String },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        specialInstructions: { type: String, trim: true },
      },
    ],
    totalAmount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    deliveryAddress: { type: String },
    deliveryNote: { type: String, trim: true },
    city: { type: String, trim: true },
    paymentMethod: { type: String, enum: ["cash", "card", "online"], default: "cash" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    status: { type: String, enum: ORDER_STATUSES, default: "pending" },
    refundStatus: { type: String, enum: ["pending", "approved", "rejected"] },
    pickedUpAt: { type: Date },
    deliveredAt: { type: Date },
    riderRating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true, strict: false }
);

export const OrderBooking =
  (models.OrderBooking as mongoose.Model<OrderBookingDocument>) ||
  model<OrderBookingDocument>("OrderBooking", OrderBookingSchema, "orderBooking");

export default OrderBooking;
