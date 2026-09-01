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
  BarChart3, Calendar, Receipt, Camera, Loader2, Clock, X, ArrowRight,
} from 'lucide-react';
import CreateMenuItem from '@/components/CreateMenuItem';
import { useApp } from '@/context/AppContext';

interface ClientDashboardProps {
  name?: string;
  role?: string;
  email?: string;
}

type TabId = 'overview' | 'profile' | 'orders' | 'menu' | 'ai-studio' | 'analytics';

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: User },
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

const profileFields = [
  { icon: User, label: 'Owner Name', value: 'abid' },
  { icon: Mail, label: 'Email', value: 'abid@trufflehouse.co' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 019-2834' },
  { icon: BadgeCheck, label: 'Restaurant ID', value: 'VEN-10482' },
  { icon: Store, label: 'Business Name', value: 'Truffle House Kitchen' },
  { icon: MapPin, label: 'Address', value: '128 Savor Avenue, Foodiego City, CA 90001' },
  { icon: UtensilsCrossed, label: 'Cuisine Type', value: 'Gourmet Burgers & Sides' },
  { icon: Clock, label: 'Operating Hours', value: 'Mon-Sun · 10:00 AM - 11:00 PM' },
  { icon: Calendar, label: 'Joined Date', value: 'March 15, 2024' },
  { icon: Receipt, label: 'Tax ID', value: 'TX-8492-5521' },
  { icon: DollarSign, label: 'Payout Method', value: 'Bank Transfer · Chase ****4521' },
];

const profileStats = [
  { icon: ShoppingBag, label: 'Total Orders', value: '1,284' },
  { icon: Star, label: 'Avg. Rating', value: '4.8' },
  { icon: UtensilsCrossed, label: 'Menu Items', value: '24' },
  { icon: TrendingUp, label: 'Growth', value: '+18%' },
];

interface LiveOrder {
  id: string;
  customer: string;
  customerPhone?: string;
  item: string;
  qty: number;
  notes?: string;
  amount: number;
  status: 'New' | 'Accepted' | 'Preparing' | 'Ready' | 'Picked Up' | 'Delivered' | 'Rejected';
  rejectReason?: string;
  time: string;
  address?: string;
}

const liveOrdersSeed: LiveOrder[] = [
  { id: '#A2051', customer: 'Aarav Mehta', customerPhone: '+1 (555) 012-3344', item: 'Truffle Smashburger', qty: 2, amount: 37.0, status: 'New', time: 'Just now', address: '220 Maple St, Apt 4B', notes: 'Extra pickles please' },
  { id: '#A2050', customer: 'Sofia Reyes', customerPhone: '+1 (555) 022-9810', item: 'Woodfired Margherita', qty: 1, amount: 22.0, status: 'New', time: '4 min ago', address: '88 Oak Lane' },
  { id: '#A2048', customer: 'Liam Chen', customerPhone: '+1 (555) 873-2210', item: 'Truffle Smashburger', qty: 1, amount: 18.5, status: 'Accepted', time: '8 min ago', address: '14 Pine Court' },
  { id: '#A2047', customer: 'Noor Khan', customerPhone: '+1 (555) 661-2244', item: 'Crispy Fries', qty: 3, amount: 12.0, status: 'Preparing', time: '12 min ago', address: '501 Cedar Ave' },
  { id: '#A2046', customer: 'Diego R.', customerPhone: '+1 (555) 449-1100', item: 'Iced Caramel Latte', qty: 2, amount: 11.0, status: 'Ready', time: '15 min ago', address: '9 Elm Blvd' },
  { id: '#A2044', customer: 'Priya S.', customerPhone: '+1 (555) 220-7788', item: 'Truffle Smashburger', qty: 1, amount: 18.5, status: 'Picked Up', time: '22 min ago', address: '12 Birch Rd' },
  { id: '#A2043', customer: 'Marcus J.', customerPhone: '+1 (555) 909-6611', item: 'Woodfired Margherita', qty: 2, amount: 44.0, status: 'Delivered', time: '38 min ago', address: '7 Walnut Way' },
  { id: '#A2042', customer: 'Aisha R.', customerPhone: '+1 (555) 771-2200', item: 'Crispy Truffle Fries', qty: 1, amount: 8.0, status: 'Rejected', rejectReason: 'Item out of stock', time: '45 min ago', address: '63 Aspen Cir' },
  { id: '#A2041', customer: 'Ethan W.', customerPhone: '+1 (555) 332-9988', item: 'Iced Caramel Latte', qty: 1, amount: 5.5, status: 'Delivered', time: '1 hr ago', address: '44 Spruce Pl' },
  { id: '#A2040', customer: 'Maya P.', customerPhone: '+1 (555) 118-7733', item: 'Truffle Smashburger', qty: 1, amount: 18.5, status: 'Rejected', rejectReason: 'Customer requested cancel', time: '2 hr ago', address: '17 Hickory St' },
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

function Tilt3DCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const rotateY = (px - 0.5) * 14;
    const rotateX = -(py - 0.5) * 14;
    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03,1.03,1.03)`);
    setGlow({ x: px * 100, y: py * 100, opacity: 1 });
  };
  const onLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
    setGlow((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform, transition: 'transform 220ms cubic-bezier(0.2,0.8,0.2,1)' }}
      className={`relative will-change-transform ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: glow.opacity,
          background: `radial-gradient(220px circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)`,
        }}
      />
      {children}
    </div>
  );
}

