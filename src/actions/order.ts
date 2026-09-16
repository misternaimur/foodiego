"use server";

import { getOptionalSession } from "@/lib/dal";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

// Define a strict TypeScript interface for the order data instead of using `any`
interface OrderInputData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  totalAmount: number;
  [key: string]: unknown; // Allows additional optional fields if needed
}

export async function createOrderAction(orderData: OrderInputData) {
  const session = await getOptionalSession();
  
  if (!session?.userId) {
    return { success: false, message: "You must be logged in to place an order." };
  }

  await dbConnect();
  
  // Explicitly select only the fields needed to improve query performance
  const user = await User.findOne({ uid: session.userId }).select("_id").lean();
  
  if (!user) {
    return { success: false, message: "User not found." };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  
  if (!apiUrl || apiUrl === "...") {
    return { success: false, message: "Server configuration error: API URL is not defined." };
  }
  
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

    // Handle non-JSON responses safely (e.g., 500 HTML error pages from backend)
    const contentType = response.headers.get("content-type");
    const data = contentType && contentType.includes("application/json") 
      ? await response.json() 
      : { message: await response.text() };

    if (!response.ok) {
      return { success: false, message: data.message || "Failed to create order." };
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message: errorMessage };
  }
}