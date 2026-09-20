import type { OrderBookingStatus } from "@/models/OrderBooking";

/**
 * UPDATE NOTE (order-data-source fix):
 * -------------------------------------------------------------------------
 * The vendor dashboard (src/app/api/vendor/*, src/hooks/useVendorQueries.ts,
 * src/app/(main)/vendor/components/OrdersManagement.tsx) was originally built
 * against its own `Order` model (collection "orders"). That collection was
 * never written to by the real checkout flow — customers place orders through
 * src/app/api/v1/client/orders/route.ts, which creates documents in the
 * `OrderBooking` collection ("orderBooking") via foodiego-backend instead.
 * Net effect: a vendor's dashboard always showed 0 orders/revenue no matter
 * how many real orders customers placed, because it was reading an empty,
 * disconnected collection.
 *
 * Fix: the vendor API routes now query `OrderBooking` (the real, populated
 * collection — see src/models/OrderBooking.ts) instead of `Order`. To avoid
 * rewriting the existing vendor UI components (which are already built
 * around the old status vocabulary: "new" | "preparing" | "ready" |
 * "picked_up" | "delivered" | "rejected"), this file translates between the
 * two vocabularies so the UI keeps working unchanged.
 *
 * OrderBooking status  -> Vendor dashboard status   (meaning)
 * pending              -> "new"                     just placed, vendor hasn't acted yet
 * confirmed            -> "preparing"                vendor accepted, kitchen is working on it
 * preparing            -> "preparing"
 * out_for_delivery     -> "picked_up"                a rider has it and is delivering
 * delivered            -> "delivered"
 * cancelled            -> "rejected"
 *
 * This mapping is intentionally lossy in one direction (both "confirmed" and
 * "preparing" collapse to the vendor UI's single "preparing" bucket, and
 * there is no OrderBooking equivalent of a distinct "ready" state) — that's
 * an acceptable trade-off to keep the existing vendor screens working without
 * a larger rewrite. If the vendor UI is ever redesigned, prefer switching it
 * to speak OrderBookingStatus directly and retiring this map.
 */
export type VendorOrderStatus = "new" | "preparing" | "ready" | "picked_up" | "delivered" | "rejected";

const TO_VENDOR_STATUS: Record<OrderBookingStatus, VendorOrderStatus> = {
  pending: "new",
  confirmed: "preparing",
  preparing: "preparing",
  out_for_delivery: "picked_up",
  delivered: "delivered",
  cancelled: "rejected",
};

export function toVendorOrderStatus(status: OrderBookingStatus): VendorOrderStatus {
  return TO_VENDOR_STATUS[status] ?? "new";
}

/**
 * Reverse direction: the vendor dashboard's "accept"/"reject" buttons (see
 * OrdersManagement.tsx / useVendorQueries.ts's useOrderMutation) post a plain
 * action string. This maps that action to the real OrderBookingStatus that
 * gets written back to MongoDB.
 */
export const VENDOR_ACTION_TO_ORDER_STATUS: Record<string, OrderBookingStatus> = {
  accept: "preparing",
  reject: "cancelled",
  // "ready"/"pickup" both mean "hand off to the rider" — OrderBooking has no
  // separate "ready" state, so both land on out_for_delivery.
  ready: "out_for_delivery",
  pickup: "out_for_delivery",
  deliver: "delivered",
};
