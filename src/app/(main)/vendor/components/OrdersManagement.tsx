"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  X,
  Phone,
  MapPin,
  Mail,
  User,
  ChevronDown,
  Filter,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order } from "@/hooks/useVendorQueries";

const statusTabs = [
  { id: "new" as const, label: "New Orders", count: 4 },
  { id: "preparing" as const, label: "Active Orders", count: 2 },
  { id: "ready" as const, label: "Ready Orders", count: 1 },
  { id: "picked_up" as const, label: "Picked Up", count: 0 },
];

const statusLabels: Record<Order["status"], string> = {
  new: "New",
  preparing: "Preparing",
  ready: "Ready",
  picked_up: "Picked Up",
  delivered: "Delivered",
  rejected: "Rejected",
};

const statusColors: Record<Order["status"], string> = {
  new: "bg-blue-50 text-blue-700 border border-blue-200",
  preparing: "bg-amber-50 text-amber-700 border border-amber-200",
  ready: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  picked_up: "bg-violet-50 text-violet-700 border border-violet-200",
  delivered: "bg-teal-50 text-teal-700 border border-teal-200",
  rejected: "bg-rose-50 text-rose-700 border border-rose-200",
};

const paymentMethodLabels: Record<string, string> = {
  bKash: "bKash",
  cash: "Cash on Delivery",
  card: "Card",
  cod: "Cash on Delivery",
};

