import mongoose, { Schema, models, model } from "mongoose";

// Rider er approval status-gulo ("pending", "approved", "rejected") define korche const array ebong type safety er jonno type.
export const RIDER_STATUSES = ["pending", "approved", "rejected"] as const;
export type RiderStatus = (typeof RIDER_STATUSES)[number];

// Rider er vehicle types-gulo ("bicycle", "motorcycle", "scooter", "car") define korche strict type safety er jonno.
export const RIDER_VEHICLE_TYPES = ["bicycle", "motorcycle", "scooter", "car"] as const;
export type RiderVehicleType = (typeof RIDER_VEHICLE_TYPES)[number];

// RiderDocument interface-ti database theke asha ekta Rider document er structure, fields ebong data types ki hobe ta typescript ke bole dey.
export interface RiderDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Main User model er sathe link korar jonno reference ID
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  vehicleType: RiderVehicleType;
  vehicleNumber?: string; // Optional vehicle registration number
  licenseNumber: string;
  photoUrl?: string;     // Cloudinary theke asha rider profile picture/document photo URL
  isAvailable: boolean;  // Rider ekhon delivery-r jonno available naki tar status (default: false)
  status: RiderStatus;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema define korche database e data kivabe store hobe, konta required, konta lowercase hobe ebong validation rules ki thakbe.
const RiderSchema = new Schema<RiderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    vehicleType: { type: String, enum: RIDER_VEHICLE_TYPES, required: true },
    vehicleNumber: { type: String, trim: true },
    licenseNumber: { type: String, required: true, trim: true },
    photoUrl: { type: String, trim: true },
    isAvailable: { type: Boolean, default: false },
    status: { type: String, enum: RIDER_STATUSES, default: "pending" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true } // Automatically createdAt ebong updatedAt field handle korbe
);

// Next.js er hot-reload e 'OverwriteModelError' prevent korar standard pattern.
// Jodi 'Rider' model age theke compile kora thake tahole setai use korbe, nahole notun model create korbe ("rider" collection name er under e).
export const Rider =
  (models.Rider as mongoose.Model<RiderDocument>) ||
  model<RiderDocument>("Rider", RiderSchema, "rider");

export default Rider;