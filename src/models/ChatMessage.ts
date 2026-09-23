import mongoose, { Schema, models, model } from "mongoose";

// ============================================================
// CHAT MESSAGE MODEL -> "chatMessage" collection
// ------------------------------------------------------------
// Mirrors foodiego-backend/models/ChatMessage.js field-for-field, so
// messages written here and messages written through that backend's
// /api/chat routes live in the same thread. Two threads per order:
//
//   customer_rider   -> the customer and the assigned rider
//   restaurant_rider -> the restaurant owner and the assigned rider
// ============================================================
export const CHAT_CHANNELS = ["customer_rider", "restaurant_rider"] as const;
export type ChatChannel = (typeof CHAT_CHANNELS)[number];

export const CHAT_SENDER_ROLES = ["customer", "rider", "restaurant"] as const;
export type ChatSenderRole = (typeof CHAT_SENDER_ROLES)[number];

export interface ChatMessageDocument {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  channel: ChatChannel;
  senderId: mongoose.Types.ObjectId;
  senderRole: ChatSenderRole;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<ChatMessageDocument>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "OrderBooking", required: true },
    channel: { type: String, enum: CHAT_CHANNELS, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: CHAT_SENDER_ROLES, required: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// History is always read as "one order + one channel, oldest first".
ChatMessageSchema.index({ orderId: 1, channel: 1, createdAt: 1 });

export const ChatMessage =
  (models.ChatMessage as mongoose.Model<ChatMessageDocument>) ||
  model<ChatMessageDocument>("ChatMessage", ChatMessageSchema, "chatMessage");

export default ChatMessage;
