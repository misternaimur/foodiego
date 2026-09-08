'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ShoppingBag, ShieldCheck, Sparkles, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useApp();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#FAF7EE] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#113220] border-t-transparent animate-spin" />
      </main>
    );
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.totalUnitPrice || item.price) * item.quantity,
    0
  );
  const deliveryFee = cart.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#FAF7EE] w-full px-4 py-20 text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-[#113220]/10 rounded-full flex items-center justify-center mb-6 text-[#113220] shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 max-w-sm mb-8 text-sm">
          Looks like you haven&apos;t added any delicious food items to your cart yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#113220] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#1a4d31] transition-all shadow-lg shadow-[#113220]/20 hover:-translate-y-0.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Explore Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FAF7EE] w-full py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-900/10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Order</h1>
            <p className="text-xs text-gray-500 mt-1">Review your items before proceeding to checkout</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#113220] hover:text-[#1a4d31] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Add more items
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Item List (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartItemId || item.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-emerald-900/5 shadow-sm hover:shadow-md transition-all gap-4"
              >
                <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 shadow-inner">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 font-medium">{item.restaurantName}</p>
                    
                    {/* Selected Custom Options Display */}
                    {item.selectedSize && (
                      <div className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md text-[11px] font-semibold mt-1.5 mr-1.5 border border-emerald-100">
                        Size: {item.selectedSize.name}
                      </div>
                    )}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium mt-1.5">
                        + {item.selectedAddons.map((a) => a.name).join(', ')}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[11px] text-amber-800 italic mt-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                        Note: &quot;{item.specialInstructions}&quot;
                      </p>
                    )}

                    <div className="text-sm font-black text-[#113220] mt-2 sm:hidden">
                      ${((item.totalUnitPrice || item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                  <div className="hidden sm:block text-right">
                    <span className="text-sm font-black text-gray-900">
                      ${((item.totalUnitPrice || item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-emerald-900/10 rounded-xl p-1 bg-emerald-50/30">
                      <button
                        onClick={() => removeFromCart(item.cartItemId || item.id)}
                        className="w-8 h-8 rounded-lg bg-white text-gray-700 hover:bg-emerald-50 font-bold shadow-2xs transition-colors flex items-center justify-center cursor-pointer"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() =>
                          addToCart(item, {
                            selectedSize: item.selectedSize,
                            selectedAddons: item.selectedAddons,
                            specialInstructions: item.specialInstructions,
                            quantity: 1,
                          })
                        }
                        className="w-8 h-8 rounded-lg bg-white text-gray-700 hover:bg-emerald-50 font-bold shadow-2xs transition-colors flex items-center justify-center cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Card (Span 1 - Sticky) */}
          <div className="bg-[#113220] text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-emerald-950/10 h-fit space-y-6 sticky top-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center gap-2 border-b border-white/10 pb-4">
              <Sparkles className="w-5 h-5 text-[#F6A429]" />
              <h2 className="text-xl font-black text-white">Order Summary</h2>
            </div>

            <div className="relative z-10 space-y-3 text-sm text-emerald-100/80">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Estimated Delivery Fee</span>
                <span className="font-bold text-white">${deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-dashed border-white/15 pt-4 flex justify-between items-baseline text-base font-black text-white">
                <span>Total Amount</span>
                <span className="text-2xl text-[#F6A429]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="relative z-10 w-full bg-[#F6A429] hover:bg-[#e0931f] text-gray-900 font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-black/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider">
              <span>Proceed to Checkout</span>
            </button>

            <div className="relative z-10 flex items-center justify-center gap-2 text-xs text-emerald-200/60 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#F6A429]" />
              <span>Secure checkout powered by industry standards</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}