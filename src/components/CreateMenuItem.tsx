'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Sparkles,
  BarChart3,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Camera,
  Plus,
  X,
  Check,
  Loader2,
  Star,
  Leaf,
  User,
  Image as ImageIcon,
  DollarSign,
  Clock,
  TrendingUp,
  Download,
  ChevronDown,
  Flame,
  Receipt,
  Bike,
} from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const topNav: NavItem[] = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Orders', icon: ShoppingBag },
  { name: 'Menu Management', icon: UtensilsCrossed },
  { name: 'AI Food Studio', icon: Sparkles },
  { name: 'Analytics', icon: BarChart3 },
];

const bottomNav: NavItem[] = [
  { name: 'Settings', icon: Settings },
  { name: 'Support', icon: HelpCircle },
];

const steps = ['Dish Info', 'Images & Tags', 'Publish'];

const allTags = ['Appetizer', 'Spicy', 'Signature', 'Gluten-Free', 'Seafood'];

const gallerySeed = [
  {
    id: 'burger',
    src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
    alt: 'Truffle Smashburger',
  },
  {
    id: 'tacos',
    src: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=400',
    alt: 'Street Tacos',
  },
  {
    id: 'pasta',
    src: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400',
    alt: 'Creamy Pasta',
  },
  {
    id: 'cake',
    src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400',
    alt: 'Berry Cake',
  },
];