function statusBadge(s: LiveOrder['status']) {
  const map: Record<LiveOrder['status'], string> = {
    'New': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Accepted': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    'Preparing': 'bg-amber-50 text-amber-700 border border-amber-200',
    'Ready': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Picked Up': 'bg-violet-50 text-violet-700 border border-violet-200',
    'Delivered': 'bg-teal-50 text-teal-700 border border-teal-200',
    'Rejected': 'bg-rose-50 text-rose-700 border border-rose-200',
  };
  return map[s];
}

function nextStatus(s: LiveOrder['status']): LiveOrder['status'] | null {
  const flow: Record<LiveOrder['status'], LiveOrder['status'] | null> = {
    'New': 'Accepted',
    'Accepted': 'Preparing',
    'Preparing': 'Ready',
    'Ready': 'Picked Up',
    'Picked Up': 'Delivered',
    'Delivered': null,
    'Rejected': null,
  };
  return flow[s];
}

function nextStatusLabel(s: LiveOrder['status']): string {
  const labels: Record<LiveOrder['status'], string> = {
    'New': 'Accept',
    'Accepted': 'Start Preparing',
    'Preparing': 'Mark Ready',
    'Ready': 'Mark Picked Up',
    'Picked Up': 'Mark Delivered',
    'Delivered': 'Completed',
    'Rejected': 'Rejected',
  };
  return labels[s];
}

