"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, User, Clock, AlertCircle, CheckCircle, Truck, Bike } from "lucide-react";
import dynamic from "next/dynamic";
import { useVendorSocket } from "@/hooks/useVendorSocket";
import { useActiveDeliveries, useAssignRider, type Delivery } from "@/hooks/useDeliveryManagement";
import type { RiderLocation } from "@/app/(main)/vendor/components/DeliveryMap";

const riderColors: Record<string, string> = {
  rider_001: "#10B981",
  rider_002: "#3B82F6",
  rider_003: "#8B5CF6",
  rider_004: "#F59E0B",
  rider_005: "#EF4444",
  rider_006: "#06B6D4",
  rider_007: "#EC4899",
};

const DeliveryMap = dynamic(() => import("@/app/(main)/vendor/components/DeliveryMap"), { ssr: false });

interface DeliveryWithSpeed extends Delivery {
  riderSpeed?: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string; pulse?: boolean }> = {
  "Picked Up": { label: "Picked Up", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: <AlertCircle size={12} className="text-amber-500" /> },
  "Assigning": { label: "Assigning...", color: "text-purple-600", bg: "bg-purple-50 border-purple-200", icon: <Clock size={12} className="text-purple-500" />, pulse: true },
  "Delayed": { label: "Delayed", color: "text-rose-600", bg: "bg-rose-50 border-rose-200", icon: <AlertCircle size={12} className="text-rose-500" /> },
  "In Transit": { label: "In Transit", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: <Truck size={12} className="text-emerald-500" /> },
  "Delivered": { label: "Delivered", color: "text-gray-600", bg: "bg-gray-50 border-gray-200", icon: <CheckCircle size={12} className="text-gray-400" /> },
};

