"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
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
import { pageVariants, springTransition } from "@/app/(main)/vendor/components/motion";

const tabs = {
  dashboard: DashboardOverview,
  orders: OrdersManagement,
  menu: MenuPortfolio,
  analytics: AnalyticsDashboard,
  delivery: DeliveryManagement,
  reviews: ReviewsDashboard,
  payments: PaymentsDashboard,
  support: SupportTickets,
};

export default function VendorPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";
  const ActiveComponent = tabs[tab as keyof typeof tabs];

  useVendorSocket();

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={springTransition}
          className="mx-auto max-w-[1500px]"
        >
          {ActiveComponent ? <ActiveComponent /> : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-16 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-md">
              <div className="mb-4 rounded-full bg-slate-100 p-4">
                <Construction size={32} className="text-slate-400" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">
                {tab.charAt(0).toUpperCase() + tab.slice(1)} is coming soon
              </h2>
              <p className="mt-1 text-sm text-slate-500">This workspace is being prepared for your restaurant.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
