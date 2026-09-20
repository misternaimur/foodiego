"use client";

import { useState } from "react";
import {
  Sparkles,
  Pizza,
  Salad,
  Flame,
  IceCream,
  Utensils,
  ArrowRight,
  ShoppingCart,
  Star,
} from "lucide-react";

const preferences = [
  { name: "Pizza", icon: Pizza },
  { name: "Healthy", icon: Salad },
  { name: "Spicy", icon: Flame },
  { name: "Dessert", icon: IceCream },
  { name: "Surprise Me", icon: Utensils },
];

const recommendations = {
  Pizza: [
    {
      name: "Chicken Cheese Pizza",
      price: "৳420",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
    },
    {
      name: "Pepperoni Pizza",
      price: "৳380",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    },
    {
      name: "Classic Margherita",
      price: "৳350",
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600&q=80",
    },
  ],

  Healthy: [
    {
      name: "Healthy Green Bowl",
      price: "৳280",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    },
    {
      name: "Fresh Salad Bowl",
      price: "৳250",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
    },
    {
      name: "Avocado Bowl",
      price: "৳320",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    },
  ],

  Spicy: [
    {
      name: "Spicy Chicken Wings",
      price: "৳330",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&q=80",
    },
    {
      name: "Spicy Fried Chicken",
      price: "৳290",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80",
    },
    {
      name: "Hot Chicken Burger",
      price: "৳360",
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    },
  ],

  Dessert: [
    {
      name: "Chocolate Cake",
      price: "৳220",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    },
    {
      name: "Strawberry Dessert",
      price: "৳250",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
    },
    {
      name: "Creamy Pancakes",
      price: "৳280",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80",
    },
  ],

  "Surprise Me": [
    {
      name: "Crispy Chicken Burger",
      price: "৳320",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    },
    {
      name: "Creamy Pasta",
      price: "৳380",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
    },
    {
      name: "Chicken Rice Bowl",
      price: "৳300",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    },
  ],
};

type Preference = keyof typeof recommendations;

export default function AIRecommendation() {
  const [selectedPreference, setSelectedPreference] =
    useState<Preference | null>(null);

  const selectedFoods = selectedPreference
    ? recommendations[selectedPreference]
    : [];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-12">
          <p className="text-xs sm:text-sm font-bold text-green-700 tracking-[0.2em] uppercase mb-3">
            FOODIEGO AI
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15462D] tracking-tight">
            Let AI Pick Your Next Bite ✨
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tell us what you&apos;re craving and let Foodiego find a meal
            you&apos;ll love.
          </p>
        </div>

        {/* Main AI Box */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#15462D] via-[#176044] to-[#4C2678] px-6 sm:px-10 lg:px-16 py-12 lg:py-16 text-white shadow-xl">

          {/* Decorative Background */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-400/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left Side */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-xs font-semibold tracking-wide mb-6">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                POWERED BY FOODIEGO AI
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Find Your Perfect
                <br />
                Food Match
              </h3>

              <p className="mt-5 text-sm sm:text-base text-emerald-50/85 max-w-lg leading-relaxed">
                Choose your mood and Foodiego AI will suggest meals that
                match your taste.
              </p>

              <div className="mt-7 flex items-center gap-3 text-sm text-white/70">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                Personalized food suggestions
              </div>
            </div>

            {/* Right Side */}
            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-6 sm:p-8">

              <p className="text-base font-bold text-white mb-5">
                What are you in the mood for?
              </p>

              {/* Preferences */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {preferences.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedPreference === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() =>
                        setSelectedPreference(item.name as Preference)
                      }
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-3 py-5 text-xs sm:text-sm font-semibold border transition-all duration-200 ${
                        isSelected
                          ? "bg-white text-[#15462D] border-white scale-[1.03] shadow-lg"
                          : "border-white/10 bg-white/10 text-white hover:bg-white hover:text-[#15462D] hover:scale-[1.03]"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      {item.name}
                    </button>
                  );
                })}
              </div>

              {/* Initial Message */}
              {!selectedPreference && (
                <div className="mt-6 rounded-2xl bg-white/10 border border-white/10 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-yellow-300/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                    </div>

                    <div>
                      <p className="text-xs text-white/60">
                        Personalized for you
                      </p>

                      <p className="text-sm font-semibold text-white">
                        Choose a preference to get started
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Preference */}
              {selectedPreference && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs text-white/60">
                        AI Recommendations
                      </p>

                      <h4 className="text-xl font-bold">
                        Picks for {selectedPreference} ✨
                      </h4>
                    </div>

                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  </div>

                  {/* Food Cards */}
                  <div className="space-y-3">
                    {selectedFoods.map((food) => (
                      <div
                        key={food.name}
                        className="flex items-center gap-3 rounded-2xl bg-white p-3 text-[#15462D] shadow-sm"
                      >
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold truncate">
                            {food.name}
                          </h5>

                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              {food.rating}
                            </div>

                            <span className="text-xs text-gray-400">•</span>

                            <span className="text-sm font-bold">
                              {food.price}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="w-9 h-9 rounded-full bg-[#15462D] text-white flex items-center justify-center hover:bg-[#176044] transition-colors shrink-0"
                          aria-label={`Add ${food.name} to cart`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* View More */}
                  <button
                    type="button"
                    className="mt-5 w-full flex items-center justify-center gap-2 rounded-full bg-white text-[#15462D] px-5 py-3 text-sm font-bold hover:bg-emerald-50 transition-colors"
                  >
                    Explore More Foods
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}