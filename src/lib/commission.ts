// UPDATE (per-vendor-commission fix): centralizes what used to be a
// PLATFORM_COMMISSION_RATE constant duplicated in both
// src/app/api/v1/vendor/payments/route.ts and
// src/app/api/admin/commission/route.ts, with no way to set one vendor's
// rate differently from another's. Restaurant.commissionRate (0-100, a
// percentage) is optional — undefined means "use the platform default".

export const DEFAULT_PLATFORM_COMMISSION_RATE_PERCENT = 15;

/** Returns the effective commission rate as a 0-1 fraction, ready to multiply against an order's gross amount. */
export function commissionRateOf(restaurant: { commissionRate?: number } | null | undefined): number {
  const percent =
    typeof restaurant?.commissionRate === "number" ? restaurant.commissionRate : DEFAULT_PLATFORM_COMMISSION_RATE_PERCENT;
  return percent / 100;
}
