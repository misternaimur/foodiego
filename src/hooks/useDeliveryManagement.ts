import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Delivery {
  id: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  assignedRider: string;
  riderId?: string;
  riderAvatar?: string;
  status: "Picked Up" | "Assigning" | "Delayed" | "In Transit" | "Delivered";
  eta: string;
  total: number;
  items: number;
  delayReason?: string;
  lat: number;
  lng: number;
  riderLat?: number;
  riderLng?: number;
  riderSpeed?: number;
}

export interface Rider {
  id: string;
  name: string;
  status: "Available" | "Assigned" | "Offline";
  distance: string;
  vehicle: string;
  lat: number;
  lng: number;
}

export interface RiderLocation {
  orderId: string;
  riderId: string;
  lat: number;
  lng: number;
  speed: number;
  bearing: number;
}

export interface ActiveDeliveriesResponse {
  deliveries: Delivery[];
  activeDeliveries?: Delivery[];
  riders: Rider[];
  storeOpen: boolean;
}

const fetcher = async (input: string) => {
  const res = await fetch(input, { credentials: "include" });
  if (!res.ok) {
    const error = new Error("Network response was not ok");
    (error as { status?: number }).status = res.status;
    throw error;
  }
  return res.json();
};

export const useActiveDeliveries = () => {
  return useQuery<ActiveDeliveriesResponse>({
    queryKey: ["active-deliveries"],
    queryFn: () => fetcher("/api/v1/vendor/deliveries/active"),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useAssignRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, riderId }: { orderId: string; riderId: string }) => {
      const res = await fetch(`/api/v1/vendor/deliveries/${orderId}/assign`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riderId }),
      });
      if (!res.ok) throw new Error("Failed to assign rider");
      return res.json();
    },
    onMutate: async ({ orderId, riderId }) => {
      await queryClient.cancelQueries({ queryKey: ["active-deliveries"] });

      const previous = queryClient.getQueryData<ActiveDeliveriesResponse>(["active-deliveries"]);

      if (previous) {
        const riderNames: Record<string, string> = {
          rider_001: "Tom Smith",
          rider_002: "Mike K.",
          rider_003: "Rachel J.",
          rider_004: "Elena V.",
          rider_005: "David M.",
          rider_006: "James P.",
          rider_007: "Anna L.",
        };

        queryClient.setQueryData(["active-deliveries"], {
          ...previous,
          deliveries: previous.deliveries.map((d) =>
            d.orderId === orderId
              ? {
                  ...d,
                  assignedRider: riderNames[riderId] || "Unassigned",
                  riderId: riderId,
                  status: "In Transit" as const,
                  eta: "8 min",
                  riderSpeed: 22,
                }
              : d
          ),
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["active-deliveries"], context.previous);
      }
    },
  });
};
