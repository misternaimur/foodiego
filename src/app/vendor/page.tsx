'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  Sparkles, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  Search, 
  Bell, 
  Plus, 
  Pencil,
  X,
  Menu,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  status: 'Available' | 'Sold Out';
  category: 'Burgers' | 'Pizza' | 'Drinks' | 'Sides';
  tag?: {
    text: string;
    bg: string;
    textCol: string;
  };
}

type DashboardTab = 'Menu Management' | 'Orders' | 'AI Food Studio' | 'Analytics' | 'Review';
type MenuCategory = MenuItem['category'];
type MenuStatus = MenuItem['status'];
type MenuTag = 'BEST SELLER' | 'VEGETARIAN' | 'NEW' | 'None';

export default function RestaurantDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<DashboardTab>('Menu Management');
  const [activeFilter, setActiveFilter] = useState<'All Items' | 'Burgers' | 'Pizza' | 'Drinks' | 'Sides'>('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<MenuCategory>('Burgers');
  const [newStatus, setNewStatus] = useState<MenuStatus>('Available');
  const [newTag, setNewTag] = useState<MenuTag>('None');

  // Menu items list state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      title: "Truffle Smashburger",
      price: 18.50,
      description: "Double wagyu patty, truffle aioli, aged cheddar, caramelized onions",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
      status: "Available",
      category: "Burgers",
      tag: { text: "BEST SELLER", bg: "bg-[#fef08a]", textCol: "text-[#854d0e]" }
    },
    {
      id: 2,
      title: "Woodfired Margherita",
      price: 22.00,
      description: "San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive...",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=600",
      status: "Sold Out",
      category: "Pizza",
      tag: { text: "VEGETARIAN", bg: "bg-[#e0f2fe]", textCol: "text-[#0369a1]" }
    }
  ]);

  // Sidebar Links config
  const navLinks = [
    { name: 'Orders', icon: ShoppingBag, href: '#' },
    { name: 'Menu Management', icon: UtensilsCrossed, href: '#' },
    { name: 'AI Food Studio', icon: Sparkles, href: '#' },
    { name: 'Analytics', icon: BarChart3, href: '#' },
    { name: 'Review', icon: MessageSquare, href: '#' },
  ];

  // Tag color mapping
  const getTagColors = (tagType: MenuTag) => {
    switch (tagType) {
      case 'BEST SELLER':
        return { bg: 'bg-[#fef08a]', textCol: 'text-[#854d0e]' };
      case 'VEGETARIAN':
        return { bg: 'bg-[#e0f2fe]', textCol: 'text-[#0369a1]' };
      case 'NEW':
        return { bg: 'bg-[#dcfce7]', textCol: 'text-[#15803d]' };
      default:
        return { bg: 'bg-gray-100', textCol: 'text-gray-700' };
    }
  };

  // Add Item Handler
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const newItem: MenuItem = {
      id: Date.now(),
      title: newTitle,
      price: parseFloat(newPrice) || 0,
      description: newDesc || "No description provided.",
      image: newCategory === 'Burgers' 
        ? "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600"
        : newCategory === 'Pizza'
        ? "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=600"
        : newCategory === 'Drinks'
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
        : "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&q=80&w=600",
      status: newStatus,
      category: newCategory,
      tag: newTag !== 'None' ? { text: newTag, ...getTagColors(newTag) } : undefined
    };

    setMenuItems([...menuItems, newItem]);
    
    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    setNewCategory('Burgers');
    setNewStatus('Available');
    setNewTag('None');
    setIsAddModalOpen(false);
  };

  // Edit Item Handler
  const handleEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setMenuItems(menuItems.map(item => item.id === editingItem.id ? editingItem : item));
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Toggle Item Availability directly
  const toggleAvailability = (id: number) => {
    setMenuItems(menuItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'Available' ? 'Sold Out' : 'Available'
        };
      }
      return item;
    }));
  };

  // Filter & Search Logic
  const filteredItems = menuItems.filter(item => {
    const matchesFilter = activeFilter === 'All Items' || item.category === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* -------------------- SIDEBAR (LEFT) -------------------- */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 shrink-0 sticky top-0 h-screen">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="block">
            <h1 className="text-2xl font-bold tracking-tight text-[#b93815]">
              Foodiego Merchant
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-0.5">
              Premium Dashboard
            </p>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            return (
              <button
                key={link.name}
                onClick={() => setActiveTab(link.name as DashboardTab)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <link.icon size={18} className={isActive ? 'text-[#b93815]' : 'text-gray-400'} />
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Prominent Sidebar Button */}
        <div className="px-6 py-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full bg-[#b93815] text-white hover:bg-[#9a2c0f] font-bold py-3.5 px-4 rounded-xl shadow-md shadow-red-900/10 hover:shadow-lg hover:shadow-red-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Menu Item</span>
          </button>
        </div>

        {/* Merchant Section */}
        <div className="px-6 pb-1 pt-1">
          <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Merchant
          </p>
        </div>
        <nav className="px-6 space-y-1">
          <Link
            href="/account"
            className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              pathname === '/account'
                ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <User size={18} className={pathname === '/account' ? 'text-[#b93815]' : 'text-gray-400'} />
            <span>Merchant Profile</span>
          </Link>
          <Link
            href="/dashboard/restaurant/create"
            className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              pathname === '/dashboard/restaurant/create'
                ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Sparkles
              size={18}
              className={
                pathname === '/dashboard/restaurant/create' ? 'text-[#b93815]' : 'text-gray-400'
              }
            />
            <span>Create Menu Item</span>
          </Link>
        </nav>

        {/* Bottom Links */}
        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link
            href="#"
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Settings size={18} className="text-gray-400" />
            <span>Settings</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <HelpCircle size={18} className="text-gray-400" />
            <span>Support</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer (Sidebar) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col border-r border-gray-200 lg:hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[#b93815]">
                    Foodiego
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Premium Dashboard</p>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1.5">
                {navLinks.map((link) => {
                  const isActive = activeTab === link.name;
                  return (
                    <button
                      key={link.name}
                      onClick={() => {
                        setActiveTab(link.name as DashboardTab);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <link.icon size={18} className={isActive ? 'text-[#b93815]' : 'text-gray-400'} />
                      <span>{link.name}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="px-6 py-4">
                <button
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    setIsAddModalOpen(true);
                  }}
                  className="w-full bg-[#b93815] text-white hover:bg-[#9a2c0f] font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  <span>Add Menu Item</span>
                </button>
              </div>

              <div className="p-4 border-t border-gray-100 space-y-1">
                <p className="px-4 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Merchant
                </p>
                <Link
                  href="/account"
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    pathname === '/account'
                      ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <User size={18} className={pathname === '/account' ? 'text-[#b93815]' : 'text-gray-400'} />
                  <span>Merchant Profile</span>
                </Link>
                <Link
                  href="/dashboard/restaurant/create"
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    pathname === '/dashboard/restaurant/create'
                      ? 'bg-[#fff1ec] text-[#b93815] border-l-4 border-[#b93815] pl-3'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Sparkles
                    size={18}
                    className={
                      pathname === '/dashboard/restaurant/create' ? 'text-[#b93815]' : 'text-gray-400'
                    }
                  />
                  <span>Create Menu Item</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Settings size={18} className="text-gray-400" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <HelpCircle size={18} className="text-gray-400" />
                  <span>Support</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* -------------------- MAIN AREA -------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* -------------------- TOP HEADER -------------------- */}
        <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Hamburger (Mobile/Tablet) */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-xl bg-gray-50 border border-gray-200 lg:hidden flex items-center justify-center"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="relative max-w-md w-full flex-1 md:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-gray-200 text-sm text-gray-800 placeholder-gray-400 rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 focus:border-[#b93815] focus:bg-white transition-all"
            />
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Horizontal Nav Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
              <Link 
                href="#" 
                onClick={() => setActiveTab('Orders')}
                className={`py-2 transition-colors ${activeTab === 'Orders' ? 'text-[#b93815]' : 'hover:text-gray-900'}`}
              >
                Orders
              </Link>
              <Link 
                href="#" 
                onClick={() => setActiveTab('Menu Management')}
                className={`relative py-2 transition-colors ${activeTab === 'Menu Management' ? 'text-[#b93815]' : 'hover:text-gray-900'}`}
              >
                Menu Management
                {activeTab === 'Menu Management' && (
                  <span className="absolute bottom-[-10px] left-0 w-full h-0.5 bg-[#b93815] rounded-full" />
                )}
              </Link>
              <Link 
                href="#" 
                onClick={() => setActiveTab('Analytics')}
                className={`py-2 transition-colors ${activeTab === 'Analytics' ? 'text-[#b93815]' : 'hover:text-gray-900'}`}
              >
                Analytics
              </Link>
            </nav>

            {/* Secondary Header Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hidden sm:inline-flex items-center justify-center text-sm font-bold text-white bg-[#f2633a] hover:bg-[#d94e26] px-5 py-2.5 rounded-xl shadow-sm hover:shadow active:scale-[0.98] transition-all gap-1.5"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Menu Item</span>
            </button>

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </button>

            {/* User Profile Avatar */}
            <div className="relative group cursor-pointer" onClick={() => router.push('/')}>
              <div className="h-10 w-10 rounded-full border-2 border-white ring-2 ring-gray-100 overflow-hidden relative shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=120"
                  alt="Merchant Chef Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </header>

        {/* -------------------- MAIN CONTENT -------------------- */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl w-full mx-auto">
          
          {/* Header Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Menu Management
            </h2>
            <p className="mt-1.5 text-base text-gray-500 max-w-2xl leading-relaxed">
              Organize your offerings and update availability instantly. Create new items, customize prices, or edit descriptions in real-time.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mb-8">
            {(['All Items', 'Burgers', 'Pizza', 'Drinks', 'Sides'] as const).map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#b93815] text-white shadow-sm shadow-red-950/15'
                      : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Render Items */}
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col group"
              >
                {/* Image & Badge Container */}
                <div className="h-52 w-full relative bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  {/* Floating Badge */}
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className="absolute top-4 left-4 bg-white rounded-full px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm border border-gray-100 hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${item.status === 'Available' ? 'bg-blue-500' : 'bg-red-500'}`} />
                    <span>{item.status}</span>
                  </button>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title & Price */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-[#b93815] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <span className="text-xl font-black text-[#b93815] shrink-0">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    {item.tag ? (
                      <span className={`text-[10px] tracking-wider font-extrabold px-2.5 py-1 rounded-md uppercase ${item.tag.bg} ${item.tag.textCol}`}>
                        {item.tag.text}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-medium">NO TAG</span>
                    )}

                    <button
                      onClick={() => {
                        setEditingItem({ ...item });
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-[#b93815] hover:bg-[#fff1ec] rounded-xl transition-all cursor-pointer"
                      aria-label="Edit item"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Dash Card: Add New Item */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#b93815]/40 hover:bg-[#fff1ec]/5 p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[380px] transition-all group active:scale-[0.99]"
            >
              <div className="bg-[#fff1ec] text-[#b93815] h-14 w-14 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#b93815] group-hover:text-white transition-all shadow-sm">
                <Plus size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#b93815] transition-colors mb-2">
                Add New Item
              </h3>
              <p className="text-sm text-gray-500 max-w-[200px] leading-relaxed">
                Create a new culinary masterpiece for your customers.
              </p>
            </button>

          </div>
        </main>
      </div>

      {/* -------------------- ADD ITEM MODAL -------------------- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg rounded-2xl border border-gray-200 shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <UtensilsCrossed size={18} className="text-[#b93815]" />
                  <span>Add New Menu Item</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddItem} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Truffle Smashburger"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 18.50"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short description of ingredients, style..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as MenuCategory)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all bg-white"
                    >
                      <option value="Burgers">Burgers</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Sides">Sides</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as MenuStatus)}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all bg-white"
                    >
                      <option value="Available">Available</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Label Tag
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value as MenuTag)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all bg-white"
                  >
                    <option value="None">None</option>
                    <option value="BEST SELLER">BEST SELLER (Yellow)</option>
                    <option value="VEGETARIAN">VEGETARIAN (Blue)</option>
                    <option value="NEW">NEW (Green)</option>
                  </select>
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#b93815] hover:bg-[#9a2c0f] rounded-xl shadow-sm transition-all"
                  >
                    Create Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------- EDIT ITEM MODAL -------------------- */}
      <AnimatePresence>
        {isEditModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingItem(null);
              }}
              className="fixed inset-0 bg-black"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg rounded-2xl border border-gray-200 shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Pencil size={18} className="text-[#b93815]" />
                  <span>Edit Menu Item</span>
                </h3>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEditItem} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Category
                    </label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as MenuCategory })}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all bg-white"
                    >
                      <option value="Burgers">Burgers</option>
                      <option value="Pizza">Pizza</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Sides">Sides</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Status
                    </label>
                    <select
                      value={editingItem.status}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as MenuStatus })}
                      className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all bg-white"
                    >
                      <option value="Available">Available</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Label Tag
                  </label>
                  <select
                    value={editingItem.tag?.text || 'None'}
                    onChange={(e) => {
                      const text = e.target.value;
                      if (text === 'None') {
                        setEditingItem({ ...editingItem, tag: undefined });
                      } else {
                        setEditingItem({
                          ...editingItem,
                          tag: { text, ...getTagColors(text as MenuTag) }
                        });
                      }
                    }}
                    className="w-full rounded-xl border border-gray-300 py-2.5 px-3.5 text-sm text-black focus:border-[#b93815] focus:outline-none focus:ring-2 focus:ring-[#b93815]/20 transition-all bg-white"
                  >
                    <option value="None">None</option>
                    <option value="BEST SELLER">BEST SELLER (Yellow)</option>
                    <option value="VEGETARIAN">VEGETARIAN (Blue)</option>
                    <option value="NEW">NEW (Green)</option>
                  </select>
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#b93815] hover:bg-[#9a2c0f] rounded-xl shadow-sm transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
