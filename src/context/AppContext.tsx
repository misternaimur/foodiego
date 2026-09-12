'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FoodItem } from '@/components/FoodCard';
import { auth } from '@/lib/firebase/client';
import { logout } from '@/app/(public)/actions/auth';

// Type definition for selected options like size or choice modifiers
export interface SelectedOption {
    name: string;
    price: number;
}

// Type definition for items inside the shopping cart (FoodItem + Customization details)
export interface CartItem extends FoodItem {
    cartItemId: string; // Unique ID based on specific customizations (size, addons, instructions)
    selectedSize?: SelectedOption;
    selectedAddons?: SelectedOption[];
    specialInstructions?: string;
    quantity: number;
    totalUnitPrice: number;
}

// Structure for authenticated user profile data
export interface AuthUser {
    uid: string;
    name: string;
    email: string | null;
    avatarUrl?: string | null;
}

// Structure for restaurant promotional offers
export interface RestaurantOffer {
    id: string;
    title: string;
    description?: string;
    discountPercent?: number;
    code?: string;
}

// Structure for individual restaurant menu items
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isAvailable: boolean;
    popular?: boolean;
}

// Structure for grouped menu categories in a restaurant
export interface RestaurantMenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

// Complete Restaurant Entity Structure aligned with Backend
export interface Restaurant {
    logoUrl: boolean;
    id: string;                    // (MongoDB _id)
    userId: string;
    restaurantName: string;
    slug: string;
    ownerName: string;
    email: string;
    phone?: string;
    address: string;
    description?: string;
    logo: string;
    image: string;
    cuisineType?: string;
    cuisines: string[];
    openingTime?: string;
    closingTime?: string;
    isOpen: boolean;
    status: 'pending' | 'approved' | 'rejected';
    rating: number;
    reviewCount: number;
    deliveryTime: string;
    deliveryFee: number;
    minOrder: number;
    badge?: string;
    offers: RestaurantOffer[];
    menuCategories: RestaurantMenuCategory[];
}

type RawRestaurant = Partial<Restaurant> & {
    _id?: string;
    logoUrl?: string;
    imageUrl?: string;
};

// Payload options structure when adding items to cart
interface CustomizationOptions {
    selectedSize?: SelectedOption;
    selectedAddons?: SelectedOption[];
    specialInstructions?: string;
    quantity?: number;
}

// Global Application Context Type Blueprint
interface AppContextType {
    cart: CartItem[];
    favorites: string[];
    user: AuthUser | null;
    isAuthLoading: boolean;
    restaurants: Restaurant[];
    isRestaurantsLoading: boolean;
    getRestaurantBySlug: (slug: string) => Restaurant | undefined;
    getRestaurantById: (id: string) => Restaurant | undefined;
    addToCart: (food: FoodItem, customization?: CustomizationOptions) => void;
    removeFromCart: (cartItemId: string) => void;
    toggleFavorite: (id: string) => void;
    clearCart: () => void;
    logoutUser: () => Promise<void>;
}

// Create the React Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Local storage persistent keys
const CART_STORAGE_KEY = 'foodiego_cart';
const FAVORITES_STORAGE_KEY = 'foodiego_favorites';

