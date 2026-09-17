import "server-only";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User"; 

const Order = mongoose.models.Order || mongoose.model("Order", new mongoose.Schema({}, { strict: false }));

interface UserProfile {
  _id: { toString(): string };
  name?: string;
  email: string;
  phone?: string;
  role: string;
}

interface OrderSummary {
  _id: { toString(): string };
  restaurantName?: string;
  totalAmount?: number;
  status: string;
  createdAt: Date | string;
}

export interface ClientProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  addressesCount?: number;
  savedAddresses?: Array<{
    id: string;
    title: string;
    address: string;
    isDefault: boolean;
  }>;
}

export async function getClientBadgeCounts(clientId?: string): Promise<Record<string, number>> {
  await dbConnect();

  try {
    if (!clientId) {
      return { activeOrders: 0 };
    }

    const activeOrdersCount = await Order.countDocuments({
      userId: clientId,
      status: { $in: ["Pending", "Accepted", "Preparing", "Ready", "Picked Up"] },
    });

    return {
      activeOrders: activeOrdersCount,
    };
  } catch (error) {
    console.error("Error fetching client badge counts:", error);
    return { activeOrders: 0 };
  }
}

export async function getClientDashboardData(clientId: string) {
  await dbConnect();

  try {
    const user = (await User.findById(clientId).select("-password").lean()) as UserProfile | null;
    if (!user) {
      throw new Error("Client not found");
    }

    const recentOrders = (await Order.find({ userId: clientId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()) as OrderSummary[];

    const activeOrdersCount = await Order.countDocuments({
      userId: clientId,
      status: { $in: ["Pending", "Accepted", "Preparing", "Ready", "Picked Up"] },
    });

    return {
      profile: {
        id: user._id.toString(),
        name: user.name || "Valued Customer",
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      activeOrdersCount,
      recentOrders: recentOrders.map((order: OrderSummary) => ({
        id: order._id.toString(),
        restaurantName: order.restaurantName || "Restaurant",
        total: order.totalAmount || 0,
        status: order.status,
        date: new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      })),
    };
  } catch (error) {
    console.error("Error fetching client dashboard data:", error);
    throw new Error("Failed to load client dashboard data");
  }
}

export async function updateClientProfile(clientId: string, updateData: { name?: string; phone?: string }) {
  await dbConnect();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      clientId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password").lean();

    if (!updatedUser) {
      throw new Error("Client not found");
    }

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Error updating client profile:", error);
    throw new Error("Failed to update client profile");
  }
}