import type { OrderBookingStatus } from "@/models/OrderBooking";

/**
 * UPDATE NOTE (order-data-source fix, extended by the order-lifecycle fix):
 * -------------------------------------------------------------------------
 * The vendor dashboard (src/app/api/vendor/*, src/hooks/useVendorQueries.ts,
 * src/app/(main)/vendor/components/OrdersManagement.tsx) was originally built
 * against its own `Order` model (collection "orders"). That collection was
 * never written to by the real checkout flow — customers place orders through
 * src/app/api/v1/client/orders/route.ts, which creates documents in the
 * `OrderBooking` collection ("orderBooking") via foodiego-backend instead.
 *
 * Fix: the vendor API routes query `OrderBooking` (see src/models/OrderBooking.ts)
 * instead of `Order`. To avoid rewriting the existing vendor UI components
 * (built around the vocabulary: "new" | "preparing" | "ready" | "picked_up" |
 * "delivered" | "rejected"), this file translates between the two
 * vocabularies so the UI keeps working unchanged.
 *
 * OrderBooking status  -> Vendor dashboard status   (meaning)
 * pending              -> "new"                     just placed, vendor hasn't acted yet
 * confirmed            -> "preparing"                legacy value, no longer written by any code path
 * preparing            -> "preparing"                vendor accepted, kitchen is working on it
 * ready                -> "ready"                    vendor marked food ready, awaiting rider pickup
 * out_for_delivery     -> "picked_up"                a rider has it and is delivering
 * delivered            -> "delivered"
 * cancelled            -> "rejected"
 *
 * OrderBooking now has a real, distinct "ready" status (see the
 * order-lifecycle fix in OrderBooking.ts/orderBookingRoutes.js) so this map
 * is no longer lossy the way it used to be. The vendor-side action verbs
 * (accept/reject/ready) and their allowed transitions live server-side in
 * foodiego-backend's PATCH /api/orders/:id/vendor-action — this file no
 * longer duplicates that mapping, only the read-side status translation.
 */
export type VendorOrderStatus = "new" | "preparing" | "ready" | "picked_up" | "delivered" | "rejected";

const TO_VENDOR_STATUS: Record<OrderBookingStatus, VendorOrderStatus> = {
  pending: "new",
  confirmed: "preparing",
  preparing: "preparing",
  ready: "ready",
  out_for_delivery: "picked_up",
  delivered: "delivered",
  cancelled: "rejected",
};

export function toVendorOrderStatus(status: OrderBookingStatus): VendorOrderStatus {
  return TO_VENDOR_STATUS[status] ?? "new";
}
