'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, addToCart, removeFromCart } = useApp();

  // Prevent background layout shift caused by scrollbar hiding
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.totalUnitPrice || item.price) * item.quantity,
    0
  );
  const deliveryFee = cart.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Overlay Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#15462D]" />
            <h2 className="text-lg font-extrabold text-gray-900">Your Cart</h2>
            <span className="bg-emerald-100 text-[#15462D] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {totalCount} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <ShoppingBag size={32} />
              </div>
              <p className="text-gray-900 font-bold text-base">Your cart is empty</p>
              <p className="text-gray-500 text-xs mt-1 max-w-xs">
                Looks like you haven&apos;t added any food items yet.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId || item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7EE]/60 border border-gray-100"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500 font-medium">
                    ${((item.totalUnitPrice || item.price) * item.quantity).toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white p-0.5">
                      <button
                        onClick={() => removeFromCart(item.cartItemId || item.id)}
                        className="p-1 hover:bg-gray-100 text-gray-600 rounded-md transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          addToCart(item, {
                            selectedSize: item.selectedSize,
                            selectedAddons: item.selectedAddons,
                            quantity: 1,
                          })
                        }
                        className="p-1 hover:bg-gray-100 text-gray-600 rounded-md transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.cartItemId || item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-emerald-700">
                  {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-base text-[#15462D]">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/client/checkout"
              onClick={onClose}
              className="w-full bg-[#F6A429] hover:bg-[#e0931f] text-gray-900 font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors text-xs uppercase tracking-wider shadow-md cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;