import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { RestaurantProfile } from "@/app/api/v1/vendor/profile/route";

export type { RestaurantProfile, OperatingHours } from "@/app/api/v1/vendor/profile/route";

const fetcher = async (input: string) => {
  const res = await fetch(input, { credentials: "include" });
  if (!res.ok) {
    const error = new Error("Network response was not ok");
    (error as { status?: number }).status = res.status;
    throw error;
  }
  return res.json();
};

export const useVendorProfile = () => {
  return useQuery<RestaurantProfile>({
    queryKey: ["vendor-profile"],
    queryFn: () => fetcher("/api/v1/vendor/profile"),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateVendorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<RestaurantProfile>) => {
      const res = await fetch("/api/v1/vendor/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onMutate: async (updates: Partial<RestaurantProfile>) => {
      await queryClient.cancelQueries({ queryKey: ["vendor-profile"] });

      const previous = queryClient.getQueryData<RestaurantProfile>(["vendor-profile"]);

      if (previous) {
        queryClient.setQueryData(["vendor-profile"], { ...previous, ...updates });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["vendor-profile"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
    },
  });
};
