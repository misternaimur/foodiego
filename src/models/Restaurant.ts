import mongoose, { Schema, models, model } from "mongoose";

// Const array and TypeScript type define korche restaurant er approval statuses ("pending", "approved", "rejected") er jonno, jate type safety thake.
export const RESTAURANT_STATUSES = ["pending", "approved", "rejected"] as const;
export type RestaurantStatus = (typeof RESTAURANT_STATUSES)[number];

// TypeScript interface define korche ekta Restaurant document er exact structure & types ki hobe tar jonno.

export interface OperatingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

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
  tagline?: string;
  website?: string;
  coverImage?: string;
  minOrderValue?: number;
  deliveryFee?: number;
  packagingFeeEnabled?: boolean;
  packagingFee?: number;
  storeStatus?: "open" | "closed";
  operatingHours?: OperatingHours[];
  tradeLicenseUrl?: string;
  ownerNidUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema define korche database er field rules, types, validation (required, trim, enum, min/max) er jonno.

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
    tagline: { type: String, trim: true },
    website: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    minOrderValue: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    packagingFeeEnabled: { type: Boolean, default: false },
    packagingFee: { type: Number, default: 0 },
    storeStatus: { type: String, enum: ["open", "closed"], default: "open" },
    operatingHours: [
      {
        day: { type: String, required: true },
        isOpen: { type: Boolean, default: true },
        openTime: { type: String, default: "10:00" },
        closeTime: { type: String, default: "22:00" },
      },
    ],
    tradeLicenseUrl: { type: String, trim: true },
    ownerNidUrl: { type: String, trim: true },
  },
  { timestamps: true, strict: false }
);

// Next.js hot-reload environment e model overwrite error (OverwriteModelError) avoid korar standard pattern.
// Jodi model age theke compile kora thake tahole setai use korbe, nahole notun kore model create korbe ("restaurant" collection name e).

export const Restaurant =
  (models.Restaurant as mongoose.Model<RestaurantDocument>) ||
  model<RestaurantDocument>("Restaurant", RestaurantSchema, "restaurant");

export default Restaurant;