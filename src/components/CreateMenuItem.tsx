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
  CheckCircle2,
  Loader2,
  Star,
  Leaf,
  User,
  Image as ImageIcon,
  DollarSign,
  Clock,
  Calendar,
  TrendingUp,
  Download,
  ChevronDown,
  Flame,
  Receipt,
  Bike,
  Pencil,
  Trash2,
  Tag,
  FolderTree,
  ToggleRight,
  ToggleLeft,
  Upload,
  EyeOff,
  Eye,
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
  status: 'Available' | 'Sold Out' | 'Hidden';
  tags: string[];
  orders: number;
  revenue: number;
  createdAt: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
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
    orders: 142,
    revenue: 1844,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
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
    orders: 98,
    revenue: 931,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
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
    orders: 19,
    revenue: 266,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
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
    orders: 54,
    revenue: 431,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
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
    orders: 76,
    revenue: 911,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
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
    orders: 38,
    revenue: 171,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: 'wings',
    name: 'Spicy Chicken Wings',
    category: 'Sides',
    price: 8.99,
    description: 'Crispy wings tossed in buffalo sauce.',
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&q=80&w=600',
    alt: 'Spicy Chicken Wings',
    status: 'Hidden',
    tags: ['Spicy'],
    orders: 12,
    revenue: 107,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
];

