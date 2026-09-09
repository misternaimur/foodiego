"use client";

import React, { useEffect, useState } from "react";
import { fetchVendorOrdersAction, updateOrderStatusAction } from "./actions";
import { Check, X, Clock, RefreshCw } from "lucide-react";

export default function OrdersManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    setRefreshing(true);
    const data = await fetchVendorOrdersAction();
    if (data) setOrders(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadOrders();
    // Polling every 30s
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const res = await updateOrderStatusAction(orderId, status);
    if (res.success) {
      // Optimistically update
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } else {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="mt-8 text-sm text-gray-500">Loading orders...</div>;
  }

  const incomingOrders = orders.filter((o) => o.status === "pending");
  const currentOrders = orders.filter((o) =>
    ["confirmed", "preparing", "out_for_delivery"].includes(o.status)
  );

  return (
    <div className="mt-8 space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* INCOMING ORDERS */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-gray-800">
            Incoming Orders ({incomingOrders.length})
          </h3>
        </div>
        
        {incomingOrders.length === 0 ? (
          <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
            No new incoming orders at the moment.
          </p>
        ) : (
          <div className="grid gap-4">
            {incomingOrders.map((order) => (
              <div key={order._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Pending</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{order.items.length} items • ${order.totalAmount.toFixed(2)} • {order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod}</p>
                  <p className="text-xs text-gray-500">
                    Customer: {order.customerId?.name || 'Guest'} • Address: {order.deliveryAddress}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleUpdateStatus(order._id, "cancelled")}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order._id, "confirmed")}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CURRENT ORDERS */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <h3 className="text-lg font-bold text-gray-800">
            Current Orders ({currentOrders.length})
          </h3>
        </div>

        {currentOrders.length === 0 ? (
          <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
            No current active orders.
          </p>
        ) : (
          <div className="grid gap-4">
            {currentOrders.map((order) => (
              <div key={order._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 capitalize">{order.status.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{order.items.length} items • ${order.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    Customer: {order.customerId?.name || 'Guest'} • Address: {order.deliveryAddress}
                  </p>
                </div>
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "preparing")}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    Mark Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "out_for_delivery")}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    Out for Delivery
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
