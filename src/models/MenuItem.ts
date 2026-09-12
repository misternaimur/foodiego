import mongoose, { Schema, models, model } from "mongoose";

export interface MenuItemAddon {
  name: string;
  price: number;
}

export interface MenuItemDocument {
  _id: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  addons: MenuItemAddon[];
  isActive: boolean;
  ordersCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<MenuItemDocument>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    addons: [
      {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    isActive: { type: Boolean, default: true },
    ordersCount: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

export const MenuItem =
  (models.MenuItem as mongoose.Model<MenuItemDocument>) ||
  model<MenuItemDocument>("MenuItem", MenuItemSchema, "menuitems");

export default MenuItem;
