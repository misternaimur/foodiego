"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import DashboardOverview from "@/app/(main)/vendor/components/DashboardOverview";
import OrdersManagement from "@/app/(main)/vendor/components/OrdersManagement";
import MenuPortfolio from "@/app/(main)/vendor/components/MenuPortfolio";
import SupportTickets from "@/app/(main)/vendor/components/SupportTickets";
import AnalyticsDashboard from "@/app/(main)/vendor/components/AnalyticsDashboard";
import DeliveryManagement from "@/app/(main)/vendor/components/DeliveryManagement";
import ReviewsDashboard from "@/app/(main)/vendor/components/ReviewsDashboard";
import PaymentsDashboard from "@/app/(main)/vendor/components/PaymentsDashboard";
import { useVendorSocket } from "@/hooks/useVendorSocket";

export default function VendorPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  useVendorSocket();

  return (
    <motion.div
      key={tab}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {tab === "dashboard" && <DashboardOverview />}
      {tab === "orders" && <OrdersManagement />}
      {tab === "menu" && <MenuPortfolio />}
      {tab === "analytics" && <AnalyticsDashboard />}
      {tab === "delivery" && <DeliveryManagement />}
      {tab === "reviews" && <ReviewsDashboard />}
      {tab === "payments" && <PaymentsDashboard />}
      {tab === "support" && <SupportTickets />}
      {tab !== "dashboard" && tab !== "orders" && tab !== "menu" && tab !== "analytics" && tab !== "delivery" && tab !== "reviews" && tab !== "payments" && tab !== "support" && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <Construction size={32} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, " $1")} Coming Soon
          </h2>
          <p className="text-sm text-gray-500">
            This section is under development. Check back soon.
          </p>
        </div>
      )}
    </motion.div>
  );
}
