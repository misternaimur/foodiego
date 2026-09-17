// src/validation/profile.schema.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().regex(/^(?:\+88|88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number").optional(),
  avatar: z.string().url("Must be a valid URL").optional(),
});

export const updateAddressSchema = z.object({
  title: z.string().min(2, "Address title (e.g. Home, Office) is required"),
  fullAddress: z.string().min(5, "Full address is required"),
  isDefault: z.boolean().default(false),
});

export const updateRiderStatusSchema = z.object({
  status: z.enum(["online", "offline", "busy"]),
  vehicleType: z.string().optional(),
  licenseNumber: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type UpdateRiderStatusInput = z.infer<typeof updateRiderStatusSchema>;