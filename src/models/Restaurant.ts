import mongoose, { Schema, models, model } from "mongoose";

// Const array and TypeScript type define korche restaurant er approval statuses ("pending", "approved", "rejected") er jonno, jate type safety thake.
export const RESTAURANT_STATUSES = ["pending", "approved", "rejected"] as const;
export type RestaurantStatus = (typeof RESTAURANT_STATUSES)[number];

// TypeScript interface define korche ekta Restaurant document er exact structure & types ki hobe tar jonno.

export interface RestaurantDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone?: string;
  address: string;
  description?: string;
  logoUrl?: string; // Cloudinary ba other source theke asa image URL store korar field
  cuisineType?: string;
  openingTime?: string;
  closingTime?: string;
  isOpen: boolean;
  status: RestaurantStatus;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema define korche database er field rules, types, validation (required, trim, enum, min/max) er jonno.

const RestaurantSchema = new Schema<RestaurantDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Vendor/User model er sathe relation
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
  { timestamps: true } // Automatically createdAt & updatedAt field handle kore
);

// Next.js hot-reload environment e model overwrite error (OverwriteModelError) avoid korar standard pattern.
// Jodi model age theke compile kora thake tahole setai use korbe, nahole notun kore model create korbe ("restaurant" collection name e).

export const Restaurant =
  (models.Restaurant as mongoose.Model<RestaurantDocument>) ||
  model<RestaurantDocument>("Restaurant", RestaurantSchema, "restaurant");

export default Restaurant;