const overviewStats = [
  { label: "Today's Orders", value: '24', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
  { label: 'Revenue', value: '$1,250', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Avg Rating', value: '4.8', icon: Star, color: 'bg-amber-50 text-amber-600' },
  { label: 'Live Orders', value: '5', icon: Clock, color: 'bg-purple-50 text-purple-600' },
];

const popularItems = [
  { name: 'Truffle Smashburger', orders: 42, revenue: '$892' },
  { name: 'Street Tacos', orders: 28, revenue: '$420' },
  { name: 'Creamy Pasta', orders: 19, revenue: '$285' },
  { name: 'Berry Cake', orders: 15, revenue: '$225' },
];

interface LiveOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: 'Preparing' | 'Ready' | 'Delivered';
  time: string;
}

interface PopularItem {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  image: string;
  alt: string;
}

const initialOrders: LiveOrder[] = [
  { id: '#1024', customer: 'Rahim Ahmed', items: 'Truffle Smashburger x1, Fries x1', total: 14.5, status: 'Preparing', time: '2 min ago' },
  { id: '#1023', customer: 'Sara Khan', items: 'Street Tacos x2', total: 12.0, status: 'Ready', time: '5 min ago' },
  { id: '#1022', customer: 'Karim Hassan', items: 'Creamy Pasta x1', total: 10.0, status: 'Preparing', time: '8 min ago' },
  { id: '#1021', customer: 'Nusrat Jahan', items: 'Berry Cake x1, Coffee x1', total: 9.5, status: 'Delivered', time: '12 min ago' },
  { id: '#1020', customer: 'Imran Hossain', items: 'Truffle Smashburger x2', total: 23.0, status: 'Ready', time: '15 min ago' },
];

const initialPopularItems: PopularItem[] = [
  { id: 'burger', name: 'Truffle Smashburger', orders: 42, revenue: 892, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', alt: 'Truffle Smashburger' },
  { id: 'tacos', name: 'Street Tacos', orders: 28, revenue: 420, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=400', alt: 'Street Tacos' },
  { id: 'pasta', name: 'Creamy Pasta', orders: 19, revenue: 285, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400', alt: 'Creamy Pasta' },
  { id: 'cake', name: 'Berry Cake', orders: 15, revenue: 225, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400', alt: 'Berry Cake' },
];

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  alt: string;
  status: 'Available' | 'Sold Out';
  tags: string[];
}

const menuItems: MenuItem[] = [
  {
    id: 'burger',
    name: 'Truffle Smashburger',
    category: 'Burgers',
    price: 12.99,
    description: 'Double patty with truffle aioli and cheddar.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    alt: 'Truffle Smashburger',
    status: 'Available',
    tags: ['Best Seller'],
  },
  {
    id: 'tacos',
    name: 'Street Tacos',
    category: 'Sides',
    price: 9.5,
    description: 'Three soft tacos with seasoned chicken.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=600',
    alt: 'Street Tacos',
    status: 'Available',
    tags: ['Best Seller', 'Vegetarian'],
  },
  {
    id: 'pasta',
    name: 'Creamy Pasta',
    category: 'Pizza',
    price: 14.0,
    description: 'Rich creamy sauce with parmesan and basil.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600',
    alt: 'Creamy Pasta',
    status: 'Sold Out',
    tags: ['Vegetarian'],
  },
  {
    id: 'cake',
    name: 'Berry Cake',
    category: 'Drinks',
    price: 7.99,
    description: 'Fresh berry layered cake with cream.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
    alt: 'Berry Cake',
    status: 'Available',
    tags: ['Best Seller'],
  },
  {
    id: 'pizza',
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 11.99,
    description: 'Classic tomato, mozzarella, and basil.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600',
    alt: 'Margherita Pizza',
    status: 'Available',
    tags: ['Vegetarian'],
  },
  {
    id: 'soda',
    name: 'Citrus Soda',
    category: 'Drinks',
    price: 4.5,
    description: 'Fresh sparkling citrus blend.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    alt: 'Citrus Soda',
    status: 'Available',
    tags: [],
  },
];

const categories = ['All Items', 'Burgers', 'Pizza', 'Drinks', 'Sides'];

export default function CreateMenuItem() {
  const [activeTab, setActiveTab] = useState('Overview');
  const pathname = usePathname();

  // Dish Details
  const [dishName, setDishName] = useState('Truffle Smashburger');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Any gory...');

  // AI Analysis
  const [analyzing, setAnalyzing] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Signature', 'Spicy']);

  // Customization
  const [bestSeller, setBestSeller] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [keywords, setKeywords] = useState('');

  // Gallery
  const [gallery, setGallery] = useState(gallerySeed);

  // Overview state
  const [timeFilter, setTimeFilter] = useState<'Today' | 'Week' | 'Month'>('Today');
  const [orders, setOrders] = useState<LiveOrder[]>(initialOrders);
  const [popularItemsState, setPopularItems] = useState<PopularItem[]>(initialPopularItems);

  // Menu Management state
  const [menuCategory, setMenuCategory] = useState('All Items');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeFromGallery = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const updateOrderStatus = (orderId: string, newStatus: LiveOrder['status']) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const derivedStats = useMemo(() => {
    const multiplier = timeFilter === 'Today' ? 1 : timeFilter === 'Week' ? 5.2 : 22;
    const totalOrders = Math.round(24 * multiplier);
    const revenue = Math.round(1250 * multiplier);
    const avgRating = 4.8;
    const weeklyGrowth = 12.5;
    return { totalOrders, revenue, avgRating, weeklyGrowth };
  }, [timeFilter]);

  const downloadReport = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const totalRevenue = popularItemsState.reduce((sum, item) => sum + item.revenue, 0);
    const liveCount = orders.filter((o) => o.status === 'Preparing' || o.status === 'Ready').length;

    const report = `
Foodiego Merchant Dashboard Report
Generated: ${dateStr} at ${timeStr}
Period: ${timeFilter}

STATS
-----
Today's Orders: ${derivedStats.totalOrders}
Revenue: $${derivedStats.revenue.toLocaleString()}
Avg Rating: ${derivedStats.avgRating}
Weekly Growth: ${derivedStats.weeklyGrowth}%
Live Orders: ${liveCount}

POPULAR ITEMS
-------------
${popularItemsState.map((item) => `${item.name} - ${item.orders} orders - $${item.revenue}`).join('\n')}

Total Popular Items Revenue: $${totalRevenue.toLocaleString()}
`.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-report-${timeFilter.toLowerCase()}-${now.toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredMenuItems = useMemo(() => {
    if (menuCategory === 'All Items') return menuItems;
    return menuItems.filter((item) => item.category === menuCategory);
  }, [menuCategory]);

  const renderOverview = () => {
    const liveOrdersList = orders.filter((o) => o.status === 'Preparing' || o.status === 'Ready');
    const totalRevenue = popularItemsState.reduce((sum, item) => sum + item.revenue, 0);

    return (
      <div className="space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-base text-gray-500">
              Here&apos;s what&apos;s happening with your restaurant.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
                className="appearance-none bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 focus:border-[#b93815] transition-all"
              >
                <option value="Today">Today</option>
                <option value="Week">This Week</option>
                <option value="Month">This Month</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={downloadReport}
              className="inline-flex items-center gap-2 bg-[#b93815] text-white hover:bg-[#9a2c0f] font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all text-sm"
            >
              <Download size={16} />
              Download Report
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Today&apos;s Orders</p>
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{derivedStats.totalOrders}</p>
            <p className="text-xs text-gray-400 mt-1">+8% from yesterday</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Revenue</p>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">${derivedStats.revenue.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">+12% from yesterday</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Avg Rating</p>
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star size={20} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{derivedStats.avgRating}</p>
            <p className="text-xs text-gray-400 mt-1">Based on 128 reviews</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Weekly Growth</p>
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{derivedStats.weeklyGrowth}%</p>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#b93815] h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(derivedStats.weeklyGrowth * 5, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Grid: Live Orders + Popular Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Orders */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-[#b93815]" />
                <h2 className="text-lg font-bold text-gray-900">Live Orders</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                {liveOrdersList.length}
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {orders.map((order) => {
                const isLive = order.status === 'Preparing' || order.status === 'Ready';
                const statusColor =
                  order.status === 'Preparing'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : order.status === 'Ready'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-50 text-gray-500 border-gray-200';
                return (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{order.id}</span>
                        {isLive && (
                          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{order.customer}</p>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-1">{order.items}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-gray-900">${order.total.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        {order.status === 'Preparing' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'Ready')}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'Ready' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'Delivered')}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            Delivered
                          </button>
                        )}
                        <button
                          type="button"
                          className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg transition-colors"
                        >
                          <Receipt size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{order.time}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Popular Items Today */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Flame size={20} className="text-[#b93815]" />
                <h2 className="text-lg font-bold text-gray-900">Popular Items Today</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {popularItemsState.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white"
                  >
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                      <Image src={item.image} alt={item.alt} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.orders} orders</p>
                      <p className="text-sm font-extrabold text-[#b93815] mt-1">${item.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide">AI Insight</h3>
                  <p className="mt-1 text-sm text-purple-800 leading-relaxed">
                    Truffle Smashburger is trending 23% higher than last week. Consider adding a combo meal with fries to increase average order value by an estimated 18%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaceholder = (title: string, description: string) => (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-2 text-base text-gray-500 max-w-2xl leading-relaxed">{description}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm text-center">
        <p className="text-sm text-gray-400">This section is under development.</p>
      </div>
    </div>
  );

  const renderOrders = () => {
    const statuses: LiveOrder['status'][] = ['Preparing', 'Ready', 'Delivered'];
    const statusIcons: Record<LiveOrder['status'], React.ComponentType<{ size?: number; className?: string }>> = {
      Preparing: Loader2,
      Ready: Check,
      Delivered: Bike,
    };
    const statusColors: Record<LiveOrder['status'], { bg: string; text: string; border: string; glow: string }> = {
      Preparing: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', glow: 'shadow-amber-200' },
      Ready: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', glow: 'shadow-emerald-200' },
      Delivered: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', glow: 'shadow-gray-200' },
    };

    const pipeline = statuses.map((status) => ({
      status,
      items: orders.filter((o) => o.status === status),
    }));

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Orders
            </h1>
            <p className="mt-1 text-base text-gray-500">
              Track and manage incoming customer orders in real-time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {statuses.map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              const Icon = statusIcons[status];
              const colors = statusColors[status];
              return (
                <div
                  key={status}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border ${colors.bg} ${colors.text} ${colors.border} shadow-sm`}
                >
                  <Icon size={18} className={status === 'Preparing' ? 'animate-spin' : ''} />
                  <span className="text-sm font-bold">{count}</span>
                  <span className="text-xs font-medium opacity-80">{status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3D Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pipeline.map((stage, stageIndex) => {
            const Icon = statusIcons[stage.status];
            const colors = statusColors[stage.status];
            return (
              <div
                key={stage.status}
                className="relative group"
                style={{ perspective: '1200px' }}
              >
                <div
                  className={`relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2 hover:scale-[1.02] ${colors.glow}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Animated top glow */}
                  <div className={`absolute -top-px left-8 right-8 h-1 rounded-full bg-gradient-to-r ${stage.status === 'Preparing' ? 'from-amber-300 to-orange-300' : stage.status === 'Ready' ? 'from-emerald-300 to-teal-300' : 'from-gray-300 to-gray-400'} opacity-60 group-hover:opacity-100 transition-opacity`} />

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center border ${colors.border} shadow-inner`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900">{stage.status}</h3>
                          <p className="text-xs text-gray-500">{stage.items.length} order{stage.items.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className={`h-3 w-3 rounded-full ${stage.status === 'Preparing' ? 'bg-amber-400 animate-pulse' : stage.status === 'Ready' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300'} shadow-lg`} />
                    </div>

                    <div className="space-y-3">
                      {stage.items.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-xs text-gray-400 font-medium">No orders in this stage</p>
                        </div>
                      ) : (
                        stage.items.map((order, orderIndex) => (
                          <div
                            key={order.id}
                            className="relative bg-gray-50 rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all duration-300 group/card"
                            style={{
                              animation: `fadeSlideIn 0.5s ease-out ${orderIndex * 0.08}s both`,
                              transform: 'translateZ(0)',
                            }}
                          >
                            {/* 3D shine effect on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-gray-900 tracking-tight">#{order.id.replace('#', '')}</span>
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-200" />
                              </div>
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border} uppercase tracking-wider`}>
                                {order.status}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-gray-700 mb-1 truncate">{order.customer}</p>
                            <p className="text-[11px] text-gray-400 mb-3 line-clamp-1 leading-relaxed">{order.items}</p>

                            <div className="flex items-center justify-between">
                              <span className="text-sm font-extrabold text-gray-900">${order.total.toFixed(2)}</span>
                              <div className="flex items-center gap-1.5">
                                {order.status === 'Preparing' && (
                                  <button
                                    type="button"
                                    onClick={() => updateOrderStatus(order.id, 'Ready')}
                                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                                  >
                                    Mark Ready
                                  </button>
                                )}
                                {order.status === 'Ready' && (
                                  <button
                                    type="button"
                                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                                  >
                                    Delivered
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-2 rounded-xl transition-all hover:scale-110 active:scale-95 border border-gray-200 shadow-sm hover:shadow-md"
                                >
                                  <Receipt size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[10px] text-gray-400 font-medium">{order.time}</span>
                              <div className="flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                                <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                                <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Bottom reflection */}
                  <div className="absolute bottom-0 left-8 right-8 h-8 bg-gradient-to-t from-gray-100/50 to-transparent rounded-b-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Today's Orders", value: orders.length, icon: ShoppingBag, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
            { label: 'Total Revenue', value: `$${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`, icon: DollarSign, color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
            { label: 'Avg Order Value', value: `$${(orders.reduce((sum, o) => sum + o.total, 0) / Math.max(orders.length, 1)).toFixed(2)}`, icon: TrendingUp, color: 'from-amber-400 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
            { label: 'Completion Rate', value: `${Math.round((orders.filter((o) => o.status === 'Delivered').length / Math.max(orders.length, 1)) * 100)}%`, icon: Star, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="relative group"
              style={{ perspective: '1000px' }}
            >
              <div
                className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu hover:rotate-y-6 hover:-translate-y-1"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 3D gradient border effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className={`absolute -top-px left-6 right-6 h-1 rounded-full bg-gradient-to-r ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

                <div className="p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <stat.icon size={22} />
                    </div>
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${stat.color} animate-pulse shadow-lg`} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-gray-900 tracking-tight group-hover:tracking-normal transition-all">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Timeline */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#b93815] to-[#9a2c0f] text-white flex items-center justify-center shadow-lg shadow-orange-200">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <p className="text-xs text-gray-500">Latest order updates and status changes</p>
            </div>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 6).map((order, index) => {
              const colors = statusColors[order.status];
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 group/item"
                  style={{
                    animation: `fadeSlideIn 0.4s ease-out ${index * 0.06}s both`,
                  }}
                >
                  <div className={`h-10 w-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center border ${colors.border} shrink-0 group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300`}>
                    <ShoppingBag size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-gray-900">#{order.id.replace('#', '')}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{order.customer} · {order.items}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-gray-900">${order.total.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{order.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderMenuManagement = () => {
    return (
      <div className="space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Menu Management</h1>
          <p className="mt-2 text-base text-gray-500 max-w-2xl leading-relaxed">
            Organize your menu items, categories, and pricing.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setMenuCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                menuCategory === cat
                  ? 'bg-[#b93815] text-white border-[#b93815] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image src={item.image} alt={item.alt} fill className="object-cover" />
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-bold text-gray-900 leading-tight">{item.name}</h3>
                  <p className="text-base font-extrabold text-[#b93815] whitespace-nowrap">${item.price.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        tag === 'Best Seller'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {tag === 'Best Seller' ? <Star size={12} className="mr-1" /> : <Leaf size={12} className="mr-1" />}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Item Card */}
          <button
            type="button"
            className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#b93815] hover:bg-[#fff1ec] transition-colors flex flex-col items-center justify-center aspect-[4/3] min-h-[220px]"
          >
            <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-3">
              <Plus size={24} />
            </div>
            <p className="text-sm font-bold text-gray-600">Add New Item</p>
            <p className="text-xs text-gray-400 mt-1">Create a new menu entry</p>
          </button>
        </div>
      </div>
    );
  };

  const renderAnalytics = () =>
    renderPlaceholder(
      'Analytics',
      'View detailed reports and insights about your business.'
    );

  const renderSettings = () =>
    renderPlaceholder(
      'Settings',
      'Manage your restaurant profile, notifications, and preferences.'
    );

  const renderSupport = () =>
    renderPlaceholder(
      'Support',
      'Get help, contact us, or browse FAQs.'
    );

  const renderAIFoodStudio = () => (
    <div className="space-y-8">
      {/* Title + Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Create New Menu Item with AI Assistant
        </h1>
        <p className="mt-2 text-base text-gray-500 max-w-2xl leading-relaxed">
          Tell us about your dish, or start by uploading an image. Our AI will help
          you with descriptions, tags, and optimization.
        </p>
      </div>

      {/* Steppers */}
      <div className="flex items-center gap-3 mb-10 flex-wrap">
        {steps.map((step, i) => {
          const isFirst = i === 0;
          return (
            <div key={step} className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  isFirst
                    ? 'bg-[#f5ecd9] text-[#9a2c0f]'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                    isFirst ? 'bg-[#b93815] text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {i + 1}
                </span>
                {step}
              </span>
              {i < steps.length - 1 && (
                <span className="h-px w-6 bg-gray-300 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-8">
        {/* ---------------- DISH DETAILS ---------------- */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Dish Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Dish Name
              </label>
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe your dish, ingredients, and story..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
            />
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 bg-[#fff1ec] text-[#b93815] hover:bg-[#fbe2d8] font-semibold py-2.5 px-4 rounded-xl border border-[#f3c9ba] transition-all"
            >
              <Sparkles size={16} />
              Generate description with AI
            </button>
          </div>

          <div className="mt-5 sm:max-w-xs">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-gray-700 focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all bg-white"
            >
              <option>Any gory...</option>
              <option>Burgers</option>
              <option>Pizza</option>
              <option>Drinks</option>
              <option>Sides</option>
            </select>
          </div>
        </section>

        {/* ---------------- DISH IMAGES ---------------- */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Dish Images</h2>

          {/* Drop-zone with AI Analysis overlay */}
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:border-[#b93815]/40 transition-colors p-10">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-[#fff1ec] text-[#b93815] h-16 w-16 rounded-full flex items-center justify-center mb-4">
                <Camera size={28} />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-[#b93815] text-white hover:bg-[#9a2c0f] font-bold py-3 px-5 rounded-xl shadow-sm transition-all"
              >
                <Plus size={18} strokeWidth={2.5} />
                Upload Food Images or Drag and Drop
              </button>
              <p className="mt-3 text-xs text-gray-400">
                PNG, JPG up to 10MB each
              </p>
            </div>

            {/* AI Image Analysis Overlay */}
            {analyzing && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center px-6">
                <Loader2 size={32} className="text-[#b93815] animate-spin mb-3" />
                <p className="text-sm font-semibold text-gray-700">
                  Analyzing... detecting tags...
                </p>
                <button
                  type="button"
                  onClick={() => setAnalyzing(false)}
                  className="mt-4 text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Suggested Tags */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Suggested tags</h3>
            <div className="flex flex-wrap gap-2.5">
              {allTags.map((tag) => {
                const checked = selectedTags.includes(tag);
                return (
                  <label
                    key={tag}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium cursor-pointer border transition-all ${
                      checked
                        ? 'bg-[#fff1ec] text-[#b93815] border-[#f3c9ba]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        checked ? 'bg-[#b93815] border-[#b93815]' : 'bg-white border-gray-300'
                      }`}
                    >
                      {checked && <Check size={12} className="text-white" strokeWidth={3} />}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => toggleTag(tag)}
                    />
                    {tag}
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------- MENU CUSTOMIZATION ---------------- */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Menu Customization</h2>

          <div className="space-y-4">
            {/* Best Seller Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star size={18} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">
                  Is it a best seller?
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBestSeller((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  bestSeller ? 'bg-[#b93815]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    bestSeller ? 'left-0.5 translate-x-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Vegetarian Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Leaf size={18} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">
                  Is it vegetarian?
                </span>
              </div>
              <button
                type="button"
                onClick={() => setVegetarian((v) => !v)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  vegetarian ? 'bg-[#b93815]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    vegetarian ? 'left-0.5 translate-x-5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Keywords */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Keywords
              </label>
              <input
                type="text"
                placeholder="e.g. juicy, gourmet, comfort food"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
              />
            </div>
          </div>
        </section>

        {/* ---------------- RECENT UPLOADS GALLERY ---------------- */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recently Uploaded</h2>
          {gallery.length === 0 ? (
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <ImageIcon size={16} /> No images uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-100"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeFromGallery(img.id)}
                    aria-label={`Remove ${img.alt}`}
                    className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return renderOverview();
      case 'Orders':
        return renderOrders();
      case 'Menu Management':
        return renderMenuManagement();
      case 'AI Food Studio':
        return renderAIFoodStudio();
      case 'Analytics':
        return renderAnalytics();
      case 'Settings':
        return renderSettings();
      case 'Support':
        return renderSupport();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex font-sans">
      {/* -------------------- SIDEBAR (LEFT) -------------------- */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 shrink-0 sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-100">
          <span className="block text-2xl font-bold tracking-tight text-[#b93815]">
            Foodiego Merchant
          </span>
          <span className="block text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">
            Premium Dashboard
          </span>
        </div>

        {/* Top Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {topNav.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <button
                key={link.name}
                onClick={() => setActiveTab(link.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <link.icon
                  size={18}
                  className={isActive ? 'text-[#b93815]' : 'text-gray-400'}
                />
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Merchant Section */}
        <div className="px-4 pb-1 pt-2">
          <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Merchant
          </p>
        </div>
        <nav className="px-4 space-y-1.5 pb-2">
          <Link
            href="/account"
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              pathname === '/account'
                ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <User
              size={18}
              className={pathname === '/account' ? 'text-[#b93815]' : 'text-gray-400'}
            />
            <span>Merchant Profile</span>
          </Link>
          <Link
            href="/dashboard/restaurant/create"
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              pathname === '/dashboard/restaurant/create'
                ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Sparkles
              size={18}
              className={
                pathname === '/dashboard/restaurant/create'
                  ? 'text-[#b93815]'
                  : 'text-gray-400'
              }
            />
            <span>Create Menu Item</span>
          </Link>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          {bottomNav.map((link) => (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === link.name
                  ? 'bg-[#fff1ec] text-[#b93815]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon
                size={18}
                className={activeTab === link.name ? 'text-[#b93815]' : 'text-gray-400'}
              />
              <span>{link.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* -------------------- MAIN AREA (RIGHT) -------------------- */}
      <div className="flex-1 w-full flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full flex-1 md:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 focus:border-[#b93815] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <div className="h-10 w-10 rounded-full border-2 border-white ring-2 ring-gray-100 overflow-hidden relative shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=120"
                alt="Merchant Profile"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 mx-auto w-full max-w-7xl">
          <div className="transition-all duration-300 ease-in-out">
            {renderTabContent()}
          </div>
        </main>

        {/* ---------------- BOTTOM ACTION BAR ---------------- */}
        <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200 px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-end gap-3 mx-auto w-full max-w-7xl">
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#b93815] hover:bg-[#9a2c0f] rounded-xl shadow-sm hover:shadow transition-all"
            >
              Publish Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
