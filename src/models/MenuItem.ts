import mongoose, { Schema, models, model } from "mongoose";

export interface MenuItemAddon {
  name: string;
  price: number;
}

export interface MenuItemDocument {
  _id: mongoose.Types.ObjectId;
  // UPDATE (real food-catalog fix): this model used to point at its own
  // "menuitems" collection (lowercase), which only ever held a handful of
  // manual test rows. foodiego-backend's seed script (scripts/seed-restaurants.js)
  // populated a *different*, much larger collection — "menuItem" (camelCase)
  // — with real menu items for real seeded restaurants, using `restaurantId`
  // instead of `vendorId` as the link field. Customers were browsing static
  // demo JSON (public/api/foods.json) instead of either collection, so
  // neither the vendor dashboard's own items nor the seeded catalog ever
  // reached a shopper.
  //
  // Fix: this model now points at the same "menuItem" collection foodiego-backend
  // uses, so vendor-created items and the seeded catalog live in one place
  // that customers can actually browse. `vendorId` is kept as the field new
  // vendor-created items are written with (see src/app/api/v1/vendor/menu/create's
  // route); `restaurantId` is the field the seeded documents already use.
  // Read code should treat them as synonyms — see restaurantIdOf() below.
  vendorId?: mongoose.Types.ObjectId;
  restaurantId?: mongoose.Types.ObjectId;
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
    vendorId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
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
  // strict: false so the many seeded documents that carry extra/older fields
  // (e.g. no `addons`, no `isActive`) still read back without Mongoose
  // stripping anything — we only ever read this collection here besides the
  // vendor-menu write path, which explicitly sets the fields it needs.
  { timestamps: true, strict: false }
);

/** Either link field, whichever this particular document happens to have. */
export function restaurantIdOf(item: Pick<MenuItemDocument, "vendorId" | "restaurantId">): mongoose.Types.ObjectId | undefined {
  return item.restaurantId ?? item.vendorId;
}

export const MenuItem =
  (models.MenuItem as mongoose.Model<MenuItemDocument>) ||
  model<MenuItemDocument>("MenuItem", MenuItemSchema, "menuItem");

export default MenuItem;
