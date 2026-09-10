import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { queryClient } from "@/lib/queryClient";
import type { TicketMessage, TicketDetail } from "@/hooks/useSupportTickets";
import type { AnalyticsData } from "@/hooks/useVendorAnalytics";
import type { ActiveDeliveriesResponse } from "@/hooks/useDeliveryManagement";
import type { ReviewData } from "@/hooks/useReviews";
import type { PaymentsOverview, PaymentTransaction } from "@/app/api/v1/vendor/payments/route";

export type VendorSocketStatus = "connecting" | "connected" | "disconnected" | "error";

export interface NewOrderPayload {
  id: string;
  orderNumber: string;
  customerName: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    orderCount: number;
    avatar?: string;
    email?: string;
  };
  items: Array<{
    id?: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    addons?: Array<{ name: string; price: number }>;
  }>;
  total: number;
  subtotal: number;
  deliveryFee: number;
  paymentMethod: string;
  paymentStatus: "paid" | "pending";
  createdAt: string;
  timeAgo: string;
  address: string;
  phone: string;
  status: "new";
  notes?: string;
}

export interface OrderStatusChangePayload {
  orderId: string;
  orderNumber: string;
  oldStatus: string;
  newStatus: string;
}

export interface RiderGpsPayload {
  orderId: string;
  riderId: string;
  lat: number;
  lng: number;
  bearing: number;
  speed: number;
}

export interface TableStatusPayload {
  tableNumber: string;
  status: "available" | "occupied" | "reserved" | "dirty";
}

export interface SupportTicketMsgPayload {
  ticketId: string;
  message: TicketMessage;
}

export interface AnalyticsTickPayload {
  sales: number;
  orders: number;
  avgOrderValue: number;
  ordersPerMinute: number;
  timestamp: string;
}

export interface RiderLocationUpdatePayload {
  orderId: string;
  riderId: string;
  lat: number;
  lng: number;
  speed: number;
  bearing: number;
}

export interface NewReviewTickPayload {
  id: string;
  orderId: string;
  orderName: string;
  customerName: string;
  rating: number;
  timeAgo: string;
  createdAt: string;
  text: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface ReviewReplySentPayload {
  reviewId: string;
  text: string;
  createdAt: string;
}

export interface PaymentTickUpdatePayload {
  id: string;
  orderId: string;
  customerName: string;
  itemName: string;
  date: string;
  grossAmount: number;
  commission: number;
  netEarnings: number;
  delta: number;
  status: "Paid" | "Pending" | "Failed";
  timestamp: string;
}

export type VendorEventMap = {
  NEW_ORDER_RECEIVED: (payload: NewOrderPayload) => void;
  ORDER_STATUS_CHANGED: (payload: OrderStatusChangePayload) => void;
  RIDER_GPS_TICK: (payload: RiderGpsPayload) => void;
  TABLE_STATUS_MUTATED: (payload: TableStatusPayload) => void;
  SUPPORT_TICKET_MSG: (payload: SupportTicketMsgPayload) => void;
  ANALYTICS_TICK_UPDATE: (payload: AnalyticsTickPayload) => void;
  RIDER_LOCATION_UPDATE: (payload: RiderLocationUpdatePayload) => void;
  NEW_REVIEW_TICK: (payload: NewReviewTickPayload) => void;
  REVIEW_REPLY_SENT: (payload: ReviewReplySentPayload) => void;
  PAYMENT_TICK_UPDATE: (payload: PaymentTickUpdatePayload) => void;
};

export type VendorEventName = keyof VendorEventMap;
type EventHandler = (payload: unknown) => void;

const WS_URL = process.env.NEXT_PUBLIC_VENDOR_WS_URL || "http://localhost:5000";

const singletonState = {
  socket: null as Socket | null,
  status: "connecting" as VendorSocketStatus,
  handlers: new Map<VendorEventName, EventHandler>(),
  reconnectAttempts: 0,
  hasLoggedError: false,
  reconnectTimeout: null as NodeJS.Timeout | null,
  subscribers: 0,
};

const maxReconnectAttempts = 10;

const connect = () => {
  singletonState.socket = io(WS_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: maxReconnectAttempts,
    reconnectionDelay: 1000,
    timeout: 5000,
  });

  singletonState.status = "connecting";

  const socket = singletonState.socket;

  socket.on("connect", () => {
    singletonState.status = "connected";
    singletonState.reconnectAttempts = 0;
    singletonState.hasLoggedError = false;

    socket.emit("subscribe", { roles: ["restaurant"] });
  });

