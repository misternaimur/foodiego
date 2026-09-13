'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, Plus, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CheckoutPage() {
  const router = useRouter(); // Fixed hook instantiation[cite: 15]
  const { cart, user, clearCart } = useApp();

  // Active step state: 'address' | 'payment' | 'review'[cite: 15]
  const [activeStep, setActiveStep] = useState<'address' | 'payment' | 'review'>('address');

  // Address & Payment form states[cite: 15]
  const [address, setAddress] = useState({
    street: '',
    city: '',
    zip: '',
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication Redirect Guard[cite: 15]
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, router]);

  // Order Calculations[cite: 15]
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.totalUnitPrice || item.price) * item.quantity,
    0
  );
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 0.0 : 0.0; 
  const tax = subtotal * 0.08; 
  const total = subtotal + deliveryFee + tax;

  // Handler to post order to your backend API[cite: 11]
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsSubmitting(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Build payload matching your MongoDB orderBooking backend schema[cite: 11]
    const orderPayload = {
      customerId: user?.uid, // Links customer ID[cite: 11]
      restaurantId: cart[0]?.id, // Links targeted restaurant[cite: 11]
      deliveryAddress: address.street ? `${address.street}, ${address.city} ${address.zip}` : 'Default Address',
      paymentMethod,
      items: cart.map((item) => ({
        menuItemId: item.id, // Validated against backend MenuItem schema[cite: 11]
        quantity: item.quantity,
        price: item.totalUnitPrice || item.price,
        specialInstructions: item.specialInstructions || '',
      })),
      totalAmount: total,
    };

    try {
      const res = await fetch(`${API_URL}/api/orders`, {[cite: 11]
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');[cite: 11]
      }

      alert('Order placed successfully!');
      clearCart();
      router.push('/');
    } catch (err: any) {
      alert(`Order Failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent render if not logged in to prevent flash of content[cite: 15]
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF7EE] flex items-center justify-center">
        <p className="text-sm text-gray-500 font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7EE] py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">Checkout</h1>

        {/* Multi-Step Tab Header */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveStep('address')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeStep === 'address'
                ? 'bg-[#15462D] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <MapPin size={14} />
            <span>Address</span>
            <ChevronRight size={14} className="opacity-60" />
          </button>

          <button
            onClick={() => setActiveStep('payment')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeStep === 'payment'
                ? 'bg-[#15462D] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CreditCard size={14} />
            <span>Payment</span>
            <ChevronRight size={14} className="opacity-60" />
          </button>

          <button
            onClick={() => setActiveStep('review')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeStep === 'review'
                ? 'bg-[#15462D] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 size={14} />
            <span>Review</span>
          </button>
        </div>

        {/* Main Section Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Interactive Forms */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs">
            {/* STEP 1: ADDRESS */}
            {activeStep === 'address' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <MapPin size={18} />
                  <h2>Delivery Address</h2>
                </div>

                {!isAddingAddress ? (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-700 hover:border-[#15462D] hover:text-[#15462D] transition-all cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Add New Address</span>
                  </button>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        placeholder="123 Main Street, Apt 4B"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#15462D]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          placeholder="Dhaka / Khulna"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#15462D]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          placeholder="1200"
                          value={address.zip}
                          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                          className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#15462D]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setActiveStep('payment')}
                  className="bg-[#15462D] hover:bg-[#0f3421] text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* STEP 2: PAYMENT */}
            {activeStep === 'payment' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <CreditCard size={18} />
                  <h2>Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-[#15462D] bg-[#15462D]/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-[#15462D]"
                      />
                      <span className="text-xs font-bold text-gray-800">Credit / Debit Card</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-[#15462D] bg-[#15462D]/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#15462D]"
                      />
                      <span className="text-xs font-bold text-gray-800">Cash on Delivery</span>
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveStep('address')}
                    className="border border-gray-200 text-gray-700 text-xs font-bold px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setActiveStep('review')}
                    className="bg-[#15462D] hover:bg-[#0f3421] text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Continue to Review</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {activeStep === 'review' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <CheckCircle2 size={18} />
                  <h2>Review Your Order</h2>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.cartItemId || item.id} className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900">
                        ${((item.totalUnitPrice || item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="w-full bg-[#F6A429] hover:bg-[#e0931f] text-gray-900 font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors text-xs uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing Order...' : `Place Order ($${total.toFixed(2)})`}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (Sidebar Card) */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs">
            <h3 className="text-xs font-bold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 text-xs text-gray-600 font-medium pb-4 border-b border-gray-100">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-bold text-emerald-700">
                  {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-black text-gray-900 pt-4">
              <span>Total</span>
              <span className="text-base text-[#15462D]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}