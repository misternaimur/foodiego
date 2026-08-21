    'use client';

    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { FoodItem } from '@/components/FoodCard';

    export interface CartItem extends FoodItem {
    quantity: number;
    }

    interface AppContextType {
    cart: CartItem[];
    favorites: string[]; // Stores Food Item IDs
    addToCart: (food: FoodItem) => void;
    removeFromCart: (id: string) => void;
    toggleFavorite: (id: string) => void;
    }

    const AppContext = createContext<AppContextType | undefined>(undefined);

    export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load saved state from LocalStorage on initial load
    useEffect(() => {
        const savedCart = localStorage.getItem('foodiego_cart');
        const savedFavorites = localStorage.getItem('foodiego_favorites');

        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    }, []);

    // Save Cart updates to LocalStorage
    useEffect(() => {
        localStorage.setItem('foodiego_cart', JSON.stringify(cart));
    }, [cart]);

    // Save Favorites updates to LocalStorage
    useEffect(() => {
        localStorage.setItem('foodiego_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToCart = (food: FoodItem) => {
        setCart((prev) => {
        const existing = prev.find((item) => item.id === food.id);
        if (existing) {
            return prev.map((item) =>
            item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        return [...prev, { ...food, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === id);

            // If quantity is more than 1, decrease quantity by 1
            if (existing && existing.quantity > 1) {
            return prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            );
            }

            // If quantity is 1, remove the item completely from cart
            return prev.filter((item) => item.id !== id);
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