"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Clock,
  CreditCard,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Truck,
  Utensils,
  Zap,
} from "lucide-react";
import AIFoodChat from "@/components/AIFoodChat";
import Food3DBackground from "@/components/Food3DBackground";

const assistantTools = [
  {
    title: "Personal picks",
    description: "Discover meals matched to your mood, taste and moment.",
    icon: Utensils,
    href: "/restaurants",
    tone: "bg-emerald-50 text-[#15462D] border-emerald-100",
  },
  {
    title: "Order clarity",
    description: "Get simple answers about status, changes and delivery.",
    icon: Truck,
    href: "/client/track",
    tone: "bg-amber-50 text-amber-900 border-amber-100",
  },
  {
    title: "Payment help",
    description: "Understand promos, refunds, wallets and checkout options.",
    icon: CreditCard,
    href: "/client/profile",
    tone: "bg-purple-50 text-purple-900 border-purple-100",
  },
  {
    title: "Faster decisions",
    description: "Move from a question to a restaurant or order in one step.",
    icon: Zap,
    href: "/offers",
    tone: "bg-rose-50 text-rose-900 border-rose-100",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function AiAssistantPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF7EE]">
      <Food3DBackground activeSection="support" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(246,164,41,0.12),transparent_28rem),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.1),transparent_30rem),linear-gradient(180deg,rgba(250,247,238,0.2),rgba(250,247,238,0.92))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(21,70,45,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(21,70,45,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />

      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-3xl text-center"
        >
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-emerald-900/10 bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#15462D] shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Foodiego intelligence
          </div>
          <h1 className="mt-6 text-4xl font-black leading-[1.04] tracking-tight text-[#124734] sm:text-5xl lg:text-6xl">
            Your food concierge,
            <span className="block bg-gradient-to-r from-[#15462D] via-[#1d6b48] to-[#F6A429] bg-clip-text text-transparent"> one conversation away.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            From the first craving to the final bite, ask about meals, orders,
            delivery and payments. Foodiego AI turns everyday questions into
            clearer, faster choices.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-[#15462D]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Personalized discovery
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              Instant answers
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
              Helpful guidance
            </span>
          </div>
        </motion.section>

        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:mt-14"
        >
          <motion.div variants={item} className="relative min-w-0">
            <div className="pointer-events-none absolute -inset-1 rounded-[2.2rem] bg-gradient-to-br from-emerald-200/70 via-amber-200/50 to-purple-200/60 blur-xl" />
            <div className="relative">
              <AIFoodChat />
            </div>
          </motion.div>

          <motion.aside variants={item} className="space-y-5 lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-emerald-900/10 bg-[#124734] p-6 text-white shadow-[0_20px_60px_rgba(18,71,52,0.2)]">
              <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-amber-400/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-12 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">Always available</p>
                  <h2 className="mt-3 text-2xl font-black leading-tight">Ask. Explore. Order.</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 border border-white/15">
                  <Bot className="h-5 w-5 text-amber-300" />
                </div>
              </div>
              <p className="relative mt-4 text-sm leading-6 text-emerald-50/75">
                A friendly assistant for the moments when you need a recommendation, a status update or a little inspiration.
              </p>
              <div className="relative mt-6 flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
                <MessageCircle className="h-5 w-5 shrink-0 text-amber-300" />
                <p className="text-xs leading-5 text-emerald-50/80">Try: “Find me a cozy dinner under budget.”</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-900/10 bg-white/85 p-5 shadow-lg shadow-emerald-900/5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15462D]/50">Assistant toolkit</p>
                  <h3 className="mt-2 text-lg font-black text-[#124734]">Made for real food moments</h3>
                </div>
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
              <div className="mt-5 space-y-3">
                {assistantTools.map(({ title, description, icon: Icon, href, tone }) => (
                  <Link
                    key={title}
                    href={href}
                    className="group flex items-start gap-3 rounded-2xl border p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors group-hover:bg-[#15462D] group-hover:text-white ${tone}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-black text-[#124734]">{title}</p>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#15462D]" />
                      </div>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500">{description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-900/10 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-lg shadow-emerald-900/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#15462D] text-white">
                  <Zap className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#124734]">One less step</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">Ask a question, then move straight to the answer that matters.</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </motion.section>
      </main>
    </div>
  );
}
