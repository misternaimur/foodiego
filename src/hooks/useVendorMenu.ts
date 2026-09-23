import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "@/app/(public)/actions/upload";

export interface MenuItemAddon {
  name: string;
  price: number;
}

export interface MenuItem {
  _id: string;
  vendorId: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  addons: MenuItemAddon[];
  isActive: boolean;
  ordersCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryMetric {
  name: string;
  icon: string;
  activeItems: number;
}

export interface PaginatedMenuResponse {
  items: MenuItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateMenuItemInput {
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  addons?: MenuItemAddon[];
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

export const useMenuItems = (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set("category", params.category);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();

  return useQuery<PaginatedMenuResponse>({
    queryKey: ["vendor-menu", params?.category, params?.search, params?.page, params?.limit],
    queryFn: () => fetcher(`/api/v1/vendor/menu${qs ? `?${qs}` : ""}`),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useCategoryMetrics = (items: MenuItem[]) => {
  const categories = ["Burgers", "Pizza", "Drinks", "Desserts"];
  const metrics = categories.map((cat) => ({
    name: cat,
    icon: cat === "Burgers" ? "🍔" : cat === "Pizza" ? "🍕" : cat === "Drinks" ? "🥤" : "🍰",
    activeItems: items.filter((i) => i.category === cat && i.isActive).length,
  }));

  return metrics;
};

export const useAllCategoriesMetrics = () => {
  return useQuery<CategoryMetric[]>({
    queryKey: ["vendor-menu-categories-metrics"],
    queryFn: async () => {
      const res = await fetch("/api/v1/vendor/menu?limit=1000", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch menu");
      const data = await res.json();
      const items: MenuItem[] = data.items ?? [];
      const categories = ["Burgers", "Pizza", "Drinks", "Desserts", "Sides", "Snacks"];
      return categories.map((cat) => ({
        name: cat,
        icon: cat === "Burgers" ? "🍔" : cat === "Pizza" ? "🍕" : cat === "Drinks" ? "🥤" : cat === "Desserts" ? "🍰" : cat === "Sides" ? "🍟" : "🍿",
        activeItems: items.filter((i) => i.category === cat && i.isActive).length,
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useToggleMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(`/api/v1/vendor/menu/${itemId}/toggle`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle item");
      return res.json();
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ["vendor-menu"] });

      const previous = queryClient.getQueryData<PaginatedMenuResponse>(["vendor-menu"]);

      queryClient.setQueryData(["vendor-menu"], (old: PaginatedMenuResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item._id === itemId ? { ...item, isActive: !item.isActive } : item
          ),
        };
      });

      return { previous };
    },
    onError: (_err, _itemId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["vendor-menu"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-menu"] });
    },
  });
};

// UPDATE (menu-edit fix): new mutation backing the item-edit flow — see
// src/app/api/v1/vendor/menu/[id]/route.ts for the PATCH endpoint this
// calls. Mirrors useCreateMenuItem's optimistic-update shape but patches
// the existing item in the cached list instead of prepending a new one.
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: CreateMenuItemInput & { imageFile?: File };
    }) => {
      let imageUrl = input.image ?? "";

      if (input.imageFile) {
        const formData = new FormData();
        formData.append("file", input.imageFile);
        formData.append("folder", "menu-items");
        try {
          const uploadResult = await uploadImage(formData);
          if (uploadResult.success) {
            imageUrl = uploadResult.data.secureUrl;
          } else {
            throw new Error(uploadResult.error);
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Image upload failed.");
        }
      }

      const res = await fetch(`/api/v1/vendor/menu/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, image: imageUrl }),
      });
      if (!res.ok) throw new Error("Failed to update item");
      const response = await res.json();
      return response.item ?? response;
    },
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ["vendor-menu"] });

      const previous = queryClient.getQueryData<PaginatedMenuResponse>(["vendor-menu"]);

      queryClient.setQueryData(["vendor-menu"], (old: PaginatedMenuResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item._id === id
              ? {
                  ...item,
                  name: input.name,
                  category: input.category,
                  price: input.price,
                  description: input.description || "",
                  image: input.image ?? item.image,
                  addons: input.addons || [],
                }
              : item
          ),
        };
      });

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["vendor-menu"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-menu"] });
    },
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMenuItemInput & { imageFile?: File }) => {
      let imageUrl = input.image || "";

      if (input.imageFile) {
        const formData = new FormData();
        formData.append("file", input.imageFile);
        formData.append("folder", "menu-items");
        try {
          const uploadResult = await uploadImage(formData);
          if (uploadResult.success) {
            imageUrl = uploadResult.data.secureUrl;
          } else {
            throw new Error(uploadResult.error);
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Image upload failed.");
        }
      }

      const res = await fetch("/api/v1/vendor/menu/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, image: imageUrl }),
      });
      if (!res.ok) throw new Error("Failed to create item");
      const response = await res.json();
      return response.item ?? response;
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["vendor-menu"] });

      const previous = queryClient.getQueryData<PaginatedMenuResponse>(["vendor-menu"]);

      const newItem: MenuItem = {
        _id: `temp-${Date.now()}`,
        vendorId: "",
        name: input.name,
        category: input.category,
        price: input.price,
        description: input.description || "",
        image: input.image || "",
        addons: input.addons || [],
        isActive: true,
        ordersCount: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(["vendor-menu"], (old: PaginatedMenuResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: [newItem, ...old.items],
          total: old.total + 1,
        };
      });

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["vendor-menu"], context.previous);
      }
    },
    onSuccess: (createdItem: MenuItem) => {
      if (createdItem) {
        queryClient.setQueryData(["vendor-menu"], (old: PaginatedMenuResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item) =>
              item._id === (createdItem._id || old.items.find((i) => i._id.startsWith("temp-"))?._id)
                ? { ...createdItem, _id: createdItem._id || item._id }
                : item
            ),
          };
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-menu"] });
    },
  });
};
