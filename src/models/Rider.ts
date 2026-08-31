import mongoose, { Schema, models, model } from "mongoose";

export const RIDER_STATUSES = ["pending", "approved", "rejected"] as const;
export type RiderStatus = (typeof RIDER_STATUSES)[number];

export const RIDER_VEHICLE_TYPES = ["bicycle", "motorcycle", "scooter", "car"] as const;
export type RiderVehicleType = (typeof RIDER_VEHICLE_TYPES)[number];

export interface RiderDocument {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  vehicleType: RiderVehicleType;
  vehicleNumber?: string;
  licenseNumber: string;
  photoUrl?: string;
  isAvailable: boolean;
  status: RiderStatus;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

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
  { timestamps: true }
);

export const Rider =
  (models.Rider as mongoose.Model<RiderDocument>) ||
  model<RiderDocument>("Rider", RiderSchema, "rider");

export default Rider;
