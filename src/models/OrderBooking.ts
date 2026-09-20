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
  city?: string;
  paymentMethod: "cash" | "card" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  status: OrderBookingStatus;
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
      },
    ],
    totalAmount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    deliveryAddress: { type: String },
    city: { type: String, trim: true },
    paymentMethod: { type: String, enum: ["cash", "card", "online"], default: "cash" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    status: { type: String, enum: ORDER_STATUSES, default: "pending" },
    refundStatus: { type: String, enum: ["pending", "approved", "rejected"] },
  },
  { timestamps: true, strict: false }
);

export const OrderBooking =
  (models.OrderBooking as mongoose.Model<OrderBookingDocument>) ||
  model<OrderBookingDocument>("OrderBooking", OrderBookingSchema, "orderBooking");

export default OrderBooking;
