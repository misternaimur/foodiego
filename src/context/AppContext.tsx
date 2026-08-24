    'use client';

    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { FoodItem } from '@/components/FoodCard';

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

    interface AppContextType {
    cart: CartItem[];
    favorites: string[];
    addToCart: (
        food: FoodItem,
        customization?: {
        selectedSize?: SelectedOption;
        selectedAddons?: SelectedOption[];
        specialInstructions?: string;
        quantity?: number;
        }
    ) => void;
    removeFromCart: (cartItemId: string) => void;
    toggleFavorite: (id: string) => void;
    }

    const AppContext = createContext<AppContextType | undefined>(undefined);

    export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('foodiego_cart');
        const savedFavorites = localStorage.getItem('foodiego_favorites');

        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    }, []);

    useEffect(() => {
        localStorage.setItem('foodiego_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('foodiego_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToCart = (food: FoodItem, customization) => {
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
        setFavorites((prev) =>
        prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
        );
    };

    return (
        <AppContext.Provider value={{ cart, favorites, addToCart, removeFromCart, toggleFavorite }}>
        {children}
        </AppContext.Provider>
    );
    };

    export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within an AppProvider');
    return context;
    };