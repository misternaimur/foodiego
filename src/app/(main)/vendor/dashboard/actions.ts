"use server";

import { getOptionalSession } from "@/lib/dal";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import jwt from "jsonwebtoken";

const getApiToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET || "rtvCXlkDa5KJk4qowNg/VzgucBKlzeRZ1OOzbSWkXMw=";
  return jwt.sign({ userId, role }, secret, { expiresIn: "1h" });
};

export async function fetchVendorOrdersAction() {
  const session = await getOptionalSession();
  if (!session || session.role !== "restaurant") return null;

  await dbConnect();
  const user = await User.findOne({ uid: session.userId }).lean();
  if (!user) return null;

  const token = getApiToken(user._id.toString(), user.role);
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || apiUrl === "..." || apiUrl === "") {
    apiUrl = "http://localhost:8000";
  }

  try {
    // First fetch the restaurant profile to get restaurantId
    const restRes = await fetch(`${apiUrl}/api/restaurants/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const restData = await restRes.json();
    
    if (!restRes.ok || !restData.data) {
        return null;
    }
    
    const restaurantId = restData.data._id;

    // Now fetch the orders
    const ordersRes = await fetch(`${apiUrl}/api/orders/restaurant/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const ordersData = await ordersRes.json();
    return ordersData.data || [];
  } catch (error) {
    console.error("Failed to fetch vendor orders:", error);
    return [];
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  const session = await getOptionalSession();
  if (!session || session.role !== "restaurant") return { success: false };

  await dbConnect();
  const user = await User.findOne({ uid: session.userId }).lean();
  if (!user) return { success: false };

  const token = getApiToken(user._id.toString(), user.role);
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || apiUrl === "..." || apiUrl === "") {
    apiUrl = "http://localhost:8000";
  }

  try {
    const res = await fetch(`${apiUrl}/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