export default function ClientDashboard({
  name = 'abid',
  role = 'restaurant',
}: ClientDashboardProps) {
  const router = useRouter();
  const { logoutUser } = useApp();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'Today' | 'This Week' | 'This Month' | 'This Year'>('Today');
  const [orderFilter, setOrderFilter] = useState<'All' | 'New' | 'Active' | 'History'>('All');
  const [orders, setOrders] = useState<LiveOrder[]>(liveOrdersSeed);
  const [showRejectFor, setShowRejectFor] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [chartMetric, setChartMetric] = useState<'Sales' | 'Orders'>('Sales');

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
    const factor = dateFilter === 'Today' ? 1 : dateFilter === 'This Week' ? 6.5 : dateFilter === 'This Month' ? 27 : 312;
    return {
      orders: Math.round(38 * factor),
      revenue: Math.round(1240 * factor),
      rating: 4.8,
      growth: dateFilter === 'Today' ? 12 : dateFilter === 'This Week' ? 18 : 24,
    };
  }, [dateFilter]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'All') return orders;
    if (orderFilter === 'New') return orders.filter((o) => o.status === 'New');
    if (orderFilter === 'Active') return orders.filter((o) => (['Accepted', 'Preparing', 'Ready', 'Picked Up'] as const).includes(o.status as never));
    if (orderFilter === 'History') return orders.filter((o) => (['Delivered', 'Rejected'] as const).includes(o.status as never));
    return orders;
  }, [orderFilter, orders]);

  const newCount = orders.filter((o) => o.status === 'New').length;
  const activeCount = orders.filter((o) => ['Accepted', 'Preparing', 'Ready', 'Picked Up'].includes(o.status as never)).length;
  const historyCount = orders.filter((o) => ['Delivered', 'Rejected'].includes(o.status as never)).length;
  const liveCount = newCount + activeCount;

  const acceptOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Accepted' } : o)));
    showToast('Order accepted');
  };
  const advanceOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const nxt = nextStatus(o.status);
        return nxt ? { ...o, status: nxt } : o;
      }),
    );
    showToast('Order updated');
  };
  const rejectOrder = (id: string) => {
    if (!rejectReason.trim()) {
      showToast('Please add a reason');
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Rejected', rejectReason: rejectReason.trim() } : o)));
    setShowRejectFor(null);
    setRejectReason('');
    showToast('Order rejected');
  };

  const bars = useMemo(() => {
    const seed =
      analyticsRange === '7d' ? [42, 58, 39, 71, 53, 64, 48]
      : analyticsRange === '30d' ? [22, 35, 41, 28, 50, 62, 47, 55, 38, 70, 66, 80]
      : [40, 55, 48, 62, 58, 72, 68, 75, 70, 82, 78, 88];
    return seed.map((v) => Math.min(100, v));
  }, [analyticsRange]);

  const popularTotal = popularItemsSeed.reduce((s, i) => s + i.revenue, 0);

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
          <button onClick={() => setActiveTab('profile')} aria-label="View profile" className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm px-2 py-1 rounded-full hover:bg-white transition-colors">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#fff1ec] to-[#fbe2d8] overflow-hidden flex items-center justify-center border border-white/60 shadow-inner">
              <span className="text-xs font-bold text-[#b93815]">{(name || 'U').charAt(0).toUpperCase()}</span>
            </div>
            <span className="hidden sm:inline-block max-w-[120px] truncate text-sm font-semibold text-gray-800">{name}</span>
          </button>
        </motion.div>
      </div>

      {/* HERO BANNER */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="relative bg-gradient-to-r from-[#ea580c] to-[#9a3412] rounded-3xl overflow-hidden border border-white/40 shadow-2xl shadow-orange-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(246,164,41,0.4),transparent_55%)]" />
          <div className="relative px-6 sm:px-10 pt-8 pb-20 sm:pb-24">
            <div className="flex items-center gap-3 text-white/90 text-xs font-extrabold uppercase tracking-wider">
              <span className="px-3 py-1 rounded-full bg-white/20 border border-white/40">Merchant</span>
              <span>Premium Dashboard</span>
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow">Welcome back, {name}</h1>
            <p className="mt-1 text-white/80 text-sm max-w-xl">Here&apos;s what&apos;s happening with your restaurant today.</p>
          </div>
        </motion.div>
      </div>

      {/* OVERLAPPING AVATAR + IDENTITY */}
      <div className="relative -mt-14 sm:-mt-16 px-4 sm:px-8 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }} className="bg-[#fdfbf7] border border-white/60 rounded-3xl shadow-xl shadow-lg shadow-gray-300/40 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 -mt-16 sm:-mt-20 rounded-2xl border-[5px] border-white overflow-hidden bg-gray-100 shadow-2xl shadow-gray-400/40 shrink-0">
              <Image src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=200" alt="Merchant avatar" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{name}</h2>
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#fff1ec] to-[#fbe2d8] text-[#b93815] text-xs font-bold px-3 py-1 rounded-full border border-white/60 shadow-sm">
                  <BadgeCheck size={13} /> Foodiego Merchant
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Premium Dashboard · Customer account</p>
            </div>
            <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97, y: 2 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} className="inline-flex items-center gap-2 bg-[#c2410c] hover:bg-[#9a3412] text-white font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-[#c2410c]/40 border border-white/20 transition-all shrink-0">
              <Pencil size={15} />
              Edit Profile
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* MERCHANT ACTION BAR */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-6">
        <motion.section whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97, y: 3 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
              <Link href="/client/dashboard" className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] hover:from-[#b93815] hover:to-[#7a1d09] text-white font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-[#b93815]/40 border border-white/20 border-b-4 border-b-orange-800 active:border-b-0 active:translate-y-1 active:shadow-md transition-all">
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
              <div className="space-y-8 relative">
                {/* Floating 3D gradient spheres background */}
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                  <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-gradient-to-br from-orange-300/40 via-amber-200/30 to-transparent blur-3xl" />
                  <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-rose-300/30 via-pink-200/20 to-transparent blur-3xl" />
                  <div className="absolute top-[420px] left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-200/30 via-teal-100/20 to-transparent blur-3xl" />
                  <div className="absolute -bottom-12 right-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-violet-300/30 via-indigo-100/20 to-transparent blur-3xl" />
                </div>

                {/* HEADER BAR */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
                      Dashboard Overview
                    </h2>
                    <p className="mt-1 text-base text-gray-500">Here&apos;s what&apos;s happening with your restaurant.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)} className="appearance-none bg-white/90 backdrop-blur-md border border-white/70 text-sm font-semibold text-gray-700 rounded-2xl pl-10 pr-10 py-2.5 shadow-lg shadow-gray-300/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 hover:shadow-xl transition-shadow">
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>This Year</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96, y: 3 }} transition={{ type: 'spring', stiffness: 320, damping: 18 }} onClick={downloadReport} className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-orange-500 via-orange-600 to-red-600 hover:from-orange-400 hover:via-orange-500 hover:to-red-500 text-white font-semibold py-2.5 px-5 rounded-2xl shadow-xl shadow-orange-500/40 border border-white/30 border-b-[5px] border-b-red-800/80 active:border-b-0 active:translate-y-1.5 active:shadow-md transition-all text-sm">
                      <Download size={16} /> Download Report
                    </motion.button>
                  </div>
                </div>

                {/* 3D METRIC CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { label: "Today's Sales", value: `$${metrics.revenue.toLocaleString()}`, delta: '+12.5%', icon: DollarSign, theme: { from: 'from-emerald-400', to: 'to-emerald-600', soft: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', ring: 'shadow-emerald-500/30' } },
                    { label: 'Total Orders', value: (metrics.orders * 14).toLocaleString(), delta: '+8.2%', icon: ShoppingBag, theme: { from: 'from-blue-400', to: 'to-blue-600', soft: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', ring: 'shadow-blue-500/30' } },
                    { label: 'Total Revenue', value: `$${(metrics.revenue * 14).toLocaleString()}`, delta: '+15.8%', icon: TrendingUp, theme: { from: 'from-violet-400', to: 'to-purple-600', soft: 'bg-violet-50', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700', ring: 'shadow-violet-500/30' } },
                    { label: 'Pending Orders', value: Math.max(2, Math.round(metrics.orders * 0.1)).toLocaleString(), delta: 'Requires Action', icon: Clock, theme: { from: 'from-amber-400', to: 'to-amber-600', soft: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', ring: 'shadow-amber-500/30' } },
                    { label: 'Active Orders', value: liveCount.toLocaleString(), delta: 'Kitchen Cooking', icon: Flame, theme: { from: 'from-rose-400', to: 'to-red-600', soft: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', ring: 'shadow-rose-500/30' } },
                    { label: 'Completed Orders', value: Math.round(metrics.orders * 0.75).toLocaleString(), delta: 'Ready for Pickup', icon: CheckCircle2, theme: { from: 'from-teal-400', to: 'to-cyan-600', soft: 'bg-teal-50', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-700', ring: 'shadow-teal-500/30' } },
                  ].map((m, i) => (
                    <Tilt3DCard key={m.label} className={`group rounded-3xl bg-white/80 backdrop-blur-md border border-white/70 shadow-2xl ${m.theme.ring} p-5`}>
                      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/40 via-transparent to-white/10 pointer-events-none" />
                      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-2xl pointer-events-none" />
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{m.label}</p>
                          <p className="mt-2 text-3xl font-extrabold text-gray-900 leading-none drop-shadow-sm">{m.value}</p>
                          <span className={`mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${m.theme.badge} shadow-inner`}>
                            {m.delta.startsWith('+') && <TrendingUp size={10} />}
                            {m.delta}
                          </span>
                        </div>
                        <motion.div whileHover={{ rotate: 8, scale: 1.08 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${m.theme.from} ${m.theme.to} text-white flex items-center justify-center shadow-xl ${m.theme.ring} border border-white/40`}>
                          <m.icon size={26} />
                        </motion.div>
                      </div>
                      <div className="relative mt-4 h-1 rounded-full bg-gradient-to-r from-transparent via-gray-200/80 to-transparent overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${55 + (i * 7) % 40}%` }} transition={{ duration: 1.2, delay: 0.1 * i, ease: 'easeOut' }} className={`h-full bg-gradient-to-r ${m.theme.from} ${m.theme.to} rounded-full`} />
                      </div>
                    </Tilt3DCard>
                  ))}
                </div>

                {/* 3D BAR CHART + LIVE ORDER STREAM */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* 3D BAR CHART */}
                  <Tilt3DCard className="lg:col-span-2 rounded-3xl bg-white/85 backdrop-blur-md border border-white/70 shadow-2xl shadow-gray-300/40 p-6">
                    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />
                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                          <BarChart3 size={20} className="text-orange-500" />
                          Performance Analytics
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Sales & order velocity across the last 7 days</p>
                      </div>
                      <div className="flex gap-1.5 bg-gray-100/80 rounded-2xl p-1 border border-white/60 shadow-inner">
                        {(['Sales', 'Orders'] as const).map((c) => (
                          <motion.button key={c} whileTap={{ scale: 0.95 }} onClick={() => setChartMetric(c)} className={`relative px-4 py-1.5 text-xs font-bold rounded-xl transition-colors ${chartMetric === c ? 'text-white' : 'text-gray-600'}`}>
                            {chartMetric === c && (
                              <motion.div layoutId="chart-pill" className="absolute inset-0 bg-gradient-to-b from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/40" transition={{ type: 'spring', stiffness: 380, damping: 28 }} />
                            )}
                            <span className="relative z-10">{c}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="relative h-64 flex items-end justify-between gap-2 sm:gap-3 px-2 pt-6" style={{ perspective: '1000px' }}>
                      {bars.map((v, i) => {
                        const heightPct = Math.max(8, v);
                        const value = chartMetric === 'Sales' ? Math.round(80 + v * 35) : Math.round(12 + v * 0.4);
                        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                        const isPeak = i === 4 || i === 5;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                            <div className="relative w-full" style={{ height: '180px' }}>
                              {/* Tooltip */}
                              <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                                <div className="bg-gray-900/95 backdrop-blur text-white text-[10px] font-bold rounded-lg px-2 py-1 shadow-xl whitespace-nowrap">
                                  {chartMetric === 'Sales' ? `$${value.toLocaleString()}` : `${value} orders`}
                                </div>
                                <div className="w-2 h-2 bg-gray-900/95 rotate-45 mx-auto -mt-1" />
                              </div>
                              {/* 3D bar */}
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: `${heightPct}%`, opacity: 1 }}
                                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] rounded-t-xl shadow-2xl"
                                style={{
                                  background: isPeak
                                    ? 'linear-gradient(180deg, #fb923c 0%, #ea580c 40%, #9a3412 100%)'
                                    : 'linear-gradient(180deg, #fcd34d 0%, #f59e0b 50%, #b45309 100%)',
                                  transform: 'rotateX(-12deg) rotateY(8deg) translateZ(8px)',
                                  transformStyle: 'preserve-3d',
                                  boxShadow: isPeak
                                    ? '0 12px 30px -8px rgba(234,88,12,0.6), inset 0 2px 4px rgba(255,255,255,0.4)'
                                    : '0 8px 20px -6px rgba(245,158,11,0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
                                }}
                              >
                                <div className="absolute top-0 left-0 right-0 h-2 bg-white/60 rounded-t-xl" style={{ filter: 'blur(0.5px)' }} />
                                <div className="absolute top-2 right-1.5 w-1.5 h-[calc(100%-1rem)] bg-white/20 rounded-full" />
                                <div className="absolute top-2 left-1.5 w-1 h-[calc(100%-1rem)] bg-white/30 rounded-full" />
                              </motion.div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{days[i]}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3 pt-5 border-t border-gray-200/60">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Daily</p>
                        <p className="text-lg font-extrabold text-gray-900 mt-1">${Math.round(bars.reduce((s, v) => s + (80 + v * 35), 0) / bars.length).toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Peak Day</p>
                        <p className="text-lg font-extrabold text-orange-600 mt-1">Saturday</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Growth</p>
                        <p className="text-lg font-extrabold text-emerald-600 mt-1 flex items-center justify-center gap-1"><TrendingUp size={14} />+24%</p>
                      </div>
                    </div>
                  </Tilt3DCard>

                  {/* LIVE ORDER STREAM */}
                  <Tilt3DCard className="rounded-3xl bg-white/85 backdrop-blur-md border border-white/70 shadow-2xl shadow-gray-300/40 p-6">
                    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />
                    <div className="relative flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-gray-900">Live Orders</h3>
                        <span className="relative inline-flex h-2.5 w-2.5">
                          <span className="absolute inset-0 inline-flex rounded-full bg-red-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100/80 px-2 py-1 rounded-full">{liveCount} active</span>
                    </div>
                    <div className="relative space-y-3 max-h-[420px] overflow-y-auto pr-1">
                      {orders.filter((o) => o.status === 'New' || o.status === 'Accepted' || o.status === 'Preparing' || o.status === 'Ready').slice(0, 6).map((o, idx) => (
                        <motion.div key={o.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }} className="p-3 rounded-2xl bg-white/80 border border-white/70 shadow-md hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#b93815] flex items-center justify-center font-extrabold text-xs shrink-0 border border-white/60 shadow-inner">
                              #{o.id.slice(-3)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-bold text-gray-900 truncate">{o.customer}</p>
                                <span className={`shrink-0 inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${statusBadge(o.status)}`}>{o.status}</span>
                              </div>
                              <p className="text-[11px] text-gray-600 mt-0.5 truncate">{o.qty}× {o.item}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] text-gray-400 font-medium">Table {o.id.slice(-2)} · {o.time}</span>
                                <span className="text-xs font-extrabold text-gray-900">${o.amount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2.5 flex gap-1.5">
                            {o.status === 'New' && (
                              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => acceptOrder(o.id)} className="flex-1 inline-flex items-center justify-center gap-1 bg-gradient-to-b from-emerald-500 to-emerald-700 text-white text-[10px] font-bold py-1.5 rounded-lg shadow-md border border-white/20">
                                <CheckCircle2 size={10} /> Accept
                              </motion.button>
                            )}
                            {o.status !== 'New' && o.status !== 'Rejected' && o.status !== 'Delivered' && (
                              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => advanceOrder(o.id)} className="flex-1 inline-flex items-center justify-center gap-1 bg-gradient-to-b from-orange-500 to-red-600 text-white text-[10px] font-bold py-1.5 rounded-lg shadow-md border border-white/20">
                                {o.status === 'Preparing' ? <><CheckCircle2 size={10} /> Mark Ready</> : <><ArrowRight size={10} /> Next</>}
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Tilt3DCard>
                </div>

                {/* REVIEWS + NOTIFICATIONS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <Tilt3DCard className="rounded-3xl bg-white/85 backdrop-blur-md border border-white/70 shadow-2xl shadow-gray-300/40 p-6">
                    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />
                    <div className="relative flex items-center justify-between mb-4">
                      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                        <Star size={18} className="text-amber-500" fill="currentColor" /> Recent Reviews
                      </h3>
                      <span className="text-xs font-bold text-gray-500">4.8 avg · 312 total</span>
                    </div>
                    <div className="relative space-y-3">
                      {[
                        { name: 'Priya S.', rating: 5, comment: 'Best smashburger in town! Delivery was fast and the food was hot.', time: '12 min ago' },
                        { name: 'Marcus J.', rating: 4, comment: 'Loved the truffle fries. Could use a bit more seasoning.', time: '1 hr ago' },
                        { name: 'Aisha R.', rating: 5, comment: 'Margherita pizza was perfect. Will definitely order again!', time: '3 hr ago' },
                      ].map((r, i) => (
                        <div key={i} className="p-3 rounded-2xl bg-white/80 border border-white/70 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-100 to-amber-200 text-[#b93815] flex items-center justify-center text-xs font-extrabold border border-white/60 shadow-inner">
                                {r.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{r.name}</p>
                                <p className="text-[10px] text-gray-400">{r.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {Array.from({ length: r.rating }).map((_, j) => (
                                <Star key={j} size={11} fill="currentColor" stroke="currentColor" />
                              ))}
                              {Array.from({ length: 5 - r.rating }).map((_, j) => (
                                <Star key={`e-${j}`} size={11} className="text-gray-300" />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  </Tilt3DCard>

                  <Tilt3DCard className="rounded-3xl bg-white/85 backdrop-blur-md border border-white/70 shadow-2xl shadow-gray-300/40 p-6">
                    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />
                    <div className="relative flex items-center justify-between mb-4">
                      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                        <Bell size={18} className="text-orange-500" /> Notifications
                      </h3>
                      <span className="relative inline-flex h-2.5 w-2.5">
                        <span className="absolute inset-0 inline-flex rounded-full bg-red-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                      </span>
                    </div>
                    <div className="relative space-y-3">
                      {[
                        { text: 'New high-value order #A2048 placed ($84.20)', time: '2 min ago', color: 'bg-blue-100 text-blue-700', icon: ShoppingBag },
                        { text: 'Priya S. left a 5-star review on Truffle Smashburger', time: '12 min ago', color: 'bg-amber-100 text-amber-700', icon: Star },
                        { text: 'Mozzarella cheese stock is running low (12% left)', time: '1 hr ago', color: 'bg-rose-100 text-rose-700', icon: Flame },
                        { text: 'Weekly payout of $1,284.50 has been processed', time: '4 hr ago', color: 'bg-emerald-100 text-emerald-700', icon: DollarSign },
                        { text: 'Restaurant hours updated successfully', time: '1 day ago', color: 'bg-gray-100 text-gray-600', icon: CheckCircle2 },
                      ].map((n, i) => (
                        <motion.div key={i} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="flex items-start gap-3 p-3 rounded-2xl bg-white/80 border border-white/70 shadow-sm hover:shadow-md cursor-pointer">
                          <div className={`h-9 w-9 rounded-xl ${n.color} flex items-center justify-center shrink-0 shadow-inner`}>
                            <n.icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800">{n.text}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Tilt3DCard>
                </div>

                {/* BUSINESS INFORMATION */}
                <Tilt3DCard className="rounded-3xl bg-white/85 backdrop-blur-md border border-white/70 shadow-2xl shadow-gray-300/40 p-6 sm:p-10">
                  <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />
                  <div className="relative flex items-center gap-2 mb-6">
                    <Store size={20} className="text-orange-500" />
                    <h3 className="text-xl font-extrabold text-gray-900">Business Information</h3>
                  </div>
                  <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                    {infoFields.map((f) => (
                      <div key={f.label} className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 text-[#b93815] flex items-center justify-center shrink-0 border border-white/60 shadow-inner">
                          <f.icon size={17} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{f.label}</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">{f.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tilt3DCard>
              </div>
            )}

            {activeTab === 'profile' && null}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Orders Management</h2>
                    <p className="mt-1 text-base text-gray-500">Track, accept, and update every order in real-time.</p>
                  </div>
                </div>

                {/* Sub-module summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { label: 'New Orders', value: newCount, icon: Sparkles, accent: 'bg-blue-50', text: 'text-blue-600', target: 'New' as const },
                    { label: 'Active Orders', value: activeCount, icon: Flame, accent: 'bg-rose-50', text: 'text-rose-600', target: 'Active' as const },
                    { label: 'Order History', value: historyCount, icon: CheckCircle2, accent: 'bg-teal-50', text: 'text-teal-600', target: 'History' as const },
                  ].map((m) => (
                    <motion.button key={m.label} whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setOrderFilter(m.target)} className={`text-left bg-white/90 backdrop-blur-xl border rounded-3xl shadow-xl shadow-gray-300/40 p-5 transition-colors ${orderFilter === m.target ? 'border-[#b93815] ring-2 ring-[#b93815]/30' : 'border-white/60 hover:border-orange-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-2xl ${m.accent} ${m.text} flex items-center justify-center shadow-inner border border-white/60`}>
                          <m.icon size={22} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{m.label}</p>
                          <p className="text-2xl font-extrabold text-gray-900 leading-none mt-1">{m.value}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] text-gray-500 font-medium">Click to view →</p>
                    </motion.button>
                  ))}
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap gap-2">
                  {(['All', 'New', 'Active', 'History'] as const).map((s) => (
                    <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => setOrderFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${orderFilter === s ? 'bg-orange-50 text-[#b93815] border-orange-200' : 'bg-white/70 text-gray-600 border-white/60 hover:bg-white'}`}>{s}</motion.button>
                  ))}
                </div>

                {/* Orders list with full details + actions */}
                <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                  <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                      <p className="text-sm text-gray-500 italic text-center py-8">No orders match this filter.</p>
                    ) : (
                      filteredOrders.map((o) => {
                        const nxt = nextStatus(o.status);
                        return (
                          <div key={o.id} className="p-4 rounded-2xl bg-white/70 border border-white/60 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#b93815] flex items-center justify-center font-bold text-sm shrink-0">{o.id.slice(-3)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-extrabold text-gray-900">{o.customer}</p>
                                  <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${statusBadge(o.status)}`}>{o.status}</span>
                                  <span className="text-xs text-gray-500">{o.time}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  <span className="font-semibold text-gray-800">{o.qty}× {o.item}</span>
                                  <span className="text-gray-400 mx-2">·</span>
                                  <span className="font-bold text-gray-900">${o.amount.toFixed(2)}</span>
                                </p>
                                {o.address && (
                                  <p className="text-[11px] text-gray-500 mt-0.5">📍 {o.address}</p>
                                )}
                                {o.notes && (
                                  <p className="text-[11px] text-amber-700 mt-0.5 italic">Note: {o.notes}</p>
                                )}
                                {o.rejectReason && (
                                  <p className="text-[11px] text-rose-700 mt-1 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1 inline-block">
                                    Rejected: {o.rejectReason}
                                  </p>
                                )}
                              </div>
                              <div className="flex sm:flex-col gap-2 shrink-0">
                                {o.status === 'New' && (
                                  <>
                                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => acceptOrder(o.id)} className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-b from-emerald-500 to-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md border border-white/20">
                                      <CheckCircle2 size={14} /> Accept
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { setShowRejectFor(o.id); setRejectReason(''); }} className="inline-flex items-center justify-center gap-1.5 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold py-2 px-4 rounded-xl">
                                      <X size={14} /> Reject
                                    </motion.button>
                                  </>
                                )}
                                {nxt && o.status !== 'New' && o.status !== 'Rejected' && o.status !== 'Delivered' && (
                                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => advanceOrder(o.id)} className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-b from-[#c2410c] to-[#9a3412] text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md border border-white/20">
                                    <ArrowRight size={14} /> {nextStatusLabel(o.status)}
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </TiltCard>

                {/* Reject reason modal */}
                <AnimatePresence>
                  {showRejectFor && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowRejectFor(null)}>
                      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-extrabold text-gray-900">Reject Order {showRejectFor}</h3>
                        <p className="text-sm text-gray-500 mt-1">Please provide a reason for rejecting this order.</p>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="e.g. Item out of stock, restaurant closing soon..."
                          rows={4}
                          className="mt-4 w-full bg-gray-50 text-sm text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                        />
                        <div className="mt-5 flex gap-2 justify-end">
                          <button onClick={() => setShowRejectFor(null)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm">Cancel</button>
                          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => rejectOrder(showRejectFor)} className="px-4 py-2 rounded-xl bg-gradient-to-b from-rose-500 to-rose-700 text-white font-semibold text-sm shadow-md">Confirm Reject</motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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