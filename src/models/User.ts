import mongoose, { Schema, models, model } from "mongoose";
import { ROLES, type Role } from "@/lib/definitions";

const ALL_ROLES: Role[] = [...ROLES, "admin"];

export interface UserDocument {
  _id: mongoose.Types.ObjectId;
  uid: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    role: { type: String, enum: ALL_ROLES, required: true },
  },
  { timestamps: true }
);

export const User =
  (models.User as mongoose.Model<UserDocument>) || model<UserDocument>("User", UserSchema);

export default User;
