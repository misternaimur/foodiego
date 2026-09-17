// src/components/vendor/OrdersDashboard.tsx
"use client"

import React from "react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { useVendorOrders } from "@/hooks/vendor/useVendorOrders";
import { vendorOrderColumns } from "@/components/vendor/orderColumns";

export default function OrdersDashboard() {
  const { data, isLoading, error } = useVendorOrders();

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <p className="font-semibold">Failed to load orders</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Orders Management"
        description="Review incoming orders and keep every delivery moving on time."
      />
      <DataTable
        columns={vendorOrderColumns}
        data={data}
        isLoading={isLoading}
        emptyMessage="No orders yet."
      />
    </div>
  );
}