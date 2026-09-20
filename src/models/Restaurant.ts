import mongoose, { Schema, models, model } from "mongoose";

// Const array and TypeScript type define korche restaurant er approval statuses ("pending", "approved", "rejected") er jonno, jate type safety thake.
export const RESTAURANT_STATUSES = ["pending", "approved", "rejected", "suspended"] as const;
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
  // UPDATE (vendor-payments real-data fix): the vendor Payments tab's
  // "Available Balance" used to come from a process-global `mockBalance`
  // variable in src/app/api/v1/vendor/payments/route.ts that reset on every
  // server restart and was shared across every vendor. Real balance is now
  // computed as (lifetime net earnings from delivered orders) minus this
  // persisted field, which the withdraw route increments on each withdrawal
  // request. There's still no real bKash/Nagad/bank payout rail wired up
  // (that needs real merchant credentials), so a "withdrawal" only reduces
  // this internal ledger — it does not move real money.
  walletWithdrawn?: number;
  // UPDATE (per-vendor-commission fix): every commission calculation used to
  // read a single hardcoded PLATFORM_COMMISSION_RATE constant (15%) with no
  // way to set one vendor's rate differently from another's. Undefined
  // means "use the 15% platform default" — see commissionRateOf() in
  // src/lib/commission.ts, which every route that computes commission now
  // goes through instead of each defining its own constant.
  commissionRate?: number;
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
    walletWithdrawn: { type: Number, default: 0 },
    commissionRate: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true, strict: false }
);

// Next.js hot-reload environment e model overwrite error (OverwriteModelError) avoid korar standard pattern.
// Jodi model age theke compile kora thake tahole setai use korbe, nahole notun kore model create korbe ("restaurant" collection name e).

export const Restaurant =
  (models.Restaurant as mongoose.Model<RestaurantDocument>) ||
  model<RestaurantDocument>("Restaurant", RestaurantSchema, "restaurant");

export default Restaurant;