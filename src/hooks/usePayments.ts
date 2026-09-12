import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaymentsOverview, PaymentTransaction } from "@/app/api/v1/vendor/payments/route";

export type { PaymentsOverview, PaymentTransaction };

const fetcher = async (input: string) => {
  const res = await fetch(input, { credentials: "include" });
  if (!res.ok) {
    const error = new Error("Network response was not ok");
    (error as { status?: number }).status = res.status;
    throw error;
  }
  return res.json();
};

export const usePaymentsOverview = () => {
  return useQuery<PaymentsOverview>({
    queryKey: ["payments-overview"],
    queryFn: () => fetcher("/api/v1/vendor/payments"),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const usePaymentsTransactions = () => {
  return useQuery<PaymentTransaction[]>({
    queryKey: ["payments-transactions"],
    queryFn: async () => {
      const res = await fetch("/api/v1/vendor/payments", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      return data.transactions as PaymentTransaction[];
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, method, account }: { amount: number; method: string; account: string }) => {
      const res = await fetch("/api/v1/vendor/payments/withdraw", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method, account }),
      });
      if (!res.ok) throw new Error("Failed to process withdrawal");
      return res.json();
    },
    onMutate: async ({ amount }) => {
      await queryClient.cancelQueries({ queryKey: ["payments-overview"] });

      const previous = queryClient.getQueryData<PaymentsOverview>(["payments-overview"]);

      if (previous) {
        queryClient.setQueryData(["payments-overview"], {
          ...previous,
          availableBalance: previous.availableBalance - amount,
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["payments-overview"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payments-overview"] });
    },
  });
};
