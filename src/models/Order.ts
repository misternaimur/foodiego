import mongoose, { Schema, models, model } from "mongoose";

export interface OrderDocument {
  _id: mongoose.Types.ObjectId;
  orderId: string;
  merchantId: mongoose.Types.ObjectId;
  customer: {
    name: string;
    phone: string;
    address: string;
    email?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    addons?: Array<{ name: string; price: number }>;
  }>;
  status: "new" | "preparing" | "ready" | "picked_up" | "delivered" | "rejected";
  paymentMethod: string;
  paymentStatus: "paid" | "pending";
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: Date;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    merchantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      email: { type: String },
    },
    items: {
      type: [
        {
          name: { type: String, required: true },
          quantity: { type: Number, required: true, min: 1 },
          price: { type: Number, required: true, min: 0 },
          image: { type: String },
          addons: [
            {
              name: { type: String, required: true },
              price: { type: Number, required: true, min: 0 },
            },
          ],
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["new", "preparing", "ready", "picked_up", "delivered", "rejected"],
      default: "new",
      index: true,
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ["paid", "pending"], default: "pending" },
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Order =
  (models.Order as mongoose.Model<OrderDocument>) || model<OrderDocument>("Order", OrderSchema, "orders");

export default Order;
