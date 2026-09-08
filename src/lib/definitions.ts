import * as z from "zod";

export const ROLES = ["customer", "restaurant", "rider"] as const;
export type SelectableRole = (typeof ROLES)[number];
export type Role = SelectableRole | "admin";

export const RegisterFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email address." }).trim().toLowerCase(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { error: "Password must contain at least one letter." })
    .regex(/[0-9]/, { error: "Password must contain at least one number." })
    .trim(),
  role: z.enum(ROLES, { error: "Please select a valid account type." }),
});

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim().toLowerCase(),
  password: z.string().min(1, { error: "Password is required." }),
});

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  role: z.enum(ROLES, { error: "Please select a valid account type." }),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
      };
      message?: string;
    }
  | undefined;

export const RestaurantRegisterFormSchema = z.object({
  ownerName: z
    .string()
    .min(2, { error: "Owner name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email address." }).trim().toLowerCase(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { error: "Password must contain at least one letter." })
    .regex(/[0-9]/, { error: "Password must contain at least one number." })
    .trim(),
  phone: z
    .string()
    .trim()
    .min(7, { error: "Please enter a valid phone number." })
    .regex(/^[0-9+\-\s()]+$/, { error: "Please enter a valid phone number." }),
  restaurantName: z
    .string()
    .min(2, { error: "Restaurant name must be at least 2 characters long." })
    .trim(),
  address: z
    .string()
    .min(5, { error: "Please enter the full restaurant address." })
    .trim(),
  description: z
    .string()
    .min(10, { error: "Description must be at least 10 characters long." })
    .trim(),
  cuisineType: z.string().trim().optional(),
  openingTime: z.string().trim().optional(),
  closingTime: z.string().trim().optional(),
  logoUrl: z.url({ error: "Logo upload failed. Please try again." }).optional(),
});

export type RestaurantFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof RestaurantRegisterFormSchema>, string[]>>;
      message?: string;
    }
  | undefined;

export const RIDER_VEHICLE_TYPES = ["bicycle", "motorcycle", "scooter", "car"] as const;

export const RiderRegisterFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { error: "Full name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email address." }).trim().toLowerCase(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { error: "Password must contain at least one letter." })
    .regex(/[0-9]/, { error: "Password must contain at least one number." })
    .trim(),
  phone: z
    .string()
    .trim()
    .min(7, { error: "Please enter a valid phone number." })
    .regex(/^[0-9+\-\s()]+$/, { error: "Please enter a valid phone number." }),
  address: z
    .string()
    .min(5, { error: "Please enter your full address." })
    .trim(),
  city: z
    .string()
    .min(2, { error: "Please enter your city." })
    .trim(),
  vehicleType: z.enum(RIDER_VEHICLE_TYPES, { error: "Please select your vehicle type." }),
  vehicleNumber: z.string().trim().optional(),
  licenseNumber: z
    .string()
    .min(3, { error: "Please enter your driving licence number." })
    .trim(),
  photoUrl: z.url({ error: "Photo upload failed. Please try again." }).optional(),
});

export type RiderFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof RiderRegisterFormSchema>, string[]>>;
      message?: string;
    }
  | undefined;
