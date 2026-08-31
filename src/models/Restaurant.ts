import mongoose, { Schema, models, model } from "mongoose";

export const RESTAURANT_STATUSES = ["pending", "approved", "rejected"] as const;
export type RestaurantStatus = (typeof RESTAURANT_STATUSES)[number];

export interface RestaurantDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone?: string;
  address: string;
  description?: string;
  logoUrl?: string;
  cuisineType?: string;
  openingTime?: string;
  closingTime?: string;
  isOpen: boolean;
  status: RestaurantStatus;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<RestaurantDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    cuisineType: { type: String, trim: true },
    openingTime: { type: String, trim: true },
    closingTime: { type: String, trim: true },
    isOpen: { type: Boolean, default: true },
    status: { type: String, enum: RESTAURANT_STATUSES, default: "pending" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

export const Restaurant =
  (models.Restaurant as mongoose.Model<RestaurantDocument>) ||
  model<RestaurantDocument>("Restaurant", RestaurantSchema, "restaurant");

export default Restaurant;
