'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useApp();

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.totalUnitPrice || item.price) * item.quantity,
    0
  );
  const deliveryFee = cart.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any food items yet.</p>
        <Link
          href="/"
          className="inline-block bg-[#c83214] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#a6280f] transition-colors"
        >
          Explore Food
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartItemId || item.id}
              className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.restaurantName}</p>
                  
                  {/* Selected Custom Options Display */}
                  {item.selectedSize && (
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">
                      Size: {item.selectedSize.name}
                    </p>
                  )}
                  {item.selectedAddons && item.selectedAddons.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Extras: {item.selectedAddons.map((a) => a.name).join(', ')}
                    </p>
                  )}

                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    ${((item.totalUnitPrice || item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => removeFromCart(item.cartItemId || item.id)}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold"
                >
                  -
                </button>
                <span className="font-bold text-sm text-gray-800">{item.quantity}</span>
                <button
                  onClick={() =>
                    addToCart(item, {
                      selectedSize: item.selectedSize,
                      selectedAddons: item.selectedAddons,
                      specialInstructions: item.specialInstructions,
                      quantity: 1,
                    })
                  }
                  className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs h-fit space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Summary</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-gray-800">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-[#c83214] hover:bg-[#a6280f] text-white font-bold py-3.5 rounded-xl transition-colors mt-4">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </main>
  );
}