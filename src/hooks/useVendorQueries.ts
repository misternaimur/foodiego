import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface DashboardStats {
  todaySales: number;
  ordersCount: number;
  pendingCount: number;
  activeCount: number;
  rating: number;
  salesTrend: { day: string; revenue: number }[];
  totalWeekly: number;
  bestSellers: {
    id: string;
    name: string;
    orders: number;
    image: string;
  }[];
  ratingBreakdown: { stars: number; percentage: number }[];
  recentOrders: {
    id: string;
    customer: string;
    items: string;
    amount: number;
    time: string;
    status: string;
  }[];
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  addons?: { name: string; price: number }[];
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  avatar?: string;
  email?: string;
}

export interface Order {
  id: string;
  status: "new" | "preparing" | "ready" | "picked_up" | "delivered" | "rejected";
  timeAgo: string;
  customer: Customer;
  items: OrderItem[];
  paymentMethod: "bKash" | "cash" | "card" | "cod";
  paymentStatus: "paid" | "pending";
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  notes?: string;
}

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/vendor/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
  });
};

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/vendor/orders", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });
};

export const useOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
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

      const previousOrders = queryClient.getQueryData<Order[]>(["orders"]);

      queryClient.setQueryData(["orders"], (old: Order[] | undefined) =>
        old
          ? old.map((order) =>
              order.id === orderId
                ? { ...order, status: action === "accept" ? "accepted" : action === "reject" ? "rejected" : order.status }
                : order
            )
          : []
      );

      return { previousOrders };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
};
