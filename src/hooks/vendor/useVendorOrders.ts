// src/hooks/vendor/useVendorOrders.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { VendorOrder } from "@/types/vendor";

interface UpdateStatusPayload {
  orderId: string;
  status: string;
}

// Fetch vendor orders API with proper typing and response unwrapping
async function fetchVendorOrders(): Promise<VendorOrder[]> {
  const response = await fetch("/api/vendor/orders", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch vendor orders: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || result;
}

// Update order status API
async function updateOrderStatusApi({ orderId, status }: UpdateStatusPayload): Promise<VendorOrder> {
  const response = await fetch(`/api/vendor/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update order status: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || result;
}

export function useVendorOrders() {
  const queryClient = useQueryClient();

  // Query to fetch orders with 10s polling interval and optimistic safeguards
  const { data, isLoading, error, refetch } = useQuery<VendorOrder[], Error>({
    queryKey: ["vendor-orders"],
    queryFn: fetchVendorOrders,
    refetchInterval: 10000,
  });

  // Mutation to update order status with automatic cache invalidation
  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
    },
  });

  return {
    data: data ?? [],
    isLoading,
    error,
    refetch,
    updateOrderStatus: updateStatusMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending,
  };
}