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
