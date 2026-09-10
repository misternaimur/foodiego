// src/models/MenuItem.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category?: mongoose.Types.ObjectId;
  isAvailable: boolean;
  isActive: boolean;
  imageUrl?: string;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isAvailable: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', menuItemSchema, 'menuItem');