function StatusPill({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig["Assigning"];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${config.color} ${config.bg}`}
    >
      {config.pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
      )}
      {config.icon}
      {config.label}
    </span>
  );
}

function DispatchCard({ delivery, onAssign, onCallDriver }: { delivery: DeliveryWithSpeed; onAssign: (orderId: string, riderId: string) => void; onCallDriver: (phone: string) => void }) {
  const isAssigning = delivery.status === "Assigning";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01, zIndex: 10 }}
      className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {delivery.orderId}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-xs font-bold text-gray-500">
              #{delivery.id}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <User size={14} className="text-gray-400" />
            <span className="font-semibold text-gray-900">{delivery.customerName}</span>
            <StatusPill status={delivery.status} />
            {delivery.delayReason && (
              <span className="text-xs text-rose-500">({delivery.delayReason})</span>
            )}
          </div>

          <div className="flex items-start gap-2 mb-2">
            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-600">{delivery.address}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <span>৳{delivery.total.toLocaleString()}</span>
            <span>·</span>
            <span>{delivery.items} items</span>
            {delivery.eta && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={10} />
                  {delivery.eta}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Bike size={12} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {delivery.assignedRider}
              </span>
              {delivery.riderSpeed && (
                <span className="text-xs text-gray-400">
                  ({delivery.riderSpeed} km/h)
                </span>
              )}
            </div>
          </div>

          {delivery.status === "Delayed" && delivery.delayReason && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-3 rounded-xl bg-rose-50/50 border border-rose-200/30 px-3 py-2"
            >
              <span className="text-xs font-semibold text-rose-700">
                AI Delay Alert: {delivery.delayReason} expected. Consider alternative routes.
              </span>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-3">
          {isAssigning ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAssign(delivery.orderId, "rider_001")}
              className="rounded-xl bg-[#10B981] px-4 py-2 text-xs font-bold text-white hover:bg-[#059669] transition-colors"
            >
              Assign Rider
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCallDriver(delivery.customerPhone)}
              className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-200 transition-colors"
            >
              <Phone size={12} />
              Call Driver
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function DeliveryManagement() {
  const [activeTab, setActiveTab] = useState<"active" | "riders" | "history">("active");

  const { data, isLoading, isError } = useActiveDeliveries();
  const { mutate: assignRider } = useAssignRider();
  const { isConnected } = useVendorSocket();

  const allDeliveries = (data?.deliveries || []) as DeliveryWithSpeed[];
  const deliveries = allDeliveries;
  const riders = data?.riders || [];

  const activeDeliveries = deliveries.filter(
    (d) => d.status !== "Delivered"
  );

  const handleCallDriver = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const activeDeliveryCount = activeDeliveries.filter(
    (d) => d.status === "Picked Up" || d.status === "In Transit" || d.status === "Assigning"
  ).length;

  const riderLocations: RiderLocation[] = activeDeliveries
    .filter((d) => d.riderLat && d.riderLng)
    .map((d) => ({
      orderId: d.orderId,
      riderId: d.riderId || "unknown",
      lat: d.riderLat || 0,
      lng: d.riderLng || 0,
      speed: d.riderSpeed || 0,
    }));

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
        <p className="text-sm text-rose-700">
          Unable to load delivery data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Track active dispatches, assign riders, and monitor real-time delivery performance.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${
              data?.storeOpen
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                data?.storeOpen ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {data?.storeOpen ? "Store Open" : "Store Closed"}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${
              isConnected
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-gray-100 text-gray-500 border border-gray-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-full bg-gray-100 p-1 border border-gray-200 w-fit">
        {[
          { id: "active", label: `Active Deliveries (${activeDeliveryCount})` },
          { id: "riders", label: "Rider Status" },
          { id: "history", label: "Delivery History" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "active" | "riders" | "history")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-[#10B981] text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Loading deliveries...</p>
          </div>
        </div>
      )}

      {activeTab === "active" && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex gap-6"
        >
          <div className="w-[60%]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span
                  className="text-2xl font-bold text-gray-900"
                  key={activeDeliveryCount}
                  initial={{ scale: 1.1, color: "#059669" }}
                  animate={{ scale: 1, color: "#2d2d2d" }}
                >
                  {activeDeliveryCount}
                </motion.span>
                <span className="text-gray-500">En Route</span>
              </div>
              <span className="text-xs text-gray-400">{activeDeliveryCount} active deliveries</span>
            </div>

            <div className="space-y-3">
              {activeDeliveries.length === 0 ? (
                <div className="text-center py-12">
                  <Truck size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No active deliveries right now</p>
                </div>
              ) : (
                activeDeliveries.map((delivery) => (
                  <DispatchCard
                    key={delivery.orderId}
                    delivery={delivery}
                    onAssign={(orderId, riderId) => assignRider({ orderId, riderId })}
                    onCallDriver={handleCallDriver}
                  />
                ))
              )}
            </div>
          </div>

          <div className="w-[40%] space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Active Riders
                </h3>
                <span className="text-xs text-gray-400">
                  {riders.filter((r) => r.status !== "Offline").length} online
                </span>
              </div>
              <div className="space-y-3">
                {riders.map((rider) => (
                  <motion.div
                    key={rider.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 border border-gray-100"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: riderColors[rider.id] || "#6B7280" }}
                    >
                      <Bike size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm text-gray-900">{rider.name}</span>
                      <div className="text-xs text-gray-500">{rider.distance} • {rider.vehicle}</div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        rider.status === "Available"
                          ? "bg-emerald-50 text-emerald-700"
                          : rider.status === "Assigned"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {rider.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-gray-500 uppercase tracking-wider">
                Real-time Map
              </h3>
              <DeliveryMap
                riderLocations={riderLocations}
                deliveries={deliveries.map((d) => ({
                  orderId: d.orderId,
                  customerName: d.customerName,
                  lat: d.lat,
                  lng: d.lng,
                  riderLat: d.riderLat,
                  riderLng: d.riderLng,
                  riderSpeed: d.riderSpeed,
                  riderId: d.riderId,
                  status: d.status,
                }))}
              />
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "riders" && !isLoading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {riders.map((rider) => (
              <motion.div
                key={rider.id}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: riderColors[rider.id] || "#6B7280" }}
                  >
                    <Bike size={20} />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      rider.status === "Available"
                        ? "bg-emerald-50 text-emerald-700"
                        : rider.status === "Assigned"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {rider.status}
                  </span>
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-900">{rider.name}</span>
                  <div className="mt-1 text-sm text-gray-500">{rider.distance} • {rider.vehicle}</div>
                  <div className="mt-2 text-xs text-gray-400">
                    Position: {rider.lat.toFixed(4)}, {rider.lng.toFixed(4)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "history" && !isLoading && (
        <div className="space-y-3">
          {deliveries
            .filter((d) => d.status === "Delivered")
            .map((delivery) => (
              <motion.div
                key={delivery.orderId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{delivery.orderId}</span>
                      <span className="text-sm text-gray-500"> · {delivery.customerName}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ৳{delivery.total.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </motion.div>
  );
}