// Helper function to normalize Firebase user data into a clean AuthUser object
const normalizeAuthUser = (firebaseUser: { uid: string; displayName: string | null; email: string | null; photoURL: string | null } | null): AuthUser | null => {
    if (!firebaseUser) return null;

    const fallbackName = firebaseUser.email?.split('@')[0] ?? 'Foodiego User';

    return {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName?.trim() || fallbackName,
        email: firebaseUser.email,
        avatarUrl: firebaseUser.photoURL,
    };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Cart state initialized lazily from browser localStorage
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Failed to load cart from localStorage:', error);
            return [];
        }
    });

    // Favorites list state initialized lazily from browser localStorage
    const [favorites, setFavorites] = useState<string[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
            return savedFavorites ? JSON.parse(savedFavorites) : [];
        } catch (error) {
            console.error('Failed to load favorites from localStorage:', error);
            return [];
        }
    });

    // Authentication states
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Restaurant data states
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isRestaurantsLoading, setIsRestaurantsLoading] = useState(true);

    // Effect to monitor Firebase authentication state changes in real-time
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(normalizeAuthUser(firebaseUser));
            setIsAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Effect to fetch restaurants from the backend API and map fields correctly
    useEffect(() => {
        const fetchRestaurants = async () => {
            setIsRestaurantsLoading(true);
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:000';
                const res = await fetch(`${API_URL}/api/restaurants`);

                if (!res.ok) {
                    throw new Error('Failed to fetch restaurants');
                }

                const data = await res.json();
                const rawList = Array.isArray(data) ? data : data.data || [];

                // ব্যাকএন্ড ফিল্ডগুলোর সাথে ফ্রন্টএন্ডের প্রপার্টির ম্যাপিং নিশ্চিত করা
                const formattedRestaurants: Restaurant[] = rawList.map((item: RawRestaurant) => ({
                    id: item._id || item.id || '',
                    userId: item.userId,
                    restaurantName: item.restaurantName || 'Unnamed restaurant',
                    slug: item.slug || item.restaurantName?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    ownerName: item.ownerName || '',
                    email: item.email || '',
                    phone: item.phone,
                    address: item.address || '',
                    description: item.description,
                    logo: item.logoUrl || item.logo || '/default-logo.png',
                    image: item.imageUrl || item.image || '/default-banner.png',
                    cuisineType: item.cuisineType,
                    cuisines: item.cuisines || (item.cuisineType ? [item.cuisineType] : []),
                    openingTime: item.openingTime,
                    closingTime: item.closingTime,
                    isOpen: item.isOpen ?? true,
                    status: item.status || 'pending',
                    rating: item.rating || 0,
                    reviewCount: item.reviewCount || 0,
                    deliveryTime: item.deliveryTime || '30-40 min',
                    deliveryFee: item.deliveryFee || 0,
                    minOrder: item.minOrder || 0,
                    badge: item.badge,
                    offers: item.offers || [],
                    menuCategories: item.menuCategories || [],
                }));

                setRestaurants(formattedRestaurants);
            } catch (err) {
                console.error('Failed to load restaurants:', err);
            } finally {
                setIsRestaurantsLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    // Synchronize cart state modifications with browser localStorage
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
        }
    }, [cart]);

    // Synchronize favorites state modifications with browser localStorage
    useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error('Failed to save favorites to localStorage:', error);
        }
    }, [favorites]);

    // Lookup restaurant by its URL slug
    const getRestaurantBySlug = (slug: string) => {
        return restaurants.find((r) => r.slug === slug);
    };

    // Lookup restaurant by its unique database ID
    const getRestaurantById = (id: string) => {
        return restaurants.find((r) => r.id === id);
    };

    // Add item to cart or increment quantity if custom configuration matches
    const addToCart = (food: FoodItem, customization?: CustomizationOptions) => {
        const selectedSize = customization?.selectedSize;
        const selectedAddons = customization?.selectedAddons || [];
        const specialInstructions = customization?.specialInstructions || '';
        const qty = customization?.quantity || 1;

        // Compute aggregate unit price incorporating size and addon costs
        const addonsPrice = selectedAddons.reduce((sum, item) => sum + item.price, 0);
        const sizePrice = selectedSize ? selectedSize.price : 0;
        const totalUnitPrice = food.price + sizePrice + addonsPrice;

        // Generate a composite unique key identifier based on specific choices
        const addonKeys = selectedAddons.map((a) => a.name).sort().join('-');
        const cartItemId = `${food.id}_${selectedSize?.name || 'def'}_${addonKeys}_${specialInstructions}`;

        setCart((prev) => {
            const existing = prev.find((item) => item.cartItemId === cartItemId);
            if (existing) {
                // Increment quantity if identical configured item already exists
                return prev.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            // Append new configured item into the cart
            return [
                ...prev,
                {
                    ...food,
                    cartItemId,
                    selectedSize,
                    selectedAddons,
                    specialInstructions,
                    quantity: qty,
                    totalUnitPrice,
                },
            ];
        });
    };

    // Remove or decrement specific cart item quantity
    const removeFromCart = (cartItemId: string) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.cartItemId === cartItemId);

            if (existing && existing.quantity > 1) {
                // Decrement item quantity if count exceeds 1
                return prev.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }

            // Completely filter out the item if quantity drops to 1 or lower
            return prev.filter((item) => item.cartItemId !== cartItemId);
        });
    };

    // Toggle restaurant or item in/out of the user's favorites array
    const toggleFavorite = (id: string) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(id)
                ? prevFavorites.filter((favId) => favId !== id)
                : [...prevFavorites, id]
        );
    };

    // Completely clear all contents from the shopping cart
    const clearCart = () => {
        setCart([]);
    };

    // Securely terminate user session across both Firebase and backend systems
    const logoutUser = async () => {
        try {
            await signOut(auth);
        } finally {
            await logout();
        }
    };

    return (
        <AppContext.Provider
            value={{
                cart,
                favorites,
                user,
                isAuthLoading,
                restaurants,
                isRestaurantsLoading,
                getRestaurantBySlug,
                getRestaurantById,
                addToCart,
                removeFromCart,
                toggleFavorite,
                clearCart,
                logoutUser,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// Custom React hook for consuming global app state context safely
export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};