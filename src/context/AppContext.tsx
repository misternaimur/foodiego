'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FoodItem } from '@/components/FoodCard';
import { auth } from '@/lib/firebase/client';
import { logout } from '@/app/(public)/actions/auth';

export interface SelectedOption {
    name: string;
    price: number;
}

export interface CartItem extends FoodItem {
    cartItemId: string; // Unique ID per custom configuration
    selectedSize?: SelectedOption;
    selectedAddons?: SelectedOption[];
    specialInstructions?: string;
    quantity: number;
    totalUnitPrice: number;
}

export interface AuthUser {
    uid: string;
    name: string;
    email: string | null;
    avatarUrl?: string | null;
}

interface CustomizationOptions {
    selectedSize?: SelectedOption;
    selectedAddons?: SelectedOption[];
    specialInstructions?: string;
    quantity?: number;
}

interface AppContextType {
    cart: CartItem[];
    favorites: string[];
    user: AuthUser | null;
    isAuthLoading: boolean;
    addToCart: (food: FoodItem, customization?: CustomizationOptions) => void;
    removeFromCart: (cartItemId: string) => void;
    toggleFavorite: (id: string) => void;
    clearCart: () => void;
    logoutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'foodiego_cart';
const FAVORITES_STORAGE_KEY = 'foodiego_favorites';

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

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(normalizeAuthUser(firebaseUser));
            setIsAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
        }
    }, [cart]);

    useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error('Failed to save favorites to localStorage:', error);
        }
    }, [favorites]);

    const addToCart = (food: FoodItem, customization?: CustomizationOptions) => {
        const selectedSize = customization?.selectedSize;
        const selectedAddons = customization?.selectedAddons || [];
        const specialInstructions = customization?.specialInstructions || '';
        const qty = customization?.quantity || 1;

        // Calculate unit price including options
        const addonsPrice = selectedAddons.reduce((sum, item) => sum + item.price, 0);
        const sizePrice = selectedSize ? selectedSize.price : 0;
        const totalUnitPrice = food.price + sizePrice + addonsPrice;

        // Unique ID based on choices
        const addonKeys = selectedAddons.map((a) => a.name).sort().join('-');
        const cartItemId = `${food.id}_${selectedSize?.name || 'def'}_${addonKeys}_${specialInstructions}`;

        setCart((prev) => {
            const existing = prev.find((item) => item.cartItemId === cartItemId);
            if (existing) {
                return prev.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
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

    const removeFromCart = (cartItemId: string) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.cartItemId === cartItemId);

            if (existing && existing.quantity > 1) {
                return prev.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }

            return prev.filter((item) => item.cartItemId !== cartItemId);
        });
    };

    const toggleFavorite = (id: string) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(id)
                ? prevFavorites.filter((favId) => favId !== id)
                : [...prevFavorites, id]
        );
    };

    const clearCart = () => {
        setCart([]);
    };

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

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};