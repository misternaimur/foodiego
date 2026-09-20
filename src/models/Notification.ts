import mongoose, { Schema, models, model } from "mongoose";

// ============================================================
// NOTIFICATION MODEL -> "notification" collection
// ------------------------------------------------------------
// Mirrors foodiego-backend/models/Notification.js. Defined here too so
// Next.js code that creates notifications inline with an event it already
// owns (admin approving/rejecting a vendor or rider — see
// src/app/(main)/actions/admin.ts) can write to the same collection
// directly, the same dual-model pattern already used for OrderBooking,
// Restaurant, Rider, etc. Reads (list/mark-read/delete) all go through
// foodiego-backend's /api/notifications routes instead — this definition
// exists for the create side only.
// ============================================================
export interface NotificationDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    link: { type: String, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification =
  (models.Notification as mongoose.Model<NotificationDocument>) ||
  model<NotificationDocument>("Notification", NotificationSchema, "notification");

export default Notification;
