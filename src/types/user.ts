// src/types/user.ts

export type UserRole = "admin" | "client" | "vendor" | "rider";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ClientProfile extends BaseUser {
  role: "client";
  addresses?: Array<{
    id: string;
    title: string;
    fullAddress: string;
    isDefault: boolean;
  }>;
}

export interface VendorProfile extends BaseUser {
  role: "vendor";
  restaurantId?: string;
  cuisineType?: string[];
  isOpen?: boolean;
}

export interface RiderProfile extends BaseUser {
  role: "rider";
  vehicleType?: string;
  licenseNumber?: string;
  status: "online" | "offline" | "busy" | "pending";
}

export type UserProfile = ClientProfile | VendorProfile | RiderProfile | BaseUser;