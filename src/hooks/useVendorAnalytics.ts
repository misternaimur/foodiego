import { useQuery } from "@tanstack/react-query";

export interface RevenueTrendPoint {
  day: string;
  revenue: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface OrderVolumePoint {
  day: string;
  orders: number;
}

export interface TopPerformer {
  name: string;
  revenue: number;
  color: string;
}

export interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  ordersPerMinute: number;
  salesChange: number;
  ordersChange: number;
  avgOrderChange: number;
  revenueTrend: RevenueTrendPoint[];
  categoryData: CategoryData[];
  orderVolume: OrderVolumePoint[];
  topPerformers: TopPerformer[];
}

export const demoAnalyticsData: AnalyticsData = {
  totalSales: 148500,
  totalOrders: 1248,
  avgOrderValue: 119,
  ordersPerMinute: 7,
  salesChange: 8.2,
  ordersChange: 12.4,
  avgOrderChange: -1.5,
  revenueTrend: [
    { day: "Mon", revenue: 18500 },
    { day: "Tue", revenue: 22100 },
    { day: "Wed", revenue: 19800 },
    { day: "Thu", revenue: 24300 },
    { day: "Fri", revenue: 26700 },
    { day: "Sat", revenue: 21200 },
    { day: "Sun", revenue: 28700 },
  ],
  categoryData: [
    { name: "Burgers", value: 45, color: "#00A36C" },
    { name: "Pizza", value: 25, color: "#00B37E" },
    { name: "Drinks", value: 15, color: "#4DCA9E" },
    { name: "Sides", value: 10, color: "#A6E9CE" },
    { name: "Desserts", value: 5, color: "#D4F4E7" },
  ],
  orderVolume: [
    { day: "Mon", orders: 142 },
    { day: "Tue", orders: 168 },
    { day: "Wed", orders: 156 },
    { day: "Thu", orders: 187 },
    { day: "Fri", orders: 203 },
    { day: "Sat", orders: 174 },
    { day: "Sun", orders: 220 },
  ],
  topPerformers: [
    { name: "Classic Cheeseburger", revenue: 32400, color: "#00A36C" },
    { name: "Spicy Chicken Pizza (L)", revenue: 28150, color: "#00B37E" },
    { name: "Loaded Fries", revenue: 15800, color: "#4DCA9E" },
    { name: "Oreo Milkshake", revenue: 12200, color: "#A6E9CE" },
    { name: "Vegan Burger", revenue: 9500, color: "#D4F4E7" },
  ],
};

const fetcher = async (input: string) => {
  const res = await fetch(input, { credentials: "include" });
  if (!res.ok) {
    const error = new Error("Network response was not ok");
    (error as { status?: number }).status = res.status;
    throw error;
  }
  return res.json();
};

export const useVendorAnalytics = () => {
  return useQuery<AnalyticsData>({
    queryKey: ["vendor-analytics"],
    queryFn: () => fetcher("/api/v1/vendor/analytics?mode=summary"),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};