  socket.on("disconnect", (reason) => {
    singletonState.status = "disconnected";
    console.warn(`[VendorSocket] Disconnected: ${reason}. Retrying...`);

    if (singletonState.reconnectAttempts < maxReconnectAttempts) {
      const delay = Math.min(1000 * 2 ** singletonState.reconnectAttempts, 10000);
      singletonState.reconnectAttempts += 1;

      singletonState.reconnectTimeout = setTimeout(() => {
        connect();
      }, delay);
    }
  });

  socket.on("connect_error", (error) => {
    if (!singletonState.hasLoggedError) {
      console.warn("[VendorSocket] Socket.IO connection error — retrying in background. Live updates disabled until connected.");
      singletonState.hasLoggedError = true;
    }
    singletonState.status = "error";
    void error;
  });

  (Object.keys(singletonState.handlers) as VendorEventName[]).forEach((eventName) => {
    socket.on(eventName, (payload: unknown) => {
      const handler = singletonState.handlers.get(eventName);
      if (handler) {
        handler(payload);
      }
    });
  });
};

export function useVendorSocket() {
  const [status, setStatus] = useState<VendorSocketStatus>(singletonState.status);

  const on = useCallback(<K extends VendorEventName>(
    eventName: K,
    handler: VendorEventMap[K]
  ) => {
    singletonState.handlers.set(eventName, handler as EventHandler);
    if (singletonState.socket) {
      singletonState.socket.on(eventName as string, ((payload: unknown) => {
        const h = singletonState.handlers.get(eventName);
        if (h) h(payload);
      }) as (...args: unknown[]) => void);
    }
  }, []);

  const off = useCallback(<K extends VendorEventName>(eventName: K) => {
    singletonState.handlers.delete(eventName);
    if (singletonState.socket) {
      singletonState.socket.off(eventName as string);
    }
  }, []);

  const send = useCallback((message: Record<string, unknown>) => {
    if (singletonState.socket && singletonState.socket.connected) {
      singletonState.socket.emit(message.type as string, message.payload);
    }
  }, []);

  const emitOrderAccept = useCallback((orderId: string) => {
    send({ type: "ORDER_ACCEPT", payload: { orderId } });
  }, [send]);

  const emitOrderReject = useCallback((orderId: string) => {
    send({ type: "ORDER_REJECT", payload: { orderId } });
  }, [send]);

  const isBrowser = typeof window !== "undefined";

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    singletonState.subscribers += 1;

    if (singletonState.subscribers === 1 && !singletonState.socket) {
      connect();
    }

    const statusSync = () => {
      setStatus(singletonState.status);
    };

    const interval = setInterval(statusSync, 500);

    statusSync();

    return () => {
      singletonState.subscribers -= 1;
      clearInterval(interval);

      if (singletonState.subscribers === 0 && singletonState.socket) {
        singletonState.socket.close();
        singletonState.socket = null;
        singletonState.status = "disconnected";
        if (singletonState.reconnectTimeout) {
          clearTimeout(singletonState.reconnectTimeout);
          singletonState.reconnectTimeout = null;
        }
      }
    };
  }, [isBrowser]);

  useEffect(() => {
    const handleNewOrder: VendorEventMap["NEW_ORDER_RECEIVED"] = (payload) => {
      const existing = queryClient.getQueryData<NewOrderPayload[]>(["orders"]);
      if (existing) {
        if (existing.some((o) => o.id === payload.id)) return;
        queryClient.setQueryData(["orders"], [payload, ...existing]);
      }
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    };

    const handleOrderStatusChange: VendorEventMap["ORDER_STATUS_CHANGED"] = (payload) => {
      queryClient.setQueryData(["orders", payload.orderId], (old: unknown) => {
        if (old && typeof old === "object") {
          return { ...old, status: payload.newStatus };
        }
        return old;
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    };

    const handleRiderGps: VendorEventMap["RIDER_GPS_TICK"] = (payload) => {
      queryClient.setQueryData(["rider-gps", payload.orderId], payload);
    };

    const handleTableStatus: VendorEventMap["TABLE_STATUS_MUTATED"] = (payload) => {
      queryClient.setQueryData(["table-status", payload.tableNumber], payload);
    };

    const handleSupportTicketMsg: VendorEventMap["SUPPORT_TICKET_MSG"] = (payload) => {
      const { ticketId, message } = payload;
      queryClient.setQueryData(["ticket-messages", ticketId], (old: TicketDetail | undefined) => {
        if (!old) return old;
        return {
          ...old,
          messages: [...old.messages, message],
        };
      });
      queryClient.invalidateQueries({ queryKey: ["ticket-messages", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    };

    const handleAnalyticsTick: VendorEventMap["ANALYTICS_TICK_UPDATE"] = (payload) => {
      const { sales, orders, avgOrderValue, ordersPerMinute } = payload;
      queryClient.setQueryData(["vendor-analytics"], (old: AnalyticsData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          totalSales: sales,
          totalOrders: orders,
          avgOrderValue: avgOrderValue,
          ordersPerMinute: ordersPerMinute,
        };
      });
      queryClient.invalidateQueries({ queryKey: ["vendor-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    };

    const handleRiderLocation: VendorEventMap["RIDER_LOCATION_UPDATE"] = (payload) => {
      const { orderId, riderId, lat, lng, speed, bearing } = payload;
      queryClient.setQueryData(["rider-location", orderId], { orderId, riderId, lat, lng, speed, bearing });
      queryClient.setQueryData(["active-deliveries"], (old: ActiveDeliveriesResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          deliveries: old.deliveries.map((d) =>
            d.orderId === orderId ? { ...d, riderLat: lat, riderLng: lng, riderSpeed: speed } : d
          ),
        };
      });
    };

    const handleNewReview: VendorEventMap["NEW_REVIEW_TICK"] = (payload) => {
      queryClient.setQueryData(["reviews"], (old: ReviewData | undefined) => {
        if (!old) return old;
        const newReview = { ...payload, reply: undefined };
        return {
          ...old,
          reviews: [newReview, ...old.reviews],
          totalReviews: old.totalReviews + 1,
        };
      });
    };

    const handleReviewReplySent: VendorEventMap["REVIEW_REPLY_SENT"] = (payload) => {
      const { reviewId, text, createdAt } = payload;
      queryClient.setQueryData(["reviews"], (old: ReviewData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          reviews: old.reviews.map((r) =>
            r.id === reviewId
              ? { ...r, reply: { text, createdAt, by: "Restaurant Manager" } }
              : r
          ),
        };
      });
    };

    const handlePaymentTick: VendorEventMap["PAYMENT_TICK_UPDATE"] = (payload) => {
      const { delta, netEarnings } = payload;

      queryClient.setQueryData(["payments-overview"], (old: PaymentsOverview | undefined) => {
        if (!old) return old;
        return {
          ...old,
          availableBalance: old.availableBalance + (delta || netEarnings),
        };
      });

      queryClient.setQueryData(["payments-transactions"], (old: PaymentTransaction[] | undefined) => {
        if (!old) return old;
        const newTransaction = {
          id: payload.id,
          orderId: payload.orderId,
          customerName: payload.customerName,
          date: payload.date,
          grossAmount: payload.grossAmount,
          commission: payload.commission,
          netEarnings: payload.netEarnings,
          status: payload.status,
        };
        return [newTransaction, ...old];
      });
    };

    on("NEW_ORDER_RECEIVED", handleNewOrder);
    on("ORDER_STATUS_CHANGED", handleOrderStatusChange);
    on("RIDER_GPS_TICK", handleRiderGps);
    on("TABLE_STATUS_MUTATED", handleTableStatus);
    on("SUPPORT_TICKET_MSG", handleSupportTicketMsg);
    on("ANALYTICS_TICK_UPDATE", handleAnalyticsTick);
    on("RIDER_LOCATION_UPDATE", handleRiderLocation);
    on("NEW_REVIEW_TICK", handleNewReview);
    on("REVIEW_REPLY_SENT", handleReviewReplySent);
    on("PAYMENT_TICK_UPDATE", handlePaymentTick);

    return () => {
      off("NEW_ORDER_RECEIVED");
      off("ORDER_STATUS_CHANGED");
      off("RIDER_GPS_TICK");
      off("TABLE_STATUS_MUTATED");
      off("SUPPORT_TICKET_MSG");
      off("ANALYTICS_TICK_UPDATE");
      off("RIDER_LOCATION_UPDATE");
      off("NEW_REVIEW_TICK");
      off("REVIEW_REPLY_SENT");
      off("PAYMENT_TICK_UPDATE");
    };
  }, [on, off]);

  return {
    status,
    on,
    off,
    send,
    emitOrderAccept,
    emitOrderReject,
    isConnected: status === "connected",
  };
}
