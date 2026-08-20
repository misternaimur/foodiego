import mongoose, { Schema, models, model } from "mongoose";
import { ROLES, type Role } from "@/lib/definitions";

const ALL_ROLES: Role[] = [...ROLES, "admin"];

export interface UserDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ALL_ROLES, required: true },
  },
  { timestamps: true }
);

export const User =
  (models.User as mongoose.Model<UserDocument>) || model<UserDocument>("User", UserSchema);

export default User;
