'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FoodItem } from './FoodCard';
import { useApp, SelectedOption } from '@/context/AppContext';

interface FoodDetailsModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({ food, onClose }) => {
  const { addToCart } = useApp();

  const [selectedSize, setSelectedSize] = useState<SelectedOption | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<SelectedOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Set sizes & addons dynamically whenever food item changes
  useEffect(() => {
    if (food) {
      setSelectedSize(food.sizes && food.sizes.length > 0 ? food.sizes[0] : null);
      setSelectedAddons([]);
      setSpecialInstructions('');
      setQuantity(1);
    }
  }, [food]);

  if (!food) return null;

  const toggleAddon = (addon: SelectedOption) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const sizePrice = selectedSize ? selectedSize.price : 0;
  const unitPrice = food.price + sizePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(food, {
      selectedSize: selectedSize || undefined,
      selectedAddons,
      specialInstructions,
      quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-700 hover:bg-white shadow-sm transition-colors"
        >
          ✕
        </button>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="space-y-4">
            <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gray-100">
              <Image src={food.imageUrl} alt={food.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">{food.name}</h2>
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                  ★ {food.rating}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {food.restaurantName} • {food.cuisine}
              </p>
              <p className="text-sm text-gray-600 mt-2">{food.description}</p>
              <p className="text-lg font-bold text-[#c83214] mt-2">${food.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Dynamic Sizes Section */}
          {food.sizes && food.sizes.length > 0 && (
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900">Choose Option / Size</h3>
              <div className="space-y-2">
                {food.sizes.map((size) => (
                  <label
                    key={size.name}
                    onClick={() => setSelectedSize(size)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedSize?.name === size.name
                        ? 'border-[#c83214] bg-[#fdf2f0]'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm font-semibold text-gray-800">{size.name}</span>
                    <span className="text-xs text-gray-500">
                      {size.price === 0 ? 'Included' : `+$${size.price.toFixed(2)}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Extras Section */}
          {food.addons && food.addons.length > 0 && (
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900">Add Extras</h3>
              <div className="space-y-2">
                {food.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.name === addon.name);
                  return (
                    <label
                      key={addon.name}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#c83214] bg-[#fdf2f0]'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-semibold text-gray-800">{addon.name}</span>
                      <span className="text-xs text-gray-500">+$${addon.price.toFixed(2)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-900">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. No onions, sauce on the side..."
              className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c83214]/30"
              rows={2}
            />
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 font-bold text-gray-700 hover:bg-white rounded-lg transition-colors"
            >
              -
            </button>
            <span className="px-3 font-bold text-sm text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 font-bold text-gray-700 hover:bg-white rounded-lg transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#c83214] hover:bg-[#a6280f] text-white text-sm font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-between"
          >
            <span>Add to Cart</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};