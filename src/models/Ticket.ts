import mongoose, { Schema, models, model } from "mongoose";

export const TICKET_CATEGORIES = ["Payment", "Order Issue", "Technical", "Account", "General"] as const;
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export const TICKET_PRIORITIES = ["low", "medium", "high"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_STATUSES = ["open", "in_progress", "resolved"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface TicketMessage {
  sender: "merchant" | "agent";
  text: string;
  timestamp: Date;
  avatar?: string;
}

export interface TicketDocument {
  _id: mongoose.Types.ObjectId;
  ticketId: string;
  vendorId: mongoose.Types.ObjectId;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  messages: TicketMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSchema = new Schema<TicketMessage>(
  {
    sender: { type: String, enum: ["merchant", "agent"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    avatar: { type: String },
  },
  { _id: false }
);

const TicketSchema = new Schema<TicketDocument>(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true, trim: true },
    category: { type: String, enum: TICKET_CATEGORIES, required: true, default: "General" },
    priority: { type: String, enum: TICKET_PRIORITIES, required: true, default: "medium" },
    status: { type: String, enum: TICKET_STATUSES, required: true, default: "open" },
    messages: { type: [TicketMessageSchema], default: [] },
  },
  { timestamps: true }
);

export const generateTicketId = (): string => {
  return `TK-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const Ticket =
  (models.Ticket as mongoose.Model<TicketDocument>) ||
  model<TicketDocument>("Ticket", TicketSchema, "tickets");

export default Ticket;