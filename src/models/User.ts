import mongoose, { Schema, models, model } from "mongoose";
import { ROLES, type Role } from "@/lib/definitions";

// Firebase/App definitions theke ROLES gulo import kore tar sathe "admin" role-ti add kore ekta comprehensive role array (`ALL_ROLES`) banano hocche.
const ALL_ROLES: Role[] = [...ROLES, "admin"];

// UserDocument interface-ti database theke asha ekta User document er structure ebong TypeScript types define kore.
export interface UserDocument {
  _id: mongoose.Types.ObjectId;
  uid: string; // Firebase Authentication theke pawa unique user ID (Firebase UID)
  name: string;
  email: string;
  role: Role;   // User er role (e.g., customer, vendor, rider, admin)
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema define korche database e user data kivabe store hobe, unique constraints, ebong validation rules.
const UserSchema = new Schema<UserDocument>(
  {
    uid: { type: String, required: true, unique: true, index: true }, // Fast lookups-er jonno uid-er upore index kora hoyeche
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    role: { type: String, enum: ALL_ROLES, required: true }, // Role obosshoi ALL_ROLES array er modhye ekta hote hobe
  },
  { timestamps: true } // Auto-generates createdAt and updatedAt fields
);

// Next.js development-e hot-reload er karone duplicate model compilation error (OverwriteModelError) theke bachar standard pattern.
export const User =
  (models.User as mongoose.Model<UserDocument>) || model<UserDocument>("User", UserSchema);

export default User;