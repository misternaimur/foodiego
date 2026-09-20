import mongoose, { Schema, models, model } from "mongoose";

// ============================================================
// UPDATE (menu-category real-data fix): foodiego-backend's MenuItem model
// stores `category` as an ObjectId reference into its own "category"
// collection (see foodiego-backend/models/Category.js and MenuItem.js),
// not a plain string — only vendor-created items (via this app's own
// /api/v1/vendor/menu/create) write `category` as a plain string. This
// model mirrors the backend's Category schema so the catalog route can
// resolve those references back to real category names. See the bug this
// fixes in src/app/api/v1/catalog/restaurants/route.ts's comment: reading
// an ObjectId as if it were already a name string crashed with
// "name.toLowerCase is not a function" as soon as a real seeded
// restaurant (not just a manually-created test one) was requested.
// ============================================================
export interface CategoryDocument {
  _id: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Category =
  (models.Category as mongoose.Model<CategoryDocument>) ||
  model<CategoryDocument>("Category", CategorySchema, "category");

export default Category;
