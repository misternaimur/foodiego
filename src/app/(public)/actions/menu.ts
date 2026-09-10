// src/app/(public)/actions/menu.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import MenuItem from '@/models/MenuItem';
import Restaurant from '@/models/Restaurant';
import { revalidatePath } from 'next/cache';

export async function createMenuItemAction(restaurantId: string, formData: {
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
}) {
  try {
    await dbConnect();

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return { success: false, message: 'Restaurant not found' };
    }

    const newItem = await MenuItem.create({
      restaurantId,
      ...formData,
    });

    revalidatePath(`/vendor/create-menu`);
    return { success: true, data: JSON.parse(JSON.stringify(newItem)) };
  } catch (error: ) {
    return { success: false, message: error.message };
  }
}

export async function getVendorMenuItems(restaurantId: string) {
  try {
    await dbConnect();
    const items = await MenuItem.find({ restaurantId, isActive: { $ne: false } }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(items)) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}