export default function OrdersManagement() {
  const [activeTab, setActiveTab] = useState<Order["status"]>("new");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateFilter, setDateFilter] = useState("Today");
  const [filterStatus, setFilterStatus] = useState("New");

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/vendor/orders", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    staleTime: 1000 * 60 * 2,
  });

  const orderMutation = useMutation({
    mutationFn: async ({ orderId, action }: { orderId: string; action: string }) => {
      const res = await fetch("/api/vendor/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      return res.json();
    },
    onMutate: async ({ orderId, action }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      const previous = queryClient.getQueryData<Order[]>(["orders"]);
      queryClient.setQueryData(["orders"], (old: Order[] | undefined) =>
        old
          ? old.map((o) =>
              o.id === orderId
                ? { ...o, status: action === "accept" ? "preparing" : action === "reject" ? "rejected" : o.status }
                : o
            )
          : []
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["orders"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleAccept = (order: Order) => {
    orderMutation.mutate({ orderId: order.id, action: "accept" });
  };

  const handleReject = (order: Order) => {
    orderMutation.mutate({ orderId: order.id, action: "reject" });
  };

  if (!selectedOrder && orders.length > 0) {
    setSelectedOrder(orders[0]);
  }

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "new") return order.status === "new";
    if (activeTab === "preparing") return ["preparing", "ready", "picked_up"].includes(order.status);
    if (activeTab === "ready") return order.status === "ready";
    if (activeTab === "picked_up") return order.status === "picked_up";
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-4rem-3.5rem)] gap-6">
      <div className="flex-1 min-w-0 overflow-y-auto pr-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none rounded-xl border border-[#E5E7EB] bg-white pl-9 pr-3 py-2 text-sm text-gray-700 focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-[#10B981]/20"
              >
                <option>Today</option>
                <option>Yesterday</option>
                <option>Last 7 days</option>
              </select>
              <Calendar
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
            <button
              onClick={() => setFilterStatus("")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter size={15} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {statusTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#10B981] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-[#E5E7EB]"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {filterStatus && (
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              Status: {filterStatus}
              <button
                onClick={() => setFilterStatus("")}
                className="ml-1 rounded-full p-0.5 text-gray-500 hover:bg-gray-200"
              >
                <X size={10} />
              </button>
            </span>
            <button
              onClick={() => setFilterStatus("")}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="space-y-3">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                layoutId={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSelectedOrder(order)}
                className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-xs transition-all hover:shadow-md ${
                  selectedOrder?.id === order.id
                    ? "border-[#10B981] ring-2 ring-[#10B981]/10"
                    : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{order.id}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${statusColors[order.status]}`}
                      >
                        {statusLabels[order.status]}
                      </span>
                      <span className="text-xs text-gray-400">• {order.timeAgo}</span>
                    </div>

                    <div className="flex items-center gap-4 gap-y-1 text-sm">
                      <span className="font-medium text-gray-700">{order.customer.name}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="font-semibold text-gray-900">৳{order.total.toLocaleString()}</span>
                    </div>

                    <div className="text-sm text-gray-500">
                      {order.items.map((item, idx) => (
                        <span key={item.id}>
                          {idx > 0 && ", "}
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="flex items-start gap-1.5 text-xs text-gray-500">
                        <MessageCircle size={12} className="mt-0.5 shrink-0" />
                        <span>{order.notes}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {paymentMethodLabels[order.paymentMethod]}
                        {order.paymentStatus === "paid" && " (Paid)"}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(order);
                      }}
                      className="rounded-xl border border-[#E57373]/30 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(order);
                      }}
                      className="rounded-xl bg-[#10B981] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#059669] transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredOrders.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag size={48} className="text-gray-200 mb-3" />
              <p className="text-sm text-gray-500">No orders in this section.</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-0 min-w-[400px] max-w-[520px] overflow-y-auto">
        <AnimatePresence>
          {selectedOrder ? (
            <motion.div
              key={selectedOrder.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.15 }}
              className="flex h-full flex-col gap-4"
            >
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedOrder.id}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Placed: {selectedOrder.createdAt} ({selectedOrder.timeAgo})
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${statusColors[selectedOrder.status]}`}
                  >
                    {statusLabels[selectedOrder.status]}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Customer
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-700 ring-1 ring-gray-200">
                    {selectedOrder.customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedOrder.customer.name}</p>
                    <p className="text-xs text-gray-500">{selectedOrder.customer.orderCount} Orders</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-700">{selectedOrder.customer.phone}</span>
                    <a
                      href={`tel:${selectedOrder.customer.phone.replace(/\s/g, "")}`}
                      className="ml-auto text-xs font-semibold text-[#10B981] hover:text-[#059669]"
                    >
                      Call
                    </a>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{selectedOrder.customer.address}</span>
                  </div>
                  {selectedOrder.customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-700">{selectedOrder.customer.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-16 w-16 shrink-0 rounded-xl bg-gray-100 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm font-semibold text-gray-900">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {item.quantity}x • ৳{item.price.toLocaleString()} each
                        </p>
                        {item.addons && item.addons.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {item.addons.map((addon) => (
                              <div key={addon.name} className="flex justify-between text-xs">
                                <span className="text-gray-500">+{addon.name}</span>
                                <span className="text-gray-700">৳{addon.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Payment Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">৳{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900 font-medium">
                      ৳{selectedOrder.deliveryFee > 0 ? selectedOrder.deliveryFee.toLocaleString() : "—"}
                    </span>
                  </div>
                  <div className="border-t border-[#E5E7EB] pt-2 mt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-[#10B981]">৳{selectedOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-600">Payment</span>
                    <span
                      className={`font-medium ${
                        selectedOrder.paymentStatus === "paid"
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {paymentMethodLabels[selectedOrder.paymentMethod]} •{" "}
                      {selectedOrder.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              <motion.div
                className="mt-auto flex gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <button
                  onClick={() => handleReject(selectedOrder)}
                  className="flex-1 rounded-xl border border-[#EF4444] bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
                >
                  Reject Order
                </button>
                <button
                  onClick={() => handleAccept(selectedOrder)}
                  className="flex-1 rounded-xl bg-[#10B981] px-4 py-3 text-sm font-semibold text-white hover:bg-[#059669] transition-colors shadow-lg shadow-[#10B981]/20"
                >
                  Accept Order
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-40 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-6"
            >
              <div className="text-center">
                <ShoppingBag size={48} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Select an order to view details</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
