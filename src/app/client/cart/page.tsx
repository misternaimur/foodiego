'use client';

import React, { useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useApp } from '@/context/AppContext';
import { ShoppingBag, ArrowLeft, Plus, Minus, ShieldCheck } from 'lucide-react';

export default function CartPage() {
    const { cart, addToCart, removeFromCart, user, isAuthLoading } = useApp();
    const router = useRouter();
    // Prevent hydration mismatch for local storage/context data
    const isMounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = cart.length > 0 ? 2.99 : 0;
    const total = subtotal + deliveryFee;

    const handleCheckout = () => {
        if (isAuthLoading) return;

        const checkoutTarget = '/client/checkout';

        if (user) {
            router.push(checkoutTarget);
            return;
        }

        router.push(`/auth/login?redirect=${encodeURIComponent(checkoutTarget)}`);
    };

    if (!isMounted) {
        return (
            <main className="min-h-[70vh] bg-[#faf9f6] flex items-center justify-center">
                <div className="animate-pulse text-gray-400 font-medium text-sm">Loading your cart...</div>
            </main>
        );
    }

    if (cart.length === 0) {
        return (
            <main className="min-h-[80vh] bg-[#faf9f6] flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm text-center space-y-6">
                    <div className="w-20 h-20 bg-red-50 text-[#c83214] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                        <ShoppingBag size={36} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Your cart is empty</h1>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Looks like you haven&apos;t added any delicious meals yet. Explore our top restaurants and discover your next favorite food!
                        </p>
                    </div>
                    <div>
                        <Link
                            href="/discover"
                            className="inline-flex items-center justify-center w-full bg-[#c83214] text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-[#a6280f] transition-all shadow-sm hover:shadow active:scale-[0.98]"
                        >
                            Explore Menu
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#faf9f6] text-gray-900 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header & Back Action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Review Your Order</h1>
                        <p className="text-sm text-gray-500 mt-1">You have {cart.reduce((acc, item) => acc + item.quantity, 0)} items in your cart</p>
                    </div>
                    <Link 
                        href="/discover"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#c83214] hover:text-[#a6280f] transition-colors w-fit"
                    >
                        <ArrowLeft size={16} />
                        <span>Continue Shopping</span>
                    </Link>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Section: Cart Items List */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/70 shadow-2xs hover:shadow-md transition-all gap-4"
                            >
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                        <Image 
                                            src={item.imageUrl} 
                                            alt={item.name} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-300" 
                                        />
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">{item.name}</h3>
                                        <p className="text-xs sm:text-sm font-medium text-gray-500">{item.restaurantName || 'Foodiego Partner'}</p>
                                        <p className="text-sm font-bold text-[#c83214] pt-1">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                                    <div className="flex items-center gap-2 bg-[#faf9f6] p-1.5 rounded-xl border border-gray-200/60">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-7 h-7 rounded-lg bg-white text-gray-700 hover:bg-gray-100 font-bold flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="font-bold text-sm text-gray-800 w-6 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="w-7 h-7 rounded-lg bg-white text-gray-700 hover:bg-gray-100 font-bold flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Section: Order Summary Card */}
                    <div className="lg:col-span-5 xl:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/70 shadow-sm space-y-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                            Order Summary
                        </h2>
                        
                        <div className="space-y-3.5 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="font-semibold text-gray-800">${deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3.5 flex justify-between text-base font-bold text-gray-900">
                                <span>Total Amount</span>
                                <span className="text-xl text-[#c83214]">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-[#c83214] hover:bg-[#a6280f] text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
                        >
                            Proceed to Checkout
                        </button>

                        <div className="bg-[#faf9f6] p-3.5 rounded-2xl flex items-center gap-3 border border-gray-200/50">
                            <ShieldCheck size={22} className="text-[#c83214] shrink-0" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Safe & Secure Checkout. Your food will be freshly prepared and delivered hot.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}