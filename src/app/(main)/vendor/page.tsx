"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  MoreHorizontal,
  PackageCheck,
  Plus,
  ShoppingBag,
  Star,
  Store,
  TrendingUp,
  Utensils,
} from "lucide-react";

const orders = [
  { id: "#2847", customer: "Sarah Johnson", items: "2x Smash Burger, Fries", amount: "$42.98", status: "New", time: "2 min ago" },
  { id: "#2846", customer: "Michael Chen", items: "Korean Tacos", amount: "$14.50", status: "Preparing", time: "8 min ago" },
  { id: "#2845", customer: "Emily Rodriguez", items: "3x Matcha Tiramisu", amount: "$38.97", status: "Accepted", time: "15 min ago" },
  { id: "#2844", customer: "David Kim", items: "Burger, Soda", amount: "$22.98", status: "Delivered", time: "22 min ago" },
];

const stats = [
  { label: "Today's sales", value: "$24,850", change: "+12.5%", icon: DollarSign, tone: "bg-emerald-50 text-emerald-700" },
  { label: "Total orders", value: "186", change: "+8.2%", icon: ShoppingBag, tone: "bg-sky-50 text-sky-700" },
  { label: "Pending orders", value: "12", change: "Needs attention", icon: Clock3, tone: "bg-amber-50 text-amber-700" },
  { label: "Average rating", value: "4.8", change: "+0.3 this month", icon: Star, tone: "bg-rose-50 text-rose-700" },
];

const statusStyles: Record<string, string> = {
  New: "bg-emerald-50 text-emerald-700",
  Preparing: "bg-amber-50 text-amber-700",
  Accepted: "bg-sky-50 text-sky-700",
  Delivered: "bg-slate-100 text-slate-600",
};

export default function VendorDashboardHome() {
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "New", "Preparing", "Accepted", "Delivered"];
  const filteredOrders = activeTab === "All" ? orders : orders.filter((order) => order.status === activeTab);

  return (
    <div className="min-h-full bg-[#f6f8f7]">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-[#123b2b] px-6 py-7 text-white shadow-xl shadow-emerald-950/10 sm:px-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200"><Store size={15} /> Merchant workspace</div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Good morning, Alex&apos;s Kitchen</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-100/80">Keep today&apos;s service moving. Your latest sales, orders, and store health are all in one place.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex h-11 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20"><Bell size={17} /> Alerts</button>
              <button onClick={() => setIsStoreOpen((open) => !open)} className="flex h-11 items-center gap-3 rounded-xl bg-white px-4 text-sm font-bold text-[#123b2b] shadow-lg"><span className={`h-2.5 w-2.5 rounded-full ${isStoreOpen ? "bg-emerald-500" : "bg-slate-400"}`} />{isStoreOpen ? "Store open" : "Store closed"}</button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{stat.label}</p><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.tone}`}><Icon size={18} /></span></div><p className="mt-5 text-2xl font-black tracking-tight text-slate-950">{stat.value}</p><p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600"><TrendingUp size={14} /> {stat.change}</p></div>; })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><BarChart3 size={18} className="text-emerald-700" /><h2 className="text-lg font-bold text-slate-950">Sales overview</h2></div><p className="mt-1 text-sm text-slate-500">Revenue performance over the last seven days.</p></div><button className="hidden items-center gap-1 text-sm font-bold text-emerald-700 sm:flex">View report <ArrowUpRight size={15} /></button></div><div className="mt-8 flex h-56 items-end gap-2 border-b border-slate-100 px-2 sm:gap-4">{[42, 58, 47, 72, 64, 92, 80].map((height, index) => <div key={index} className="group flex h-full flex-1 flex-col justify-end gap-2"><div className="relative"><div className="mx-auto w-full max-w-12 rounded-t-lg bg-emerald-500 transition group-hover:bg-emerald-700" style={{ height: `${height * 1.8}px` }} /><span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block">${Math.round(height * 110)}</span></div><span className="text-center text-[11px] font-medium text-slate-400">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span></div>)}</div></div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2"><PackageCheck size={18} className="text-emerald-700" /><h2 className="text-lg font-bold text-slate-950">Store health</h2></div><p className="mt-1 text-sm text-slate-500">Your operation at a glance.</p></div><MoreHorizontal size={19} className="text-slate-400" /></div><div className="mt-7 flex items-center gap-5"><div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(#10b981 0 86%, #e2e8f0 86% 100%)" }}><div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white"><span className="text-2xl font-black text-slate-950">86%</span><span className="text-[10px] font-medium text-slate-400">healthy</span></div></div><div className="space-y-3 text-sm"><p className="flex items-center gap-2 text-slate-600"><CheckCircle2 size={16} className="text-emerald-500" /> 98% on-time prep</p><p className="flex items-center gap-2 text-slate-600"><Star size={16} className="text-amber-500" /> 4.8 customer rating</p><p className="flex items-center gap-2 text-slate-600"><Utensils size={16} className="text-sky-500" /> 42 menu items live</p></div></div></div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-lg font-bold text-slate-950">Recent orders</h2><p className="mt-1 text-sm text-slate-500">Track incoming orders and keep the kitchen moving.</p></div><Link href="/vendor/menu" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123b2b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2e22]"><Plus size={16} /> New menu item</Link></div><div className="mt-6 flex gap-2 overflow-x-auto border-b border-slate-100">{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 px-3 pb-3 text-sm font-bold ${activeTab === tab ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-400 hover:text-slate-700"}`}>{tab}</button>)}</div><div className="mt-2 overflow-x-auto"><table className="w-full min-w-170 text-left"><thead><tr className="text-[11px] uppercase tracking-wider text-slate-400"><th className="px-3 py-4 font-bold">Order</th><th className="px-3 py-4 font-bold">Customer</th><th className="px-3 py-4 font-bold">Items</th><th className="px-3 py-4 font-bold">Amount</th><th className="px-3 py-4 font-bold">Status</th><th className="px-3 py-4 font-bold">Time</th><th /></tr></thead><tbody className="divide-y divide-slate-100">{filteredOrders.map((order) => <tr key={order.id} className="text-sm transition hover:bg-slate-50"><td className="px-3 py-4 font-bold text-slate-900">{order.id}</td><td className="px-3 py-4 font-semibold text-slate-700">{order.customer}</td><td className="px-3 py-4 text-slate-500">{order.items}</td><td className="px-3 py-4 font-bold text-slate-900">{order.amount}</td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[order.status]}`}>{order.status}</span></td><td className="px-3 py-4 text-slate-400">{order.time}</td><td className="px-3 py-4 text-right"><ChevronRight size={17} className="text-slate-300" /></td></tr>)}</tbody></table></div></section>
      </div>
    </div>
  );
}