const defaultCategories: Category[] = [
  { id: 'all', name: 'All Items', count: menuItems.length },
  { id: 'burgers', name: 'Burgers', count: menuItems.filter((i) => i.category === 'Burgers').length },
  { id: 'pizza', name: 'Pizza', count: menuItems.filter((i) => i.category === 'Pizza').length },
  { id: 'drinks', name: 'Drinks', count: menuItems.filter((i) => i.category === 'Drinks').length },
  { id: 'sides', name: 'Sides', count: menuItems.filter((i) => i.category === 'Sides').length },
];

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
  const [menuSubTab, setMenuSubTab] = useState<'All Items' | 'Add New Item' | 'Categories' | 'Item Availability'>('All Items');
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [menuSearch, setMenuSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'All' | 'Available' | 'Sold Out' | 'Hidden'>('All');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('Burgers');
  const [formImage, setFormImage] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const openAddForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormCategory(categories[1]?.name ?? 'Burgers');
    setFormImage('');
    setFormTags([]);
    setFormError(null);
    setEditingItem(null);
    setMenuSubTab('Add New Item');
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDescription(item.description);
    setFormPrice(String(item.price));
    setFormCategory(item.category);
    setFormImage(item.image);
    setFormTags(item.tags);
    setFormError(null);
  };

  const handleSaveItem = () => {
    if (!formName.trim()) {
      setFormError('Item name is required');
      return;
    }
    if (!formPrice || isNaN(Number(formPrice)) || Number(formPrice) <= 0) {
      setFormError('Valid price is required');
      return;
    }
    if (!editingItem && !formImage.trim()) {
      setFormError('Image URL is required');
      return;
    }

    if (editingItem) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? {
                ...it,
                name: formName.trim(),
                description: formDescription.trim(),
                price: Number(formPrice),
                category: formCategory,
                image: formImage.trim() || it.image,
                tags: formTags,
              }
            : it
        )
      );
    } else {
      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        name: formName.trim(),
        description: formDescription.trim(),
        price: Number(formPrice),
        category: formCategory,
        image: formImage.trim() || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
        alt: formName.trim(),
        status: 'Available',
        tags: formTags,
        orders: 0,
        revenue: 0,
        createdAt: Date.now(),
      };
      setItems((prev) => [newItem, ...prev]);
    }

    setMenuSubTab('All Items');
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setDeleteConfirm(null);
  };

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        if (it.status === 'Available') return { ...it, status: 'Sold Out' };
        if (it.status === 'Sold Out') return { ...it, status: 'Hidden' };
        return { ...it, status: 'Available' };
      })
    );
  };

  const addCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    setCategories((prev) => [
      ...prev,
      { id: name.toLowerCase().replace(/\s+/g, '-'), name, count: 0 },
    ]);
    setNewCategoryName('');
  };

  const removeCategory = (id: string) => {
    if (id === 'all') return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const filteredItems = useMemo(() => {
    let result = items;
    if (menuCategory !== 'All Items') {
      result = result.filter((i) => i.category === menuCategory);
    }
    if (availabilityFilter !== 'All') {
      result = result.filter((i) => i.status === availabilityFilter);
    }
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, menuCategory, availabilityFilter, menuSearch]);

  const sortedByPopularity = useMemo(
    () => [...items].sort((a, b) => b.orders - a.orders),
    [items]
  );

  const popularIds = useMemo(() => new Set(sortedByPopularity.slice(0, 3).map((i) => i.id)), [sortedByPopularity]);

  // Sales & Analytics state
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'Today' | 'This Week' | 'This Month' | 'This Year'>('This Week');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'Today Sales' | 'Revenue' | 'Orders Analytics' | 'Best-Selling Items'>('Today Sales');
  const [analyticsMetric, setAnalyticsMetric] = useState<'Sales' | 'Orders'>('Sales');

  const timeframeFactor: Record<typeof analyticsTimeframe, number> = {
    'Today': 1,
    'This Week': 6.5,
    'This Month': 27,
    'This Year': 312,
  };
  const factor = timeframeFactor[analyticsTimeframe];

  const analyticsDaily = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const seed = [420, 380, 520, 490, 680, 820, 750];
    return days.map((d, i) => ({ day: d, value: Math.round(seed[i] * factor) }));
  }, [factor]);

  const analyticsMonthly = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seed = [12, 14, 18, 22, 19, 26, 30, 28, 33, 35, 31, 38];
    return months.map((m, i) => ({ day: m, value: Math.round(seed[i] * factor * 5) }));
  }, [factor]);

  const analyticsHourly = useMemo(() => {
    const seed = [
      { time: '8 AM', orders: 4 },
      { time: '10 AM', orders: 9 },
      { time: '12 PM', orders: 28 },
      { time: '2 PM', orders: 15 },
      { time: '4 PM', orders: 12 },
      { time: '6 PM', orders: 32 },
      { time: '8 PM', orders: 24 },
      { time: '10 PM', orders: 11 },
    ];
    return seed.map((h) => ({ ...h, orders: Math.round(h.orders * factor) }));
  }, [factor]);

  const totalRevenue = useMemo(() => Math.round(1240 * factor), [factor]);
  const totalOrders = useMemo(() => Math.round(38 * factor), [factor]);
  const avgOrderValue = useMemo(
    () => (totalOrders > 0 ? totalRevenue / totalOrders : 0),
    [totalRevenue, totalOrders]
  );
  const todaySales = useMemo(() => Math.round(1240 * (factor / 6.5)), [factor]);

  const bestSelling = useMemo(
    () => [...items].sort((a, b) => b.orders - a.orders).slice(0, 8),
    [items]
  );

  const categoryShare = useMemo(() => {
    const tally: Record<string, number> = {};
    items.forEach((it) => {
      tally[it.category] = (tally[it.category] || 0) + it.orders;
    });
    const total = Object.values(tally).reduce((s, v) => s + v, 0) || 1;
    const palette: Record<string, string> = {
      Burgers: 'bg-[#b93815]',
      Pizza: 'bg-blue-500',
      Drinks: 'bg-amber-500',
      Sides: 'bg-emerald-500',
    };
    return Object.entries(tally)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / total) * 100),
        color: palette[name] || 'bg-gray-500',
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [items]);

  const orderStatusBreakdown = useMemo(() => {
    const counts = { Preparing: 0, Ready: 0, Delivered: 0 };
    initialOrders.forEach((o) => {
      if (o.status in counts) counts[o.status]++;
    });
    const total = counts.Preparing + counts.Ready + counts.Delivered || 1;
    return [
      { status: 'Preparing', count: counts.Preparing, percentage: Math.round((counts.Preparing / total) * 100), color: 'from-amber-400 to-amber-600' },
      { status: 'Ready', count: counts.Ready, percentage: Math.round((counts.Ready / total) * 100), color: 'from-emerald-400 to-emerald-600' },
      { status: 'Delivered', count: counts.Delivered, percentage: Math.round((counts.Delivered / total) * 100), color: 'from-gray-400 to-gray-500' },
    ];
  }, []);

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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
              className="inline-flex items-center gap-2 bg-[#b93815] text-white hover:bg-[#9a2c0f] font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all text-sm hover:scale-105 active:scale-95"
            >
              <Download size={16} />
              Download Report
            </button>
          </div>
        </div>

        {/* 3D Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Today's Orders", value: derivedStats.totalOrders, icon: ShoppingBag, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
            { label: 'Revenue', value: `$${derivedStats.revenue.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
            { label: 'Avg Rating', value: derivedStats.avgRating, icon: Star, color: 'from-amber-400 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
            { label: 'Weekly Growth', value: `${derivedStats.weeklyGrowth}%`, icon: TrendingUp, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
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
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className={`absolute -top-px left-6 right-6 h-1 rounded-full bg-gradient-to-r ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

                <div className="p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <stat.icon size={22} />
                    </div>
                    <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${stat.color} animate-pulse shadow-lg`} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-gray-900 tracking-tight group-hover:tracking-normal transition-all">{stat.value}</p>
                  {stat.label === 'Weekly Growth' && (
                    <div className="mt-3 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#b93815] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(derivedStats.weeklyGrowth * 5, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid: Live Orders + Popular Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Orders - 3D Pipeline */}
          <div className="lg:col-span-1 space-y-6">
            {/* Live Orders Header */}
            <div className="relative group" style={{ perspective: '1200px' }}>
              <div
                className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute -top-px left-8 right-8 h-1 rounded-full bg-gradient-to-r from-red-300 to-pink-300 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200 shadow-inner">
                        <Flame size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Live Orders</h2>
                        <p className="text-xs text-gray-500">Active orders</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-200">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-200" />
                      {liveOrdersList.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {orders.map((order, index) => {
                      const isLive = order.status === 'Preparing' || order.status === 'Ready';
                      const statusColor =
                        order.status === 'Preparing'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : order.status === 'Ready'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200';
                      return (
                        <div
                          key={order.id}
                          className="relative bg-gray-50 rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all duration-300 group/card"
                          style={{
                            animation: `fadeSlideIn 0.5s ease-out ${index * 0.08}s both`,
                            transform: 'translateZ(0)',
                          }}
                        >
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-gray-900 tracking-tight">#{order.id.replace('#', '')}</span>
                              {isLive && (
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-200" />
                              )}
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor} uppercase tracking-wider`}>
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
                      );
                    })}
                  </div>
                </div>

                <div className="absolute bottom-0 left-8 right-8 h-8 bg-gradient-to-t from-gray-100/50 to-transparent rounded-b-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Popular Items Today - 3D Grid */}
            <div className="relative group" style={{ perspective: '1200px' }}>
              <div
                className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute -top-px left-8 right-8 h-1 rounded-full bg-gradient-to-r from-orange-300 to-amber-300 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#b93815] to-[#9a2c0f] text-white flex items-center justify-center shadow-lg shadow-orange-200">
                      <Flame size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Popular Items Today</h2>
                      <p className="text-xs text-gray-500">Top performing dishes</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {popularItemsState.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 group/item"
                        style={{ animation: `fadeSlideIn 0.5s ease-out ${index * 0.08}s both` }}
                      >
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-100 group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300 shadow-sm">
                          <Image src={item.image} alt={item.alt} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate group-hover/item:text-[#b93815] transition-colors">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.orders} orders</p>
                          <p className="text-sm font-extrabold text-[#b93815] mt-1">${item.revenue}</p>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-[#fff1ec] text-[#b93815] flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300 group-hover/item:scale-110">
                          <TrendingUp size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insight - 3D */}
            <div className="relative group" style={{ perspective: '1200px' }}>
              <div
                className="relative bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute -top-px left-8 right-8 h-1 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Sparkles size={22} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide">AI Insight</h3>
                        <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse shadow-lg shadow-purple-200" />
                      </div>
                      <p className="text-sm text-purple-800 leading-relaxed">
                        Truffle Smashburger is trending 23% higher than last week. Consider adding a combo meal with fries to increase average order value by an estimated 18%.
                      </p>
                    </div>
                  </div>
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
                    <p className="text-xs text-gray-500 truncate">{order.customer} Â· {order.items}</p>
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
    const totalItems = items.length;
    const availableItems = items.filter((i) => i.status === 'Available').length;
    const soldOutItems = items.filter((i) => i.status === 'Sold Out').length;
    const hiddenItems = items.filter((i) => i.status === 'Hidden').length;
    const avgPrice =
      totalItems > 0 ? (items.reduce((sum, i) => sum + i.price, 0) / totalItems).toFixed(2) : '0.00';

    const subTabs: { id: typeof menuSubTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
      { id: 'All Items', label: 'All Items', icon: UtensilsCrossed },
      { id: 'Add New Item', label: 'Add New Item', icon: Plus },
      { id: 'Categories', label: 'Categories', icon: FolderTree },
      { id: 'Item Availability', label: 'Item Availability', icon: ToggleRight },
    ];

    const statusStyles: Record<MenuItem['status'], { bg: string; text: string; border: string; dot: string }> = {
      Available: { bg: 'bg-emerald-50/90', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
      'Sold Out': { bg: 'bg-red-50/90', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
      Hidden: { bg: 'bg-gray-100/90', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
    };

    const renderItemCard = (item: MenuItem) => {
      const styles = statusStyles[item.status];
      const isPopular = popularIds.has(item.id);
      return (
        <div
          key={item.id}
          className="relative group"
          style={{ perspective: '1200px' }}
        >
          <div
            className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className={`absolute -top-px left-8 right-8 h-1 rounded-full ${
                item.status === 'Available' ? 'bg-gradient-to-r from-emerald-300 to-teal-300' : item.status === 'Sold Out' ? 'bg-gradient-to-r from-red-300 to-pink-300' : 'bg-gradient-to-r from-gray-300 to-gray-400'
              } opacity-60 group-hover:opacity-100 transition-opacity`}
            />

            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${styles.bg} ${styles.text} ${styles.border}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${styles.dot} ${item.status === 'Available' ? 'animate-pulse' : ''}`} />
                  {item.status}
                </span>
                {isPopular && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 backdrop-blur-sm uppercase tracking-wide">
                    <Flame size={10} /> Popular
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/90 text-gray-700 border border-white/60 backdrop-blur-sm uppercase tracking-wide">
                  {item.category}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <button
                  type="button"
                  onClick={() => openEditForm(item)}
                  className="h-9 w-9 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 hover:text-[#b93815] flex items-center justify-center border border-gray-200 shadow-lg hover:scale-110 transition-all"
                  aria-label={`Edit ${item.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleAvailability(item.id)}
                  className="h-9 w-9 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 hover:text-emerald-600 flex items-center justify-center border border-gray-200 shadow-lg hover:scale-110 transition-all"
                  aria-label={`Toggle availability for ${item.name}`}
                >
                  {item.status === 'Available' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(item.id)}
                  className="h-9 w-9 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 hover:text-red-600 flex items-center justify-center border border-gray-200 shadow-lg hover:scale-110 transition-all"
                  aria-label={`Delete ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col relative">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-[#b93815] transition-colors">{item.name}</h3>
                <p className="text-base font-extrabold text-[#b93815] whitespace-nowrap">${item.price.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">{item.description}</p>

              <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold mb-3">
                <span className="inline-flex items-center gap-1"><ShoppingBag size={11} /> {item.orders} sold</span>
                <span className="inline-flex items-center gap-1 text-emerald-600"><DollarSign size={11} /> {item.revenue.toLocaleString()}</span>
              </div>

              <div className="mt-auto flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      tag === 'Best Seller'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {tag === 'Best Seller' ? <Star size={12} /> : <Leaf size={12} />}
                    {tag}
                  </span>
                ))}
              </div>

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>
        </div>
      );
    };

    const renderAllItems = () => (
      <div className="space-y-6">
        {/* Toolbar: search + add */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              type="text"
              placeholder="Search menu items by name, description, or category..."
              className="w-full bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 focus:border-[#b93815]"
            />
          </div>
          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#b93815] to-[#9a2c0f] hover:from-[#a1320f] hover:to-[#7c1f08] text-white font-bold py-2.5 px-5 rounded-2xl shadow-lg shadow-orange-200 border border-white/20 border-b-4 border-b-[#7c1f08] active:border-b-0 active:translate-y-1 active:shadow-md transition-all text-sm"
          >
            <Plus size={16} /> Add New Item
          </button>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const liveCount = items.filter((i) => i.category === cat.name).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setMenuCategory(cat.name)}
                className={`relative px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                  menuCategory === cat.name
                    ? 'bg-[#b93815] text-white border-[#b93815] shadow-lg shadow-orange-200 scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-105'
                }`}
              >
                <span className="relative z-10">{cat.name}</span>
                <span className={`ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-extrabold ${menuCategory === cat.name ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {liveCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Items grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
            <UtensilsCrossed size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-base font-bold text-gray-700">No items match your filters</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting the search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(renderItemCard)}
            <button
              type="button"
              onClick={openAddForm}
              className="relative group"
              style={{ perspective: '1200px' }}
            >
              <div
                className="relative bg-white rounded-3xl border-2 border-dashed border-gray-300 hover:border-[#b93815] bg-gray-50/50 hover:bg-[#fff1ec] transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2 hover:scale-[1.02] flex flex-col items-center justify-center aspect-[4/3] min-h-[280px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="h-16 w-16 rounded-2xl bg-white border-2 border-gray-200 group-hover:border-[#b93815] flex items-center justify-center text-gray-400 group-hover:text-[#b93815] mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Plus size={28} strokeWidth={2.5} />
                </div>
                <p className="text-base font-bold text-gray-700 group-hover:text-[#b93815] transition-colors">Add New Item</p>
                <p className="text-sm text-gray-400 group-hover:text-[#b93815]/70 transition-colors mt-1">Create a new menu entry</p>
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-gray-300 group-hover:bg-[#b93815] group-hover:animate-ping transition-all" />
              </div>
            </button>
          </div>
        )}
      </div>
    );

    const renderAddNewItem = () => (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#b93815] to-[#9a2c0f] text-white flex items-center justify-center shadow-lg shadow-orange-200">
            {editingItem ? <Pencil size={20} /> : <Plus size={20} />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</h2>
            <p className="text-xs text-gray-500">{editingItem ? 'Update the details for this menu item' : 'Create a new entry for your menu'}</p>
          </div>
        </div>

        {formError && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-semibold">{formError}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Item Name *</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Truffle Smashburger"
              className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
          <textarea
            rows={3}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Describe ingredients, taste, story..."
            className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Category *</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-gray-700 bg-white focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20"
            >
              {categories.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Image URL {editingItem ? '' : '*'}</label>
            <input
              type="url"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-2">
            {['Best Seller', 'Vegetarian', 'Spicy', 'New', 'Gluten-Free'].map((tag) => {
              const active = formTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setFormTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    active
                      ? 'bg-[#fff1ec] text-[#b93815] border-[#f3c9ba]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {formImage && (
          <div className="mt-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Preview</p>
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
              <Image src={formImage} alt="Preview" fill className="object-cover" unoptimized />
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setMenuSubTab('All Items');
              setEditingItem(null);
            }}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveItem}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#b93815] hover:bg-[#9a2c0f] rounded-xl shadow-sm hover:shadow transition-all"
          >
            {editingItem ? 'Save Changes' : 'Publish Item'}
          </button>
        </div>
      </div>
    );

    const renderCategories = () => (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-200">
              <FolderTree size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Food Categories</h2>
              <p className="text-xs text-gray-500">Organize your menu into categories</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              placeholder="New category name (e.g. Desserts)"
              className="flex-1 rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20"
            />
            <button
              type="button"
              onClick={addCategory}
              disabled={!newCategoryName.trim()}
              className="inline-flex items-center justify-center gap-2 bg-[#b93815] hover:bg-[#9a2c0f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all text-sm"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => {
              const liveCount = items.filter((i) => i.category === cat.name).length;
              return (
                <div
                  key={cat.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-orange-50 text-[#b93815] flex items-center justify-center border border-white">
                    <Tag size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-500">{liveCount} item{liveCount !== 1 ? 's' : ''}</p>
                  </div>
                  {cat.id !== 'all' && (
                    <button
                      type="button"
                      onClick={() => removeCategory(cat.id)}
                      className="h-9 w-9 rounded-xl bg-white text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 flex items-center justify-center transition-all hover:scale-110"
                      aria-label={`Remove ${cat.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    const renderAvailability = () => {
      const availabilityGroups: { status: MenuItem['status']; items: MenuItem[]; accent: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
        { status: 'Available', items: items.filter((i) => i.status === 'Available'), accent: 'from-emerald-300 to-teal-300', icon: Eye },
        { status: 'Sold Out', items: items.filter((i) => i.status === 'Sold Out'), accent: 'from-red-300 to-pink-300', icon: EyeOff },
        { status: 'Hidden', items: items.filter((i) => i.status === 'Hidden'), accent: 'from-gray-300 to-gray-400', icon: ToggleLeft },
      ];

      return (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(['All', 'Available', 'Sold Out', 'Hidden'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setAvailabilityFilter(s)}
                className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all border ${
                  availabilityFilter === s
                    ? 'bg-[#b93815] text-white border-[#b93815] shadow-lg shadow-orange-200 scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:scale-105'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {availabilityGroups.map((group) => {
            if (group.status === 'Hidden' && availabilityFilter === 'All') {
              return null;
            }
            if (availabilityFilter !== 'All' && availabilityFilter !== group.status) return null;
            return (
              <div key={group.status} className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center border border-white">
                      <group.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{group.status} Items</h3>
                      <p className="text-xs text-gray-500">{group.items.length} item{group.items.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
                <div className={`h-1 rounded-full bg-gradient-to-r ${group.accent} opacity-60 mb-5`} />
                {group.items.length === 0 ? (
                  <p className="text-sm text-gray-400 italic text-center py-6">No items in this status.</p>
                ) : (
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                          <Image src={item.image} alt={item.alt} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-gray-500">{item.category} Â· ${item.price.toFixed(2)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleAvailability(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-[#b93815] text-gray-700 hover:text-[#b93815] text-xs font-bold transition-all hover:scale-105"
                        >
                          <ToggleRight size={14} /> Change
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Menu Management
            </h1>
            <p className="mt-1 text-base text-gray-500">
              Organize your menu items, categories, and pricing.
            </p>
          </div>
          <div className="text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm">
            {items.length} item{items.length !== 1 ? 's' : ''} Â· {categories.length - 1} categor{categories.length - 1 !== 1 ? 'ies' : 'y'}
          </div>
        </div>

        {/* Sub-module Tabs */}
        <div className="flex flex-wrap gap-2 bg-white/70 border border-gray-200 rounded-2xl p-1.5 shadow-sm">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === 'Add New Item') {
                  openAddForm();
                } else {
                  setMenuSubTab(tab.id);
                  setEditingItem(null);
                }
              }}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                menuSubTab === tab.id
                  ? 'bg-gradient-to-b from-[#b93815] to-[#9a2c0f] text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-white hover:text-[#b93815]'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {menuSubTab === 'All Items' && renderAllItems()}
        {menuSubTab === 'Add New Item' && renderAddNewItem()}
        {menuSubTab === 'Categories' && renderCategories()}
        {menuSubTab === 'Item Availability' && renderAvailability()}

        {/* Delete confirmation modal */}
        {deleteConfirm && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-extrabold text-gray-900">Delete this item?</h3>
              <p className="mt-1 text-sm text-gray-500">
                This will permanently remove the item from your menu. This action cannot be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(deleteConfirm)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-b from-red-500 to-red-700 text-white font-semibold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => {
    const subTabs: { id: typeof analyticsSubTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
      { id: 'Today Sales', label: "Today's Sales", icon: DollarSign },
      { id: 'Revenue', label: 'Revenue', icon: TrendingUp },
      { id: 'Orders Analytics', label: 'Orders Analytics', icon: ShoppingBag },
      { id: 'Best-Selling Items', label: 'Best-Selling Items', icon: Star },
    ];

    const dayChart = analyticsTimeframe === 'This Year' ? analyticsMonthly : analyticsDaily;
    const maxChart = Math.max(...dayChart.map((d) => d.value), 1);

    const renderMetricCard = (label: string, value: string, icon: React.ComponentType<{ size?: number; className?: string }>, color: string, change: string, bg: string, text: string) => (
      <div className="relative group" style={{ perspective: '1000px' }}>
        <div
          className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu hover:rotate-y-6 hover:-translate-y-1"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
          <div className={`absolute -top-px left-6 right-6 h-1 rounded-full bg-gradient-to-r ${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
          <div className="p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <div className={`h-12 w-12 rounded-2xl ${bg} ${text} flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {React.createElement(icon, { size: 22 })}
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">{change}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );

    const renderSalesBarChart = () => {
      const data = analyticsMetric === 'Sales' ? dayChart : dayChart.map((d) => ({ day: d.day, value: Math.round(d.value / 22) }));
      const max = Math.max(...data.map((d) => d.value), 1);
      return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{analyticsMetric} Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {analyticsTimeframe === 'This Year' ? 'Monthly' : 'Daily'} data Â· {analyticsTimeframe}
              </p>
            </div>
            <div className="flex gap-1.5 bg-gray-100 rounded-2xl p-1 border border-white/60 shadow-inner self-start sm:self-auto">
              {(['Sales', 'Orders'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAnalyticsMetric(m)}
                  className={`relative px-4 py-1.5 text-xs font-bold rounded-xl transition-colors ${analyticsMetric === m ? 'text-white' : 'text-gray-600'}`}
                >
                  {analyticsMetric === m && (
                    <span className="absolute inset-0 bg-gradient-to-b from-[#b93815] to-[#9a2c0f] rounded-xl shadow-md" />
                  )}
                  <span className="relative z-10">{m}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-64 flex items-end gap-2 sm:gap-3 px-2">
            {data.map((item, index) => {
              const heightPct = Math.max(8, (item.value / max) * 100);
              return (
                <div key={item.day + index} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                  <div className="relative w-full" style={{ height: '180px' }}>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      <div className="bg-gray-900 text-white text-[10px] font-bold rounded-lg px-2 py-1 shadow-xl whitespace-nowrap">
                        {analyticsMetric === 'Sales' ? `$${item.value.toLocaleString()}` : `${item.value} orders`}
                      </div>
                    </div>
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] rounded-t-xl"
                      style={{
                        height: `${heightPct}%`,
                        background: 'linear-gradient(180deg, #fb923c 0%, #ea580c 50%, #9a3412 100%)',
                        transform: 'rotateX(-10deg) rotateY(6deg) translateZ(6px)',
                        transformStyle: 'preserve-3d',
                        boxShadow: '0 10px 20px -6px rgba(234,88,12,0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/50 rounded-t-xl" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const renderTodaySales = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {renderMetricCard("Today's Sales", `$${todaySales.toLocaleString()}`, DollarSign, 'from-emerald-400 to-emerald-600', '+12.5%', 'bg-emerald-50', 'text-emerald-600')}
          {renderMetricCard('Orders Today', totalOrders.toLocaleString(), ShoppingBag, 'from-blue-400 to-blue-600', '+8.2%', 'bg-blue-50', 'text-blue-600')}
          {renderMetricCard('Avg. Order Value', `$${avgOrderValue.toFixed(2)}`, TrendingUp, 'from-amber-400 to-amber-600', '+5.4%', 'bg-amber-50', 'text-amber-600')}
          {renderMetricCard('Completion Rate', '92%', CheckCircle2, 'from-teal-400 to-teal-600', '+3.1%', 'bg-teal-50', 'text-teal-600')}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">{renderSalesBarChart()}</div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">Hourly Breakdown</h2>
              <p className="text-xs text-gray-500">Orders by hour Â· {analyticsTimeframe}</p>
            </div>
            <div className="space-y-3">
              {analyticsHourly.map((h) => {
                const max = Math.max(...analyticsHourly.map((x) => x.orders), 1);
                const w = (h.orders / max) * 100;
                const isPeak = h.orders === max;
                return (
                  <div key={h.time} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 w-14 shrink-0">{h.time}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className={`h-2.5 rounded-full transition-all duration-700 ${isPeak ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-[#fcd34d] to-[#f59e0b]'}`} style={{ width: `${w}%` }} />
                    </div>
                    <span className="text-xs font-extrabold text-gray-900 w-10 text-right">{h.orders}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );

    const renderRevenue = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {renderMetricCard('Total Revenue', `$${totalRevenue.toLocaleString()}`, DollarSign, 'from-emerald-400 to-emerald-600', '+18.4%', 'bg-emerald-50', 'text-emerald-600')}
          {renderMetricCard('Gross Profit', `$${Math.round(totalRevenue * 0.38).toLocaleString()}`, TrendingUp, 'from-violet-400 to-purple-600', '+12.0%', 'bg-violet-50', 'text-violet-600')}
          {renderMetricCard('Avg. Daily', `$${Math.round(totalRevenue / (factor || 1)).toLocaleString()}`, Calendar, 'from-blue-400 to-blue-600', '+6.2%', 'bg-blue-50', 'text-blue-600')}
          {renderMetricCard('Payouts', `$${Math.round(totalRevenue * 0.92).toLocaleString()}`, Receipt, 'from-amber-400 to-amber-600', '+2.8%', 'bg-amber-50', 'text-amber-600')}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">{renderSalesBarChart()}</div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">Sales by Category</h2>
              <p className="text-xs text-gray-500">Distribution of revenue</p>
            </div>
            <div className="relative w-44 h-44 mx-auto mb-5" style={{ perspective: '1000px' }}>
              <div className="relative w-full h-full rounded-full hover:rotate-y-12 transition-transform duration-500" style={{ transformStyle: 'preserve-3d' }}>
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {categoryShare.map((item, i) => {
                    const circumference = 2 * Math.PI * 15.9155;
                    const offset = categoryShare.slice(0, i).reduce((s, d) => s + (d.percentage / 100) * circumference, 0);
                    return (
                      <circle
                        key={item.name}
                        cx="50"
                        cy="50"
                        r="15.9155"
                        fill="none"
                        strokeWidth="9"
                        strokeDasharray={`${(item.percentage / 100) * circumference} ${circumference}`}
                        strokeDashoffset={-offset}
                        className={item.color.replace('bg-', 'stroke-')}
                        style={{ transition: 'all 0.6s ease-out' }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-extrabold text-gray-900">100%</p>
                  <p className="text-[10px] text-gray-500 font-medium">Total</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {categoryShare.map((c) => (
                <div key={c.name} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${c.color} shadow-sm`} />
                    <span className="text-sm font-semibold text-gray-700">{c.name}</span>
                  </div>
                  <span className="text-sm font-extrabold text-gray-900">{c.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    const renderOrdersAnalytics = () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {renderMetricCard('Total Orders', totalOrders.toLocaleString(), ShoppingBag, 'from-blue-400 to-blue-600', '+12.0%', 'bg-blue-50', 'text-blue-600')}
          {renderMetricCard('Preparing', '3', Clock, 'from-amber-400 to-amber-600', 'Live', 'bg-amber-50', 'text-amber-600')}
          {renderMetricCard('Ready', '1', CheckCircle2, 'from-emerald-400 to-emerald-600', 'Live', 'bg-emerald-50', 'text-emerald-600')}
          {renderMetricCard('Delivered', '38', Receipt, 'from-teal-400 to-cyan-600', '+8%', 'bg-teal-50', 'text-teal-600')}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-lg">
                <BarChart3 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Order Status Breakdown</h2>
                <p className="text-xs text-gray-500">Performance of recent orders</p>
              </div>
            </div>
            <div className="space-y-4">
              {orderStatusBreakdown.map((s) => (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-gray-700">{s.status}</span>
                    <span className="text-sm font-extrabold text-gray-900">{s.count} orders Â· {s.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className={`h-3 rounded-full bg-gradient-to-r ${s.color} transition-all duration-1000`} style={{ width: `${s.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Order Performance</h2>
                <p className="text-xs text-gray-500">Speed and efficiency</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Avg Prep Time', value: '12 min', icon: Clock, color: 'from-amber-400 to-amber-600' },
                { label: 'On-time Rate', value: '94%', icon: CheckCircle2, color: 'from-emerald-400 to-emerald-600' },
                { label: 'Cancel Rate', value: '2.4%', icon: X, color: 'from-rose-400 to-red-600' },
                { label: 'Repeat Buyers', value: '38%', icon: User, color: 'from-violet-400 to-purple-600' },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${m.color} text-white flex items-center justify-center shadow-md mb-2`}>
                    <m.icon size={16} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{m.label}</p>
                  <p className="text-xl font-extrabold text-gray-900 mt-0.5">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {renderSalesBarChart()}
      </div>
    );

    const renderBestSelling = () => {
      const max = bestSelling[0]?.orders || 1;
      const totalItemRevenue = bestSelling.reduce((s, i) => s + i.revenue, 0);
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {renderMetricCard('Top Items', bestSelling.length.toString(), Star, 'from-amber-400 to-orange-600', 'Live', 'bg-amber-50', 'text-amber-600')}
            {renderMetricCard('Top Item Revenue', `$${totalItemRevenue.toLocaleString()}`, DollarSign, 'from-emerald-400 to-emerald-600', '+18%', 'bg-emerald-50', 'text-emerald-600')}
            {renderMetricCard('Avg per Top Item', `$${Math.round(totalItemRevenue / Math.max(bestSelling.length, 1)).toLocaleString()}`, TrendingUp, 'from-violet-400 to-purple-600', '+6%', 'bg-violet-50', 'text-violet-600')}
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#b93815] to-[#9a2c0f] text-white flex items-center justify-center shadow-lg">
                <Star size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Top Performing Items</h2>
                <p className="text-xs text-gray-500">Best sellers Â· {analyticsTimeframe}</p>
              </div>
            </div>
            <div className="space-y-3">
              {bestSelling.map((item, i) => {
                const w = (item.orders / max) * 100;
                return (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                    <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center font-extrabold text-sm text-white shadow-md ${i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' : i === 2 ? 'bg-gradient-to-br from-orange-300 to-amber-500' : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'}`}>
                      {i + 1}
                    </div>
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                      <Image src={item.image} alt={item.alt} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                      <div className="mt-1 w-full bg-white rounded-full h-1.5 overflow-hidden">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-[#fcd34d] to-[#b93815]" style={{ width: `${w}%` }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-extrabold text-gray-900">{item.orders} sold</p>
                      <p className="text-[11px] font-bold text-emerald-600">${item.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
              {bestSelling.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-8">No items yet â€” add menu items to see top performers.</p>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Sales & Analytics</h1>
            <p className="mt-1 text-base text-gray-500">Track your restaurant's performance and make data-driven decisions.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select
                value={analyticsTimeframe}
                onChange={(e) => setAnalyticsTimeframe(e.target.value as typeof analyticsTimeframe)}
                className="appearance-none bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 focus:border-[#b93815]"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={downloadReport}
              className="inline-flex items-center gap-2 bg-gradient-to-b from-[#b93815] to-[#9a2c0f] hover:from-[#a1320f] hover:to-[#7c1f08] text-white font-bold py-2.5 px-5 rounded-2xl shadow-lg shadow-orange-200 border border-white/20 border-b-4 border-b-[#7c1f08] active:border-b-0 active:translate-y-1 active:shadow-md transition-all text-sm"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Sub-module Tabs */}
        <div className="flex flex-wrap gap-2 bg-white/70 border border-gray-200 rounded-2xl p-1.5 shadow-sm">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAnalyticsSubTab(tab.id)}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                analyticsSubTab === tab.id
                  ? 'bg-gradient-to-b from-[#b93815] to-[#9a2c0f] text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-white hover:text-[#b93815]'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {analyticsSubTab === 'Today Sales' && renderTodaySales()}
        {analyticsSubTab === 'Revenue' && renderRevenue()}
        {analyticsSubTab === 'Orders Analytics' && renderOrdersAnalytics()}
        {analyticsSubTab === 'Best-Selling Items' && renderBestSelling()}
      </div>
    );
  };

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

  const renderAIFoodStudio = () => {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              AI Food Studio
            </h1>
            <p className="mt-1 text-base text-gray-500">
              Create and optimize menu items with AI-powered tools.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 shadow-sm">
              <Sparkles size={18} />
              <span className="text-sm font-bold">AI Ready</span>
            </span>
          </div>
        </div>

        {/* 3D Steppers */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          {steps.map((step, i) => {
            const isFirst = i === 0;
            return (
              <div key={step} className="flex items-center gap-3">
                <div
                  className="relative group"
                  style={{ perspective: '800px' }}
                >
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                      isFirst
                        ? 'bg-gradient-to-r from-[#b93815] to-[#9a2c0f] text-white border-[#b93815] shadow-lg shadow-orange-200'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {isFirst && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#b93815]/20 to-[#9a2c0f]/20 animate-pulse" />
                    )}
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                        isFirst ? 'bg-white text-[#b93815]' : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="relative z-10">{step}</span>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <span className="h-px w-6 bg-gray-300 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Dish Details & Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dish Details - 3D Card */}
            <div className="relative group" style={{ perspective: '1200px' }}>
              <div
                className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute -top-px left-8 right-8 h-1 rounded-full bg-gradient-to-r from-[#b93815] to-[#9a2c0f] opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#b93815] to-[#9a2c0f] text-white flex items-center justify-center shadow-lg shadow-orange-200">
                      <Sparkles size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Dish Details</h2>
                  </div>

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
                      className="mt-3 inline-flex items-center gap-2 bg-[#fff1ec] text-[#b93815] hover:bg-[#fbe2d8] font-semibold py-2.5 px-4 rounded-xl border border-[#f3c9ba] transition-all hover:scale-105 active:scale-95"
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
                </div>
              </div>
            </div>

            {/* Dish Images - 3D Card */}
            <div className="relative group" style={{ perspective: '1200px' }}>
              <div
                className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute -top-px left-8 right-8 h-1 rounded-full bg-gradient-to-r from-blue-300 to-cyan-300 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                      <Camera size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Dish Images</h2>
                  </div>

                  {/* Drop-zone with AI Analysis overlay */}
                  <div className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:border-[#b93815]/40 transition-colors p-10">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="bg-[#fff1ec] text-[#b93815] h-16 w-16 rounded-full flex items-center justify-center mb-4">
                        <Camera size={28} />
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 bg-[#b93815] text-white hover:bg-[#9a2c0f] font-bold py-3 px-5 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
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
                        <div className="relative">
                          <Loader2 size={48} className="text-[#b93815] animate-spin mb-3" />
                          <div className="absolute inset-0 bg-[#b93815]/20 rounded-full animate-ping" />
                        </div>
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
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium cursor-pointer border transition-all hover:scale-105 ${
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
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customization & Gallery */}
          <div className="space-y-6">
            {/* Menu Customization - 3D Card */}
            <div className="relative group" style={{ perspective: '1200px' }}>
              <div
                className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute -top-px left-8 right-8 h-1 rounded-full bg-gradient-to-r from-amber-300 to-orange-300 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-200">
                      <Star size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Menu Customization</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Best Seller Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Star size={16} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          Best Seller
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
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Leaf size={16} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          Vegetarian
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
                    <div>
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
                </div>
              </div>
            </div>

            {/* Recent Uploads - 3D Card */}
            <div className="relative group" style={{ perspective: '1200px' }}>
              <div
                className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform-gpu preserve-3d hover:rotate-y-2 hover:-translate-y-2"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute -top-px left-8 right-8 h-1 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-200">
                      <ImageIcon size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Recently Uploaded</h2>
                  </div>
                  {gallery.length === 0 ? (
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <ImageIcon size={16} /> No images uploaded yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {gallery.map((img) => (
                        <div
                          key={img.id}
                          className="relative group/img rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-100 hover:shadow-md transition-all"
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover group-hover/img:scale-110 transition-transform duration-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeFromGallery(img.id)}
                            aria-label={`Remove ${img.alt}`}
                            className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-all hover:scale-110 active:scale-95"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
            href="/vendor/create-menu"
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              pathname === '/vendor/create-menu'
                ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Sparkles
              size={18}
              className={
                pathname === '/vendor/create-menu'
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
