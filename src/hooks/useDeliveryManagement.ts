import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// UPDATE (rider-GPS fix): `id` used to be typed `number` to match 7
// hardcoded fake delivery ids (842, 843, ...). Real OrderBooking documents
// have Mongo ObjectId strings, so `id`/`orderId` are both real order id
// strings now. `lat`/`lng` (the delivery destination) are optional since
// there's no address-to-coordinate geocoding in this codebase — see the
// comment in DeliveryMap.tsx.
export interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  assignedRider: string;
  riderId?: string;
  riderAvatar?: string;
  status: "Picked Up" | "Assigning" | "Delayed" | "In Transit" | "Delivered" | "Cancelled";
  eta: string;
  total: number;
  items: number;
  completedAt?: string;
  cancelledAt?: string;
  delayReason?: string;
  lat?: number;
  lng?: number;
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
  lat?: number;
  lng?: number;
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
    // A rider claiming an order (which is what makes its rider chat
    // available) happens on the rider's device, so poll to pick it up.
    staleTime: 10_000,
    refetchInterval: 15_000,
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
    // UPDATE (rider-GPS fix): the old optimistic update looked up the
    // rider's display name from a hardcoded rider_001..rider_007 map. Real
    // riders don't have predictable ids, so the optimistic update now
    // reads the name from the riders list already in the query cache
    // instead of guessing — falling back to a full refetch (onSettled)
    // either way to reconcile with the server response.
    onMutate: async ({ orderId, riderId }) => {
      await queryClient.cancelQueries({ queryKey: ["active-deliveries"] });

      const previous = queryClient.getQueryData<ActiveDeliveriesResponse>(["active-deliveries"]);

      if (previous) {
        const rider = previous.riders.find((r) => r.id === riderId);
        queryClient.setQueryData(["active-deliveries"], {
          ...previous,
          deliveries: previous.deliveries.map((d) =>
            d.orderId === orderId
              ? {
                  ...d,
                  assignedRider: rider?.name || "Assigned rider",
                  riderId,
                  status: "In Transit" as const,
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["active-deliveries"] });
    },
  });
};
