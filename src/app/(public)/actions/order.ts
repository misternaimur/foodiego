"use server";

import { getOptionalSession } from "@/lib/dal";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

export async function createOrderAction(orderData: any) {
  const session = await getOptionalSession();
  
  if (!session) {
    return { success: false, message: "You must be logged in to place an order." };
  }

  await dbConnect();
  const user = await User.findOne({ uid: session.userId }).lean();
  
  if (!user) {
    return { success: false, message: "User not found." };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  try {
    const response = await fetch(`${apiUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...orderData,
        customerId: user._id.toString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Failed to create order." };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred." };
  }
}
