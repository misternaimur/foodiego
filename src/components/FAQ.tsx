'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'How does the online food delivery work?',
    answer:
      'You can browse our menu, select your favorite dishes, and place an order through our app or website. Once confirmed, our local partners prepare the meal, and our delivery driver brings it hot and fresh straight to your doorstep.',
  },
  {
    question: 'What are your delivery hours and areas?',
    answer:
      'We deliver from 8:00 AM to 11:00 PM daily. We cover all major metropolitan zones and surrounding neighborhoods. You can enter your postal code at checkout to confirm delivery availability in your specific area.',
  },
  {
    question: 'Can I modify or cancel my order after placing it?',
    answer:
      'You can modify or cancel your order within 2 minutes of placing it through your order tracking dashboard. After that time, the kitchen usually starts preparation, making changes unavailable.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit/debit cards, mobile wallets (Apple Pay, Google Pay), online banking, and cash on delivery (COD) depending on your region.',
  },
  {
    question: 'How can I contact customer support if I have an issue?',
    answer:
      'Our customer support team is available 24/7 via the in-app live chat widget, or you can reach out through our official email and support hotline listed on our contact page.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-transparent py-20 lg:py-28">
      {/* max-w-7xl, matching every other homepage section. This was max-w-6xl,
          which rendered 1152px against their 1280px and sat 64px in from the
          shared left edge. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main FAQ Container */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ECFDF3] via-white to-[#F3E8FF] border border-white/70 shadow-xl px-5 sm:px-8 lg:px-12 py-12 lg:py-16">

          {/* Decorative Background */}
          <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full bg-purple-300/20 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">

            {/* Left Content */}
            <div className="lg:sticky lg:top-24">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-5">
                <HelpCircle className="w-4 h-4" />
                FOODIEGO SUPPORT
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#15462D] leading-tight">
                Everything You
                <br />
                Need To Know
              </h2>

              {/* Subtitle */}
              <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-md leading-relaxed">
                Find quick answers about ordering, payments, delivery, and
                everything you need to enjoy a smoother Foodiego experience.
              </p>

              {/* Support Card */}
              <div className="mt-8 rounded-3xl bg-[#15462D] p-6 text-white shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-emerald-300" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Still have questions?
                    </p>

                    <p className="text-xs text-emerald-50/70 mt-1 leading-relaxed">
                      Our support team is always ready to help you.
                    </p>

                    <button
                      type="button"
                      className="mt-4 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
                    >
                      Contact Support →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-3">
              {FAQ_DATA.map((item, index: number) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                      isOpen
                        ? 'bg-white border-emerald-200 shadow-md'
                        : 'bg-white/80 border-white shadow-sm hover:shadow-md hover:border-emerald-100'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-4 min-w-0">

                        {/* Question Number */}
                        <span
                          className={`flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-extrabold shrink-0 transition-all duration-300 ${
                            isOpen
                              ? 'bg-[#15462D] text-white'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span
                          className={`text-sm sm:text-base font-bold transition-colors ${
                            isOpen
                              ? 'text-[#15462D]'
                              : 'text-gray-800'
                          }`}
                        >
                          {item.question}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all duration-300 ${
                          isOpen
                            ? 'bg-[#15462D] text-white'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Answer */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 sm:px-6 pb-5">
                          <div className="ml-12 border-t border-emerald-100 pt-4">
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}