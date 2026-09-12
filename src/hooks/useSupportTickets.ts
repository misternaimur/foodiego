import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type TicketPriority = "low" | "medium" | "high";
export type TicketStatus = "open" | "in_progress" | "resolved";
export type TicketCategory = "Payment" | "Order Issue" | "Technical" | "Account" | "General";

export interface TicketMessage {
  _id?: string;
  sender: "merchant" | "agent";
  text: string;
  timestamp: string;
  avatar?: string;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
}

export interface TicketDetail {
  ticketId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  messages: TicketMessage[];
}

export interface CreateTicketInput {
  subject: string;
  category: TicketCategory;
  message: string;
}

const fetcher = async (input: string, init?: RequestInit) => {
  const res = await fetch(input, { credentials: "include", ...init });
  if (!res.ok) {
    const error = new Error("Network response was not ok");
    (error as { status?: number }).status = res.status;
    throw error;
  }
  return res.json();
};

export const useSupportTickets = (status?: TicketStatus, search?: string) => {
  const searchParams = new URLSearchParams();
  if (status) searchParams.set("status", status);
  if (search) searchParams.set("search", search);
  const qs = searchParams.toString();

  return useQuery<Ticket[]>({
    queryKey: ["support-tickets", status, search],
    queryFn: () => fetcher(`/api/v1/vendor/tickets${qs ? `?${qs}` : ""}`),
    staleTime: 1000 * 60 * 2,
  });
};

export const useAllSupportTickets = (search?: string) => {
  const searchParams = new URLSearchParams();
  if (search) searchParams.set("search", search);
  const qs = searchParams.toString();

  return useQuery<Ticket[]>({
    queryKey: ["support-tickets-all", search],
    queryFn: () => fetcher(`/api/v1/vendor/tickets${qs ? `?${qs}` : ""}`),
    staleTime: 1000 * 60 * 2,
  });
};

export const useTicketMessages = (ticketId: string | null) => {
  return useQuery<TicketDetail>({
    queryKey: ["ticket-messages", ticketId],
    queryFn: () => fetcher(`/api/v1/vendor/tickets/${ticketId}/messages`),
    enabled: !!ticketId,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 30,
  });
};

export const useReplyToTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, text }: { ticketId: string; text: string }) => {
      const res = await fetch(`/api/v1/vendor/tickets/${ticketId}/reply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to send reply");
      return res.json();
    },
    onMutate: async ({ ticketId, text }) => {
      await queryClient.cancelQueries({ queryKey: ["ticket-messages", ticketId] });

      const previous = queryClient.getQueryData<TicketDetail>(["ticket-messages", ticketId]);

      if (previous) {
        const newMessage: TicketMessage = {
          sender: "merchant",
          text,
          timestamp: new Date().toISOString(),
        };
        queryClient.setQueryData(["ticket-messages", ticketId], {
          ...previous,
          messages: [...previous.messages, newMessage],
        });
      }

      return { previous };
    },
    onError: (_err, { ticketId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["ticket-messages", ticketId], context.previous);
      }
    },
    onSettled: (_data, _err, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-messages", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTicketInput) => {
      const res = await fetch("/api/v1/vendor/tickets/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      return res.json();
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["support-tickets"] });

      const previous = queryClient.getQueryData<Ticket[]>(["support-tickets"]);

      const newTicket: Ticket = {
        _id: `temp-${Date.now()}`,
        ticketId: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: input.subject,
        category: input.category,
        priority: "high",
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(["support-tickets"], (old: Ticket[] | undefined) => {
        if (!old) return [newTicket];
        return [newTicket, ...old];
      });

      return { previous, newTicket };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["support-tickets"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
};