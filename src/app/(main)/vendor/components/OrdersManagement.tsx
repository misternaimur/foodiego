"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
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
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  MoreHorizontal,
  Phone as PhoneIcon,
  Check,
  ChefHat,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order } from "@/hooks/useVendorQueries";
import { springTransition, staggerContainer, staggerItem } from "@/app/(main)/vendor/components/motion";

const statusLabels: Record<Order["status"], string> = {
  new: "New",
  preparing: "Preparing",
  ready: "Ready",
  picked_up: "Picked Up",
  delivered: "Delivered",
  rejected: "Rejected",
};

const statusColors: Record<Order["status"], string> = {
  new: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  preparing: "bg-amber-50 text-amber-700 border border-amber-200",
  ready: "bg-blue-50 text-blue-700 border border-blue-200",
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

const ORDER_TABS = [
  { id: "new" as const, label: "New Orders" },
  { id: "preparing" as const, label: "Active Orders" },
  { id: "ready" as const, label: "Ready Orders" },
  { id: "picked_up" as const, label: "Order History" },
];

export default function OrdersManagement() {
  const [activeTab, setActiveTab] = useState<Order["status"]>("new");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateFilter, setDateFilter] = useState("Today");
  const [filterStatus, setFilterStatus] = useState("");
  const initialOrderSet = useRef(false);

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
      const optimisticStatus: Record<string, Order["status"]> = {
        accept: "preparing",
        reject: "rejected",
        ready: "ready",
      };
      queryClient.setQueryData(["orders"], (old: Order[] | undefined) =>
        old
          ? old.map((o) => (o.id === orderId ? { ...o, status: optimisticStatus[action] ?? o.status } : o))
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

  // UPDATE (order-lifecycle fix): previously there was no way at all to move
  // an order past "preparing" from the vendor UI — the kitchen finishing
  // food had no button to press, so orders got stuck. This is the vendor
  // half of the fix; the rider half (Picked Up / Delivered) lives in
  // RiderDashboard.tsx / rider/deliveries.
  const handleMarkReady = (order: Order) => {
    orderMutation.mutate({ orderId: order.id, action: "ready" });
  };

  useEffect(() => {
    if (!initialOrderSet.current && !selectedOrder && orders.length > 0) {
      initialOrderSet.current = true;
      setSelectedOrder(orders[0]);
    }
  }, [selectedOrder, orders]);

  const handleTabChange = (tabKey: Order["status"]) => {
    if (tabKey) setActiveTab(tabKey);
  };

  const safeTab = activeTab || "new";

  const currentOrders = orders.filter((order: Order) => order.status === safeTab);

  const formatCurrency = (value?: number | null) => `$${(value ?? 0).toLocaleString()}`;

  const getTabCount = (status: Order["status"]) => orders.filter((o) => o.status === status).length;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      {/* Header & Filter Bar */}
      <motion.div variants={staggerItem} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">Order dispatch center</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Orders Management</h1>
          <p className="mt-1 text-sm text-slate-500">Track, accept, and manage customer orders in real-time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Calendar size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200/70 bg-white/80 backdrop-blur-sm py-2.5 pl-9 pr-9 text-sm font-semibold text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 sm:w-44"
            >
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 days</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </motion.div>

      {/* Sub-navigation Tabs */}
      <motion.div variants={staggerItem} className="flex flex-wrap gap-4 border-b border-slate-200 pb-2 mb-4">
        {ORDER_TABS.map((tab) => {
          const count = getTabCount(tab.id);
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
              onClick={() => handleTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-2 py-3 text-sm font-semibold transition-colors border-b-2 ${isActive ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold ${isActive ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}>
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Filter Chips Bar */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={filterStatus || "none"}
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={springTransition}
          className="mb-4"
        >
          {filterStatus && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                Status: {filterStatus}
                <button onClick={() => setFilterStatus("")} className="ml-1 rounded-full p-0.5 text-slate-500 hover:bg-slate-200">
                  <X size={12} />
                </button>
              </span>
              <button onClick={() => setFilterStatus("")} className="text-sm font-semibold text-rose-600 hover:text-rose-800">Clear all</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Main Content Grid */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={springTransition}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                <p className="mt-2 text-sm text-slate-500">Loading orders...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Order Cards List */}
              <div className="lg:col-span-3 space-y-3 min-h-0">
                <AnimatePresence>
                  {currentOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      variants={staggerItem}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={springTransition}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all ${
                        selectedOrder?.id === order.id
                          ? "border-l-4 border-emerald-500 ring-1 ring-emerald-500/20"
                          : "hover:border-slate-300"
                      }`}
                    >
                      {/* Top Row */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-black text-lg text-slate-900">{order.id}</span>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${statusColors[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                            <span className="text-sm font-semibold text-rose-600">{order.timeAgo || "Just now"}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={18} className="text-slate-400 hover:text-slate-600" />
                        </div>
                      </div>

                      {/* Metadata Row */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="p-3 rounded-lg bg-slate-50/50">
                          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Customer</p>
                          <p className="mt-0.5 font-semibold text-slate-900">{order.customer?.name || "Unknown"}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-50/50">
                          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Payment</p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className={order.paymentStatus === "paid" ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-bold" : "inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-xs font-bold"}>
                              {order.paymentStatus === "paid" && <CheckCircle size={10} className="text-emerald-600" />}
                              {paymentMethodLabels[order.paymentMethod || "cash"]}
                              {order.paymentStatus === "paid" && <span className="text-emerald-700">(Paid)</span>}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Item Summary Box */}
                      <div className="p-3 rounded-lg bg-slate-50/50 mb-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-sm text-slate-600 flex-1 min-w-0 truncate">
                            {order.items?.map((item, idx) => (
                              <span key={item.id || idx}>
                                {idx > 0 && ", "}
                                {item.quantity}x {item.name}
                              </span>
                            )) ?? "No items"}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-sm font-black text-slate-900">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Actions — vary by status; a "ready"/"picked_up"/"delivered"/"rejected" order has nothing left for the vendor to do */}
                      {order.status === "new" && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => { e.stopPropagation(); handleReject(order); }}
                            className="flex-1 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <X size={14} />
                            Reject
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => { e.stopPropagation(); handleAccept(order); }}
                            className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-2"
                          >
                            <Check size={14} />
                            Accept Order
                          </motion.button>
                        </div>
                      )}
                      {order.status === "preparing" && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => { e.stopPropagation(); handleMarkReady(order); }}
                            className="flex-1 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2"
                          >
                            <ChefHat size={14} />
                            Mark Ready for Pickup
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {currentOrders.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 px-6 py-12 text-center shadow-sm">
                    <ShoppingBag size={48} className="text-slate-300 mb-3" />
                    <p className="text-sm text-slate-500">No {statusLabels[safeTab].toLowerCase()} orders.</p>
                  </div>
                )}
              </div>

              {/* Right Order Inspector Drawer */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait" initial={false}>
                  {selectedOrder ? (
                    <motion.div
                      key={selectedOrder.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={springTransition}
                      className="sticky top-24 lg:top-6 h-[calc(100vh-8rem)] flex flex-col gap-4 overflow-y-auto"
                    >
                      {/* Inspector Header */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-xl font-black text-slate-900">Order {selectedOrder.id}</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Placed: {selectedOrder.createdAt} ({selectedOrder.timeAgo || "Just now"})
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${statusColors[selectedOrder.status]}`}>
                              {statusLabels[selectedOrder.status]}
                            </span>
                            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                              <MoreHorizontal size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Customer Card */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Customer</h3>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-xl font-bold text-emerald-700 ring-1 ring-emerald-200">
                              {(selectedOrder.customer?.name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-lg text-slate-900">{selectedOrder.customer?.name || "Unknown"}</p>
                            <p className="mt-0.5 text-sm text-slate-500">Customer since 2022 • {(selectedOrder.customer?.orderCount ?? 0).toLocaleString()} Orders</p>
                            <div className="mt-4 space-y-2 text-sm">
                              {selectedOrder.customer?.phone && (
                                <div className="flex items-center gap-2">
                                  <PhoneIcon size={16} className="text-emerald-500" />
                                  <span className="text-slate-700">{selectedOrder.customer.phone}</span>
                                  <a href={`tel:${selectedOrder.customer.phone}`} className="ml-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700">Call</a>
                                </div>
                              )}
                              {selectedOrder.customer?.address && (
                                <div className="flex items-start gap-2">
                                  <MapPin size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                  <span className="text-slate-700">{selectedOrder.customer.address}</span>
                                </div>
                              )}
                              {selectedOrder.customer?.email && (
                                <div className="flex items-center gap-2">
                                  <Mail size={16} className="text-emerald-500" />
                                  <span className="text-slate-700">{selectedOrder.customer.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Section */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">ORDER ITEMS</h3>
                        <div className="space-y-3">
                          {selectedOrder.items?.map((item) => (
                            <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-slate-50/50">
                              <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 overflow-hidden">
                                {item.image ? (
                                  <Image src={item.image} alt={item.name} width={64} height={64} className="h-full w-full object-cover rounded-xl" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-400"><Truck size={20} /></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                                  <p className="text-sm font-black text-slate-900">{formatCurrency((item.price ?? 0) * (item.quantity ?? 0))}</p>
                                </div>
                                <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-slate-500">
                                  <span>{item.quantity ?? 0}x • ${(item.price ?? 0).toLocaleString()} each</span>
                                  {item.addons && item.addons.length > 0 && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5">
                                      <span>Add</span>
                                      {item.addons.map((addon) => (
                                        <span key={addon.name} className="font-medium text-emerald-700">
                                          {addon.name} (+${addon.price})
                                        </span>
                                      ))}
                                    </span>
                                  )}
                                </div>
                                {item.specialInstructions && (
                                  <p className="mt-1.5 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-800">
                                    <span className="font-semibold">Note:</span> {item.specialInstructions}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Instructions — captured at checkout, previously silently dropped */}
                      {selectedOrder.notes && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                          <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Delivery Instructions</h3>
                          <p className="text-sm text-amber-900">{selectedOrder.notes}</p>
                        </div>
                      )}

                      {/* Payment Summary Box */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">PAYMENT SUMMARY</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-medium text-slate-900">{formatCurrency(selectedOrder.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Delivery Fee</span>
                            <span className="font-medium text-slate-900">{(selectedOrder.deliveryFee ?? 0) > 0 ? formatCurrency(selectedOrder.deliveryFee) : "Free"}</span>
                          </div>
                          <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between">
                            <span className="font-semibold text-lg text-slate-900">Total</span>
                            <span className="font-bold text-xl text-emerald-600">{formatCurrency(selectedOrder.total)}</span>
                          </div>
                          <div className="pt-2 flex justify-between text-sm">
                            <span className="text-slate-600">Payment</span>
                            <span className={selectedOrder.paymentStatus === "paid" ? "font-medium text-emerald-700" : "font-medium text-amber-700"}>
                              {paymentMethodLabels[selectedOrder.paymentMethod || "cash"]} • {selectedOrder.paymentStatus === "paid" ? "Paid" : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons — vary by status */}
                      <div className="mt-auto flex flex-col gap-3 pt-2">
                        {selectedOrder.status === "new" && (
                          <>
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAccept(selectedOrder)}
                              className="w-full rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-semibold text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                              <CheckCircle size={18} />
                              Accept Order
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleReject(selectedOrder)}
                              className="w-full rounded-xl border-2 border-rose-300 bg-white px-6 py-3.5 text-base font-semibold text-rose-700 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                            >
                              <X size={18} />
                              Reject Order
                            </motion.button>
                          </>
                        )}
                        {selectedOrder.status === "preparing" && (
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleMarkReady(selectedOrder)}
                            className="w-full rounded-xl bg-blue-500 px-6 py-3.5 text-base font-semibold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                          >
                            <ChefHat size={18} />
                            Mark Ready for Pickup
                          </motion.button>
                        )}
                        {selectedOrder.status === "ready" && (
                          <p className="w-full rounded-xl border border-blue-200 bg-blue-50 px-6 py-3.5 text-center text-sm font-semibold text-blue-700">
                            Waiting for a rider to pick this order up.
                          </p>
                        )}
                        {selectedOrder.status === "picked_up" && (
                          <p className="w-full rounded-xl border border-violet-200 bg-violet-50 px-6 py-3.5 text-center text-sm font-semibold text-violet-700">
                            Out for delivery.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="sticky top-24 lg:top-6 h-[calc(100vh-8rem)] flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <ShoppingBag size={48} className="text-slate-300 mb-3" />
                      <p className="text-sm text-slate-500 text-center">Select an order to view details</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}