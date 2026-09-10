import React from 'react';
import { getOptionalSession } from "@/lib/dal";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import jwt from "jsonwebtoken";
import { redirect } from 'next/navigation';
import { Clock } from 'lucide-react';

const getApiToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET || "rtvCXlkDa5KJk4qowNg/VzgucBKlzeRZ1OOzbSWkXMw=";
  return jwt.sign({ userId, role }, secret, { expiresIn: "1h" });
};

async function getRecentOrders() {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") return [];

  await dbConnect();
  const user = await User.findOne({ uid: session.userId }).lean();
  if (!user) return [];

  const token = getApiToken(user._id.toString(), user.role);
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || apiUrl === "..." || apiUrl === "") {
    apiUrl = "http://localhost:8000";
  }

  try {
    const res = await fetch(`${apiUrl}/api/orders/recent`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function AdminDashboardPage() {
  const session = await getOptionalSession();
  if (!session || session.role !== "admin") {
    redirect("/");
  }

  const recentOrders = await getRecentOrders();

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">Welcome back, {session.name}.</p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Recent Platform Orders</h2>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
            No recent orders found on the platform.
          </p>
        ) : (
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {order.restaurantId?.restaurantName || 'Unknown Restaurant'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}