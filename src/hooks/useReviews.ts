import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Review, ReviewsResponse } from "@/app/api/v1/vendor/reviews/route";

export type { Review, ReviewsResponse };

export interface ReviewData {
  reviews: Review[];
  overallRating: number;
  totalReviews: number;
  ratingSummary: Record<number, { count: number; percentage: number }>;
  sentimentInsight: string;
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

export const useReviews = () => {
  return useQuery<ReviewData>({
    queryKey: ["reviews"],
    queryFn: () => fetcher("/api/v1/vendor/reviews"),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useReplyToReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, text }: { reviewId: string; text: string }) => {
      const res = await fetch(`/api/v1/vendor/reviews/${reviewId}/reply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to post reply");
      return res.json();
    },
    onMutate: async ({ reviewId, text }) => {
      await queryClient.cancelQueries({ queryKey: ["reviews"] });

      const previous = queryClient.getQueryData<ReviewData>(["reviews"]);

      if (previous) {
        queryClient.setQueryData(["reviews"], {
          ...previous,
          reviews: previous.reviews.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  reply: {
                    text,
                    createdAt: new Date().toISOString(),
                    by: "Restaurant Manager",
                  },
                }
              : r
          ),
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["reviews"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
