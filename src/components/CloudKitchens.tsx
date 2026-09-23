"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Clock, Store, ShoppingCart, ArrowRight, UtensilsCrossed } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { CartItem } from "@/context/AppContext";

interface KitchenCard {
  id: string;
  name: string;
  cuisine: string;
  prepTime: string;
  rating: number;
  deliveryTime: string;
  tags: string[];
}

const KITCHEN_MENUS: Record<string, { name: string; price: number; imageUrl: string }[]> = {
  "1": [
    { name: "Chicken Biryani", price: 180, imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&q=80" },
    { name: "Butter Chicken", price: 220, imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&q=80" },
    { name: "Garlic Naan", price: 80, imageUrl: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=200&q=80" },
  ],
  "2": [
    { name: "Classic Cheeseburger", price: 250, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80" },
    { name: "Chicken Wings", price: 320, imageUrl: "https://images.unsplash.com/photo-1585136917260-20fbd18f5109?w=200&q=80" },
    { name: "French Fries", price: 120, imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&q=80" },
  ],
  "3": [
    { name: "Green Bowl", price: 280, imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80" },
    { name: "Quinoa Salad", price: 240, imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80" },
    { name: "Smoothie Bowl", price: 190, imageUrl: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200&q=80" },
  ],
};

const DEFAULT_MENU: { name: string; price: number; imageUrl: string }[] = [
  { name: "Chef's Special", price: 200, imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80" },
  { name: "House Favorite", price: 150, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80" },
];

const KITCHENS: KitchenCard[] = [
  {
    id: "1",
    name: "Spice Kingdom",
    cuisine: "Indian • Asian",
    prepTime: "10 min",
    rating: 4.8,
    deliveryTime: "20–30 min",
    tags: ["⚡ Cloud Kitchen Exclusive", "Vegetarian Available"],
  },
  {
    id: "2",
    name: "Burger Lab",
    cuisine: "American • Burgers",
    prepTime: "12 min",
    rating: 4.6,
    deliveryTime: "25–35 min",
    tags: ["⚡ Cloud Kitchen Exclusive", "Family Pack"],
  },
  {
    id: "3",
    name: "Fresh Bowl Co.",
    cuisine: "Healthy • Salads",
    prepTime: "14 min",
    rating: 4.9,
    deliveryTime: "20–30 min",
    tags: ["⚡ Cloud Kitchen Exclusive", "Low Calorie"],
  },
];

export default function CloudKitchens() {
  const router = useRouter();
  const { addToCart } = useApp();

  const handleOrder = (kitchen: KitchenCard) => {
    const menu = KITCHEN_MENUS[kitchen.id] || DEFAULT_MENU;
    menu.forEach((item) => {
      addToCart(
        {
id: `${kitchen.id}-${item.name}`,
          cartItemId: `${kitchen.id}-${item.name}`,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          restaurantName: kitchen.name,
          description: "",
          rating: kitchen.rating,
          deliveryTime: kitchen.deliveryTime,
          deliveryFee: "2.99",
          cuisine: kitchen.cuisine,
          quantity: 1,
          totalUnitPrice: item.price,
          isFavorite: false,
          sizes: [],
          addons: [],
        } as CartItem,
        { quantity: 1 }
      );
    });
    router.push("/cart");
  };

  const handleCombinedOrder = () => {
    const allKitchens: KitchenCard[] = [
      { id: "1", name: "Spice Kingdom", cuisine: "Indian", prepTime: "10 min", rating: 4.8, deliveryTime: "20-30 min", tags: [] },
      { id: "2", name: "Burger Lab", cuisine: "American", prepTime: "12 min", rating: 4.6, deliveryTime: "25-35 min", tags: [] },
      { id: "3", name: "Fresh Bowl Co.", cuisine: "Healthy", prepTime: "14 min", rating: 4.9, deliveryTime: "20-30 min", tags: [] },
    ];
    allKitchens.forEach((kitchen) => {
      const menu = KITCHEN_MENUS[kitchen.id] || DEFAULT_MENU;
      menu.slice(0, 1).forEach((item) => {
        addToCart(
          {
            id: `${kitchen.id}-${item.name}`,
          cartItemId: `${kitchen.id}-${item.name}`,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            restaurantName: kitchen.name,
            description: "",
            rating: kitchen.rating,
            deliveryTime: kitchen.deliveryTime,
            deliveryFee: "2.99",
            cuisine: kitchen.cuisine,
            quantity: 1,
            totalUnitPrice: item.price,
            isFavorite: false,
            sizes: [],
            addons: [],
          } as CartItem,
          { quantity: 1 }
        );
      });
    });
    router.push("/cart");
  };

  // Padding belongs on the max-w-7xl container, matching the other homepage
  // sections. With it on the outer <section> instead, the container computed to
  // min(1280, viewport - 96), so this section was narrower than its neighbours at
  // laptop widths and 64px wider at 1600px.
  return (
    <section className="w-full py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-xs font-extrabold tracking-[0.15em] text-[#F49D37] uppercase mb-1">
              FAST & FRESH
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Cloud Kitchens
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#124734] hover:text-[#F49D37] transition-colors cursor-pointer"
          >
            View all
            <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {KITCHENS.map((kitchen, idx) => (
            <motion.div
              key={kitchen.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="group bg-white rounded-[24px] border border-[#ECE7D9] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div
                className="cursor-pointer"
                onClick={() => handleOrder(kitchen)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A]">
                        {kitchen.name}
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {kitchen.cuisine}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#FAF7EE] px-2.5 py-1 rounded-full">
                      <Zap size={12} className="text-[#F49D37] fill-[#F49D37]/20" />
                      <span className="text-xs font-bold text-[#0F172A]">
                        {kitchen.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-[#124734]" />
                      <span className="text-xs font-medium text-[#0F172A]">
                        Prep {kitchen.prepTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Store size={13} className="text-[#124734]" />
                      <span className="text-xs font-medium text-[#0F172A]">
                        Deliver {kitchen.deliveryTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {kitchen.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold bg-[#124734]/8 text-[#124734] px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full ring-2 ring-white bg-[#ECE7D9] flex items-center justify-center"
                        >
                          <ShoppingCart size={11} className="text-[#124734]/40" />
                        </div>
                      ))}
                      <span className="text-[10px] text-[#6B7280] pl-1 self-center">
                        12+ ordered today
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); handleOrder(kitchen); }}
                      className="flex items-center gap-1 text-xs font-semibold text-white bg-[#F49D37] hover:bg-[#e0931f] px-3.5 py-2 rounded-full transition-colors cursor-pointer"
                    >
                      <UtensilsCrossed size={11} />
                      Order
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 rounded-[24px] bg-[#124734] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F49D37]/20 flex items-center justify-center">
              <ShoppingCart size={22} className="text-[#F49D37]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Multi-restaurant combined cart
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                Order from multiple cloud kitchens in one cart. One delivery fee.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCombinedOrder}
            className="shrink-0 bg-[#F49D37] hover:bg-[#e0931f] text-[#0F172A] text-xs font-extrabold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            Try Combined Order
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

