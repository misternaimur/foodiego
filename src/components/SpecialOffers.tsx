"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Tag, Truck, Check } from "lucide-react";

const offers = [
  {
    id: 1,
    title: "20% OFF",
    subtitle: "Selected Restaurants",
    description:
      "Enjoy your favorite meals from selected restaurants with an exclusive discount.",
    icon: Tag,
    popular: false,
    dark: false,
    button: "ORDER NOW",
  },
  {
    id: 2,
    title: "FREE DELIVERY",
    subtitle: "Weekend Special",
    description:
      "Get your favorite food delivered to your door without any delivery charges.",
    icon: Truck,
    popular: true,
    dark: true,
    button: "EXPLORE NOW",
  },
  {
    id: 3,
    title: "$100 OFF",
    subtitle: "On Your First Order",
    description:
      "New to Foodiego? Start your food journey with a special discount on your first order.",
    icon: Clock,
    popular: false,
    dark: false,
    button: "GET OFFER",
  },
];

export default function SpecialOffers() {
  return (
    <section className="w-full bg-transparent py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-3xl font-extrabold text-red-600 uppercase mb-3">
            SPECIAL OFFERS
          </p>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-green-900 tracking-tight mb-4">
            Craving More, Paying Less?
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            Enjoy exclusive deals, free delivery and special discounts on
            your favorite food.
          </p>
        </div>

        {/* Offers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 items-center">

          {offers.map((offer) => {
            const Icon = offer.icon;

            return (
              <div
                key={offer.id}
                className={`
                  relative flex flex-col rounded-[2rem] overflow-hidden
                  transition-all duration-300 hover:-translate-y-2
                  ${
                    offer.dark
                      ? "bg-[#14532D] text-white shadow-2xl md:scale-[1.04] py-9"
                      : "bg-white text-green-900 border border-green-900/10 shadow-lg py-8"
                  }
                `}
              >

                {/* Popular Badge */}
                {offer.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2">
                    <div className="bg-[#F6A429] text-gray-900 text-[10px] sm:text-xs font-extrabold tracking-wider px-5 py-2 rounded-b-full">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="px-7 sm:px-8 flex flex-col flex-1">

                  {/* Icon */}
                  <div
                    className={`
                      flex items-center justify-center
                      w-12 h-12 rounded-full mb-6
                      ${
                        offer.dark
                          ? "bg-white/10 border border-white/10"
                          : "bg-green-900/10"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Subtitle */}
                  <p
                    className={`
                      text-sm font-semibold mb-2
                      ${
                        offer.dark
                          ? "text-emerald-100"
                          : "text-gray-500"
                      }
                    `}
                  >
                    {offer.subtitle}
                  </p>

                  {/* Title */}
                  <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                    {offer.title}
                  </h3>

                  {/* Divider */}
                  <div
                    className={`
                      w-full h-px mb-6
                      ${
                        offer.dark
                          ? "bg-white/15"
                          : "bg-green-900/10"
                      }
                    `}
                  />

                  {/* Features */}
                  <div className="space-y-3 mb-8">

                    <div className="flex items-start gap-3">
                      <Check
                        className={`
                          w-4 h-4 mt-0.5 shrink-0
                          ${
                            offer.dark
                              ? "text-emerald-300"
                              : "text-emerald-700"
                          }
                        `}
                      />
                      <span className="text-sm opacity-80">
                        Exclusive Foodiego deal
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Check
                        className={`
                          w-4 h-4 mt-0.5 shrink-0
                          ${
                            offer.dark
                              ? "text-emerald-300"
                              : "text-emerald-700"
                          }
                        `}
                      />
                      <span className="text-sm opacity-80">
                        Available for a limited time
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Check
                        className={`
                          w-4 h-4 mt-0.5 shrink-0
                          ${
                            offer.dark
                              ? "text-emerald-300"
                              : "text-emerald-700"
                          }
                        `}
                      />
                      <span className="text-sm opacity-80">
                        Quick & easy ordering
                      </span>
                    </div>

                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed opacity-70 mb-8">
                    {offer.description}
                  </p>

                  {/* Button */}
                  <Link
                    href="/restaurants"
                    className={`
                      mt-auto w-full flex items-center justify-between
                      px-5 py-3 rounded-full
                      text-xs sm:text-sm font-bold
                      transition-all duration-200
                      ${
                        offer.dark
                          ? "bg-white text-green-900 hover:bg-gray-100"
                          : "bg-green-900 text-white hover:bg-green-600"
                      }
                    `}
                  >
                    {offer.button}

                    <span
                      className={`
                        flex items-center justify-center
                        w-7 h-7 rounded-full
                        ${
                          offer.dark
                            ? "bg-green-900 text-white"
                            : "bg-white/15"
                        }
                      `}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>

                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}