'use client';

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How does the online food delivery work?",
    answer: "You can browse our menu, select your favorite dishes, and place an order through our app or website. Once confirmed, our local partners prepare the meal, and our delivery driver brings it hot and fresh straight to your doorstep."
  },
  {
    question: "What are your delivery hours and areas?",
    answer: "We deliver from 8:00 AM to 11:00 PM daily. We cover all major metropolitan zones and surrounding neighborhoods. You can enter your postal code at checkout to confirm delivery availability in your specific area."
  },
  {
    question: "Can I modify or cancel my order after placing it?",
    answer: "You can modify or cancel your order within 2 minutes of placing it through your order tracking dashboard. After that time, the kitchen usually starts preparation, making changes unavailable."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, mobile wallets (Apple Pay, Google Pay), online banking, and cash on delivery (COD) depending on your region."
  },
  {
    question: "How can I contact customer support if I have an issue?",
    answer: "Our customer support team is available 24/7 via the in-app live chat widget, or you can reach out through our official email and support hotline listed on our contact page."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4">
          <HelpCircle className="w-4 h-4" />
          GOT QUESTIONS?
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-base text-gray-600 max-w-xl mx-auto">
          Find answers to common questions about our ordering process, delivery times, and service policies.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {FAQ_DATA.map((item, index: number) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-gray-900 focus:outline-none cursor-pointer"
              >
                <span className="text-base sm:text-lg">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-emerald-600 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-96 opacity-100 pb-5 px-6" : "max-h-0 opacity-0 px-6"
                }`}
              >
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-3">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}