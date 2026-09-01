'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, UtensilsCrossed, Sparkles, Pencil, Star,
  ShoppingBag, BadgeCheck, Store, LayoutDashboard, Search, Bell,
  ChevronDown, DollarSign, TrendingUp, Download, Flame, CheckCircle2,
  BarChart3, Calendar, Receipt, Camera, Loader2,
} from 'lucide-react';
import CreateMenuItem from '@/components/CreateMenuItem';
import { useApp } from '@/context/AppContext';

interface ClientDashboardProps {
  name?: string;
  role?: string;
  email?: string;
}

type TabId = 'overview' | 'orders' | 'menu' | 'ai-studio' | 'analytics';

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
  { id: 'ai-studio', label: 'AI Food Studio', icon: Sparkles },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const infoFields = [
  { icon: Store, label: 'Business Name', value: 'Truffle House Kitchen' },
  { icon: Mail, label: 'Email', value: 'hello@trufflehouse.co' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 019-2834' },
  { icon: MapPin, label: 'Address', value: '128 Savor Avenue, Foodiego City' },
  { icon: UtensilsCrossed, label: 'Cuisine Type', value: 'Gourmet Burgers & Sides' },
  { icon: BadgeCheck, label: 'Member Since', value: 'March 2024' },
];

const stats = [
  { icon: UtensilsCrossed, label: 'Menu Items', value: '24' },
  { icon: ShoppingBag, label: 'Orders Today', value: '38' },
  { icon: Star, label: 'Avg. Rating', value: '4.8' },
];

interface LiveOrder {
  id: string; customer: string; item: string; qty: number;
  status: 'Preparing' | 'Ready' | 'On the way'; time: string;
}

const liveOrdersSeed: LiveOrder[] = [
  { id: '#A2041', customer: 'Aarav Mehta', item: 'Truffle Smashburger', qty: 2, status: 'Preparing', time: '2 min ago' },
  { id: '#A2042', customer: 'Sofia Reyes', item: 'Woodfired Margherita', qty: 1, status: 'Ready', time: '5 min ago' },
  { id: '#A2043', customer: 'Liam Chen', item: 'Truffle Smashburger', qty: 1, status: 'On the way', time: '8 min ago' },
  { id: '#A2044', customer: 'Noor Khan', item: 'Crispy Fries', qty: 3, status: 'Preparing', time: '1 min ago' },
];

const popularItemsSeed = [
  { name: 'Truffle Smashburger', orders: 124, revenue: 2294, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200' },
  { name: 'Woodfired Margherita', orders: 98, revenue: 2156, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=200' },
  { name: 'Crispy Truffle Fries', orders: 76, revenue: 836, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=200' },
  { name: 'Iced Caramel Latte', orders: 54, revenue: 432, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=200' },
];

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.995 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }} className={className}>
      {children}
    </motion.div>
  );
}

function statusBadge(s: LiveOrder['status']) {
  return s === 'Preparing' ? 'bg-amber-50 text-amber-700 border border-amber-200'
    : s === 'Ready' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    : 'bg-blue-50 text-blue-700 border border-blue-200';
}

export default function ClientDashboard({
  name = 'abid',
  role = 'restaurant',
}: ClientDashboardProps) {
  const router = useRouter();
  const { logoutUser } = useApp();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'Today' | 'This Week' | 'This Month'>('Today');
  const [orderFilter, setOrderFilter] = useState<'All' | LiveOrder['status']>('All');
  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | '90d'>('7d');

  // AI Food Studio state
  const [studioName, setStudioName] = useState('');
  const [studioPrice, setStudioPrice] = useState('');
  const [studioCuisine, setStudioCuisine] = useState('Gourmet Burgers');
  const [studioTags, setStudioTags] = useState<string[]>(['Signature']);
  const [studioImage, setStudioImage] = useState<string | null>(null);
  const [studioDragging, setStudioDragging] = useState(false);
  const [studioGenerating, setStudioGenerating] = useState(false);
  const studioAllTags = ['Appetizer', 'Spicy', 'Signature', 'Gluten-Free', 'Seafood', 'Vegetarian'];

  const handleStudioImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setStudioImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleStudioTag = (tag: string) =>
    setStudioTags((p) => (p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]));

  const submitStudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studioName.trim() || !studioPrice.trim()) {
      showToast('Please enter a dish name and price');
      return;
    }
    setStudioGenerating(true);
    window.setTimeout(() => {
      setStudioGenerating(false);
      showToast(`${studioName} draft created`);
      setStudioName('');
      setStudioPrice('');
      setStudioImage(null);
      setStudioTags(['Signature']);
    }, 1200);
  };

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  const metrics = useMemo(() => {
    const factor = dateFilter === 'Today' ? 1 : dateFilter === 'This Week' ? 6.5 : 27;
    return {
      orders: Math.round(38 * factor),
      revenue: Math.round(1240 * factor),
      rating: 4.8,
      growth: dateFilter === 'Today' ? 12 : dateFilter === 'This Week' ? 18 : 24,
    };
  }, [dateFilter]);

  const filteredOrders = useMemo(
    () => (orderFilter === 'All' ? liveOrdersSeed : liveOrdersSeed.filter((o) => o.status === orderFilter)),
    [orderFilter]
  );

  const bars = useMemo(() => {
    const seed =
      analyticsRange === '7d' ? [42, 58, 39, 71, 53, 64, 48]
      : analyticsRange === '30d' ? [22, 35, 41, 28, 50, 62, 47, 55, 38, 70, 66, 80]
      : [40, 55, 48, 62, 58, 72, 68, 75, 70, 82, 78, 88];
    return seed.map((v) => Math.min(100, v));
  }, [analyticsRange]);

  const popularTotal = popularItemsSeed.reduce((s, i) => s + i.revenue, 0);
  const liveCount = liveOrdersSeed.filter((o) => o.status === 'Preparing' || o.status === 'Ready').length;

  const downloadReport = () => {
    const now = new Date();
    const report = `Foodiego Merchant Dashboard Report\nGenerated: ${now.toLocaleString()}\nPeriod: ${dateFilter}\n\nToday's Orders: ${metrics.orders}\nRevenue: $${metrics.revenue.toLocaleString()}\nAvg Rating: ${metrics.rating}\nWeekly Growth: ${metrics.growth}%\nLive Orders: ${liveCount}\n\nPopular Items:\n${popularItemsSeed.map((i) => `${i.name} - ${i.orders} orders - $${i.revenue}`).join('\n')}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-report-${dateFilter.replace(/\s/g, '').toLowerCase()}-${now.toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Report downloaded');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf9f6] via-[#f4f1ea] to-[#fff7ec] font-sans">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="fixed bottom-6 right-6 z-[100] bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-orange-500/10 p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 flex items-center justify-center"><CheckCircle2 size={18} /></div>
            <p className="text-sm font-bold text-gray-900">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP UTILITY BAR */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search orders, menu items, customers..." className="w-full bg-white/80 backdrop-blur-xl text-sm text-gray-800 placeholder-gray-400 rounded-2xl pl-10 pr-4 py-2.5 border border-white/60 shadow-sm shadow-gray-200/50 focus:outline-none focus:ring-2 focus:ring-[#b93815]/30 focus:border-[#b93815]/40" />
          </div>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} className="relative p-2.5 bg-white/80 backdrop-blur-xl text-gray-600 hover:text-[#b93815] rounded-2xl border border-white/60 shadow-sm" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
          </motion.button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm px-2 py-1 rounded-full hover:bg-white transition-colors">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#fff1ec] to-[#fbe2d8] overflow-hidden flex items-center justify-center border border-white/60 shadow-inner">
              <span className="text-xs font-bold text-[#b93815]">{(name || 'U').charAt(0).toUpperCase()}</span>
            </div>
            <span className="hidden sm:inline-block max-w-[120px] truncate text-sm font-semibold text-gray-800">{name}</span>
          </button>
        </motion.div>
      </div>

      {/* HERO BANNER */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="relative bg-gradient-to-br from-[#ff7a3d] via-[#b93815] to-[#5b1503] rounded-3xl overflow-hidden border border-white/40 shadow-2xl shadow-orange-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(246,164,41,0.4),transparent_55%)]" />
          <div className="relative px-6 sm:px-10 pt-8 pb-20 sm:pb-24">
            <div className="flex items-center gap-3 text-white/90 text-xs font-semibold uppercase tracking-wider">
              <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/30">Merchant</span>
              <span>Premium Dashboard</span>
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow">Welcome back, {name}</h1>
            <p className="mt-1 text-white/80 text-sm max-w-xl">Here&apos;s what&apos;s happening with your restaurant today.</p>
          </div>
        </motion.div>
      </div>

      {/* OVERLAPPING AVATAR + IDENTITY */}
      <div className="relative -mt-14 sm:-mt-16 px-4 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-lg shadow-gray-300/40 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 -mt-16 sm:-mt-20 rounded-3xl border-[5px] border-white overflow-hidden bg-gray-100 shadow-2xl shadow-gray-400/40 shrink-0">
              <Image src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=200" alt="Merchant avatar" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{name}</h2>
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#fff1ec] to-[#fbe2d8] text-[#b93815] text-xs font-bold px-3 py-1 rounded-full border border-white/60 shadow-sm">
                  <BadgeCheck size={13} /> Foodiego Merchant
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Premium Dashboard · <span className="capitalize font-medium text-gray-700">{role}</span> account</p>
            </div>
            <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97, y: 2 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} className="inline-flex items-center gap-2 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] hover:from-[#b93815] hover:to-[#7a1d09] text-white font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-[#b93815]/40 border border-white/20 border-b-4 border-b-orange-800 active:border-b-0 active:translate-y-1 active:shadow-md transition-all shrink-0">
              <Pencil size={15} />
              Edit Profile
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* QUICK STATS */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((s) => (
            <TiltCard key={s.label} className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl flex items-center gap-4 p-6">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#fff1ec] to-[#fbe2d8] text-[#b93815] flex items-center justify-center shrink-0 shadow-inner border border-white/60">
                <s.icon size={22} />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 leading-none">{s.value}</p>
                <p className="text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wide">{s.label}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* MERCHANT ACTION BAR */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-6">
        <motion.section whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#fff1ec] to-[#fbe2d8] text-[#b93815] flex items-center justify-center shrink-0 shadow-inner border border-white/60">
              <Store size={28} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">Foodiego Merchant</h3>
              <p className="text-sm text-gray-500">Premium Dashboard</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97, y: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} onClick={() => setActiveTab('overview')} className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] hover:from-[#b93815] hover:to-[#7a1d09] text-white font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-[#b93815]/40 border border-white/20 border-b-4 border-b-orange-800 active:border-b-0 active:translate-y-1 active:shadow-md transition-all">
              <User size={16} /> View Profile
            </motion.button>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97, y: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
              <Link href="/client/dashboard" className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-b from-white to-gray-50 border border-white/60 border-b-4 border-b-gray-300 hover:border-b-[3px] hover:translate-y-[1px] text-gray-800 font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-gray-300/40 active:shadow-md transition-all ring-2 ring-[#b93815]/40">
                <LayoutDashboard size={16} /> Merchant Dashboard
              </Link>
            </motion.div>
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97, y: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} onClick={() => setActiveTab('menu')} className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-white to-gray-50 border border-white/60 border-b-4 border-b-gray-300 hover:border-b-[3px] hover:translate-y-[1px] text-gray-800 font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-gray-300/40 active:shadow-md transition-all">
              <Sparkles size={16} /> Create Menu Item
            </motion.button>
          </div>
        </motion.section>
      </div>

      {/* INTERNAL NAV + MAIN CONTENT */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-10 pb-12">
        {/* Mobile horizontal scrollable tabs */}
        <div className="md:hidden -mx-4 sm:-mx-8 px-4 sm:px-8 mb-4">
          <div className="flex flex-row overflow-x-auto no-scrollbar gap-2 w-full py-2">
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <motion.button key={t.id} whileTap={{ scale: 0.96 }} onClick={() => setActiveTab(t.id)} className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${isActive ? 'bg-orange-50 text-[#b93815] border-orange-200 shadow-sm' : 'bg-white/70 text-gray-600 border-white/60 hover:bg-white'}`}>
                  <t.icon size={14} />{t.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard Overview</h2>
                    <p className="mt-1 text-base text-gray-500">Here&apos;s what&apos;s happening with your restaurant.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)} className="appearance-none bg-white border border-white/60 text-sm font-semibold text-gray-700 rounded-2xl pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b93815]/30 shadow-sm">
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97, y: 2 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} onClick={downloadReport} className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] hover:from-[#b93815] hover:to-[#7a1d09] text-white font-semibold py-2.5 px-5 rounded-2xl shadow-lg shadow-[#b93815]/40 border border-white/20 border-b-4 border-b-orange-800 active:border-b-0 active:translate-y-1 active:shadow-md transition-all text-sm">
                      <Download size={16} /> Download Report
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: "Today's Orders", value: metrics.orders.toLocaleString(), icon: ShoppingBag, accent: 'from-blue-400 to-blue-600', soft: 'bg-blue-50', text: 'text-blue-600', ring: 'shadow-blue-500/20' },
                    { label: 'Revenue', value: `$${metrics.revenue.toLocaleString()}`, icon: DollarSign, accent: 'from-emerald-400 to-emerald-600', soft: 'bg-emerald-50', text: 'text-emerald-600', ring: 'shadow-emerald-500/20' },
                    { label: 'Avg Rating', value: metrics.rating, icon: Star, accent: 'from-amber-400 to-amber-600', soft: 'bg-amber-50', text: 'text-amber-600', ring: 'shadow-amber-500/20' },
                    { label: 'Weekly Growth', value: `${metrics.growth}%`, icon: TrendingUp, accent: 'from-purple-400 to-purple-600', soft: 'bg-purple-50', text: 'text-purple-600', ring: 'shadow-purple-500/20', progress: metrics.growth },
                  ].map((m) => (
                    <TiltCard key={m.label} className={`bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl ${m.ring} p-5`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-2xl ${m.soft} ${m.text} flex items-center justify-center shadow-inner border border-white/60`}>
                          <m.icon size={22} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{m.label}</p>
                          <p className="text-2xl font-extrabold text-gray-900 leading-none mt-1">{m.value}</p>
                        </div>
                      </div>
                      {m.progress !== undefined && (
                        <div className="mt-4">
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${m.progress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`h-full rounded-full bg-gradient-to-r ${m.accent}`} />
                          </div>
                          <p className="mt-1 text-[11px] text-gray-500 font-medium">Goal: 100%</p>
                        </div>
                      )}
                    </TiltCard>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-gray-900">Live Orders</h3>
                        <span className="relative inline-flex h-2.5 w-2.5">
                          <span className="absolute inset-0 inline-flex rounded-full bg-red-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-500">{liveCount} active</span>
                    </div>
                    <div className="space-y-3">
                      {liveOrdersSeed.map((o) => (
                        <div key={o.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-white/60 shadow-sm">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#b93815] flex items-center justify-center font-bold text-sm shrink-0">{o.id.slice(-2)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{o.customer}</p>
                            <p className="text-xs text-gray-500 truncate">{o.qty}× {o.item}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${statusBadge(o.status)}`}>{o.status}</span>
                            <p className="text-[10px] text-gray-400 mt-1">{o.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-extrabold text-gray-900">Popular Items Today</h3>
                      <span className="text-xs font-bold text-gray-500">${popularTotal.toLocaleString()}</span>
                    </div>
                    <div className="space-y-3">
                      {popularItemsSeed.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-3 p-2 rounded-2xl bg-white/70 border border-white/60 shadow-sm">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/60 shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.orders} sold</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-extrabold text-gray-900">${item.revenue}</p>
                            {i === 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 mt-0.5">
                                <Flame size={10} /> Top
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-10">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-6">Business Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                    {infoFields.map((f) => (
                      <div key={f.label} className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-500 flex items-center justify-center shrink-0 border border-white/60 shadow-inner">
                          <f.icon size={17} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{f.label}</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">{f.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Orders</h2>
                    <p className="mt-1 text-base text-gray-500">Track and manage incoming orders in real-time.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['All', 'Preparing', 'Ready', 'On the way'] as const).map((s) => (
                      <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => setOrderFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${orderFilter === s ? 'bg-orange-50 text-[#b93815] border-orange-200' : 'bg-white/70 text-gray-600 border-white/60 hover:bg-white'}`}>{s}</motion.button>
                    ))}
                  </div>
                </div>
                <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                  <div className="space-y-3">
                    {filteredOrders.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No orders match this filter.</p>
                    ) : (
                      filteredOrders.map((o) => (
                        <div key={o.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-white/60 shadow-sm">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#b93815] flex items-center justify-center font-bold text-sm shrink-0">{o.id.slice(-2)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{o.customer}</p>
                            <p className="text-xs text-gray-500 truncate">{o.qty}× {o.item}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${statusBadge(o.status)}`}>{o.status}</span>
                            <p className="text-[10px] text-gray-400 mt-1">{o.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            )}

            {activeTab === 'menu' && <CreateMenuItem />}

            {activeTab === 'analytics' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Analytics</h2>
                    <p className="mt-1 text-base text-gray-500">Trends and insights for your restaurant performance.</p>
                  </div>
                  <div className="flex gap-2">
                    {(['7d', '30d', '90d'] as const).map((r) => (
                      <motion.button key={r} whileTap={{ scale: 0.95 }} onClick={() => setAnalyticsRange(r)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${analyticsRange === r ? 'bg-orange-50 text-[#b93815] border-orange-200' : 'bg-white/70 text-gray-600 border-white/60 hover:bg-white'}`}>{r.toUpperCase()}</motion.button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { label: 'Total Orders', value: '1,284', icon: ShoppingBag, soft: 'bg-blue-50', text: 'text-blue-600' },
                    { label: 'Total Revenue', value: '$34,820', icon: DollarSign, soft: 'bg-emerald-50', text: 'text-emerald-600' },
                    { label: 'Avg Prep Time', value: '12 min', icon: Receipt, soft: 'bg-amber-50', text: 'text-amber-600' },
                  ].map((m) => (
                    <TiltCard key={m.label} className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-5 flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-2xl ${m.soft} ${m.text} flex items-center justify-center shadow-inner border border-white/60`}>
                        <m.icon size={22} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{m.label}</p>
                        <p className="text-2xl font-extrabold text-gray-900 leading-none mt-1">{m.value}</p>
                      </div>
                    </TiltCard>
                  ))}
                </div>
                <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-4">Revenue Trend</h3>
                  <div className="flex items-end gap-3 h-48">
                    {bars.map((h, i) => (
                      <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }} className="flex-1 rounded-t-xl bg-gradient-to-b from-[#ff7a3d] to-[#b93815] shadow-md border border-white/40" />
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            )}

            {activeTab === 'ai-studio' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">AI Food Studio</h2>
                    <p className="mt-1 text-base text-gray-500">Generate menu items with AI-powered image uploads.</p>
                  </div>
                </div>

                <form onSubmit={submitStudio} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 space-y-4">
                    <h3 className="text-lg font-extrabold text-gray-900">Dish Details</h3>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Dish Name</label>
                      <input value={studioName} onChange={(e) => setStudioName(e.target.value)} type="text" placeholder="Truffle Smashburger" className="w-full bg-white/70 text-sm text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#b93815]/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Price</label>
                        <input value={studioPrice} onChange={(e) => setStudioPrice(e.target.value)} type="text" placeholder="$18.50" className="w-full bg-white/70 text-sm text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#b93815]/30" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Cuisine</label>
                        <select value={studioCuisine} onChange={(e) => setStudioCuisine(e.target.value)} className="w-full bg-white/70 text-sm text-gray-800 rounded-xl px-4 py-2.5 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#b93815]/30">
                          <option>Gourmet Burgers</option>
                          <option>Italian Pizza</option>
                          <option>Asian Fusion</option>
                          <option>Healthy Bowls</option>
                          <option>Desserts</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {studioAllTags.map((tag) => (
                          <motion.button key={tag} type="button" whileTap={{ scale: 0.95 }} onClick={() => toggleStudioTag(tag)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${studioTags.includes(tag) ? 'bg-orange-50 text-[#b93815] border-orange-200' : 'bg-white/70 text-gray-600 border-white/60 hover:bg-white'}`}>{tag}</motion.button>
                        ))}
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={studioGenerating}
                      whileHover={{ scale: studioGenerating ? 1 : 1.04, y: studioGenerating ? 0 : -1 }}
                      whileTap={{ scale: 0.97, y: 2 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] hover:from-[#b93815] hover:to-[#7a1d09] text-white font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-[#b93815]/40 border border-white/20 border-b-4 border-b-orange-800 active:border-b-0 active:translate-y-1 active:shadow-md transition-all disabled:opacity-70"
                    >
                      {studioGenerating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><Sparkles size={16} /> Generate Dish</>}
                    </motion.button>
                  </TiltCard>

                  <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                    <h3 className="text-lg font-extrabold text-gray-900 mb-4">AI Image Upload</h3>
                    <label
                      onDragOver={(e) => { e.preventDefault(); setStudioDragging(true); }}
                      onDragLeave={() => setStudioDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setStudioDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith('image/')) handleStudioImage(file);
                      }}
                      className={`relative flex flex-col items-center justify-center gap-3 h-72 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
                        studioDragging ? 'border-[#b93815] bg-orange-50' : 'border-gray-300 bg-white/40 hover:border-[#b93815]/60'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleStudioImage(file);
                        }}
                      />
                      {studioImage ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                          <Image src={studioImage} alt="Uploaded dish" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); setStudioImage(null); }}
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#fff1ec] to-[#fbe2d8] text-[#b93815] flex items-center justify-center shadow-inner border border-white/60">
                            <Camera size={28} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-900">Drag & drop a food photo</p>
                            <p className="text-xs text-gray-500 mt-1">or click to browse · PNG, JPG up to 10MB</p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#b93815] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                            <Sparkles size={11} /> AI will auto-tag this dish
                          </span>
                        </>
                      )}
                    </label>
                    {studioImage && (
                      <button
                        type="button"
                        onClick={() => setStudioImage(null)}
                        className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 font-semibold"
                      >
                        Remove image
                      </button>
                    )}
                  </TiltCard>
                </form>
              </motion.div>
            )}
        </main>
      </div>
    </div>
  );
}