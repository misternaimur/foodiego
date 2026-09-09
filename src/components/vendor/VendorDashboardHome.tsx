import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Clock,
  Truck,
  Star,
  Plus,
  MapPin,
  Phone,
  Printer,
  X,
  Upload,
  Sparkles,
  Flame,
} from 'lucide-react';

const salesData = [
  { name: 'Mon', sales: 3200, orders: 42 },
  { name: 'Tue', sales: 3800, orders: 51 },
  { name: 'Wed', sales: 2900, orders: 38 },
  { name: 'Thu', sales: 4500, orders: 62 },
  { name: 'Fri', sales: 5200, orders: 78 },
  { name: 'Sat', sales: 6800, orders: 95 },
  { name: 'Sun', sales: 6100, orders: 88 },
];

const bestSellingItems = [
  {
    id: 1,
    name: 'Truffle Smashburger',
    orders: 156,
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop',
  },
  {
    id: 2,
    name: 'Spicy Korean Tacos',
    orders: 142,
    price: 14.5,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=120&h=120&fit=crop',
  },
  {
    id: 3,
    name: 'Matcha Tiramisu',
    orders: 98,
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=120&h=120&fit=crop',
  },
];

const recentOrders = [
  {
    id: '#ORD-2847',
    customer: 'Sarah Johnson',
    items: '2x Truffle Smashburger, 1x Fries',
    amount: 42.98,
    time: '2 min ago',
    status: 'New',
    address: '123 Main St, Apt 4B, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    breakdown: [
      { name: 'Truffle Smashburger', qty: 2, price: 18.99 },
      { name: 'French Fries', qty: 1, price: 5.0 },
    ],
  },
  {
    id: '#ORD-2846',
    customer: 'Michael Chen',
    items: '1x Spicy Korean Tacos',
    amount: 14.5,
    time: '8 min ago',
    status: 'Preparing',
    address: '456 Oak Ave, New York, NY 10002',
    phone: '+1 (555) 987-6543',
    breakdown: [
      { name: 'Spicy Korean Tacos', qty: 1, price: 14.5 },
    ],
  },
  {
    id: '#ORD-2845',
    customer: 'Emily Rodriguez',
    items: '3x Matcha Tiramisu',
    amount: 38.97,
    time: '15 min ago',
    status: 'Accepted',
    address: '789 Pine St, New York, NY 10003',
    phone: '+1 (555) 456-7890',
    breakdown: [
      { name: 'Matcha Tiramisu', qty: 3, price: 12.99 },
    ],
  },
  {
    id: '#ORD-2844',
    customer: 'David Kim',
    items: '1x Truffle Smashburger, 1x Soda',
    amount: 22.98,
    time: '22 min ago',
    status: 'Delivered',
    address: '321 Elm St, New York, NY 10004',
    phone: '+1 (555) 234-5678',
    breakdown: [
      { name: 'Truffle Smashburger', qty: 1, price: 18.99 },
      { name: 'Soda', qty: 1, price: 3.99 },
    ],
  },
  {
    id: '#ORD-2843',
    customer: 'Lisa Wang',
    items: '2x Spicy Korean Tacos',
    amount: 29.0,
    time: '30 min ago',
    status: 'New',
    address: '654 Maple Dr, New York, NY 10005',
    phone: '+1 (555) 876-5432',
    breakdown: [
      { name: 'Spicy Korean Tacos', qty: 2, price: 14.5 },
    ],
  },
];

const ratingBreakdown = [
  { stars: 5, percentage: 80 },
  { stars: 4, percentage: 15 },
  { stars: 3, percentage: 3 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-20"></div>
    </div>
  );
}

export default function VendorDashboardHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [activeDateFilter, setActiveDateFilter] = useState('Today');
  const [activeOrderTab, setActiveOrderTab] = useState('All');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof recentOrders[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const kpiCards = [
    {
      title: "Today's Sales",
      value: '$24,850',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
    },
    {
      title: 'Total Orders',
      value: '186',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Pending Orders',
      value: '12',
      change: '-3 from yesterday',
      trend: 'down',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Active Deliveries',
      value: '24',
      change: '+5 from yesterday',
      trend: 'up',
      icon: Truck,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-100',
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: '★',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-100',
    },
  ];

  const statusColors: Record<string, string> = {
    New: 'bg-green-100 text-green-700',
    Preparing: 'bg-amber-100 text-amber-700',
    Accepted: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-gray-100 text-gray-700',
  };

  const filteredOrders = recentOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeOrderTab === 'All' || order.status === activeOrderTab;
    return matchesSearch && matchesTab;
  });

  const orderTabs = ['All', 'New', 'Preparing', 'Accepted', 'Delivered'];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <TopHeaderBar
              isStoreOpen={isStoreOpen}
              setIsStoreOpen={setIsStoreOpen}
              activeDateFilter={activeDateFilter}
              setActiveDateFilter={setActiveDateFilter}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {kpiCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl p-5 shadow-sm border ${card.borderColor} hover:shadow-md transition-shadow duration-300`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-500">{card.title}</p>
                      <div className={`p-2 rounded-lg ${card.bgColor}`}>
                        <card.icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                    <div className="flex items-center gap-1">
                      {card.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium text-gray-600">{card.change}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
                  <div className="flex gap-2">
                    {['Today', 'This Week', 'Custom'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveDateFilter(filter)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          activeDateFilter === filter
                            ? 'bg-[#00A36C] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00A36C" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00A36C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                        formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Sales']}
                      />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#00A36C"
                        strokeWidth={3}
                        fill="url(#salesGradient)"
                        dot={{ fill: '#00A36C', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#00A36C' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {orderTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveOrderTab(tab)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                        activeOrderTab === tab
                          ? 'bg-[#00A36C] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Items
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <motion.tr
                          key={order.id}
                          whileHover={{ backgroundColor: '#f9fafb' }}
                          onClick={() => setSelectedOrder(order)}
                          className="border-b border-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{order.customer}</td>
                          <td className="py-4 px-4 text-sm text-gray-500 hidden md:table-cell">
                            {order.items}
                          </td>
                          <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                            ${order.amount.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500">{order.time}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Best Selling Items</h3>
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div className="space-y-4">
                  {bestSellingItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.orders} orders</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
                <div className="space-y-3">
                  {ratingBreakdown.map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium text-gray-700">{rating.stars}</span>
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${rating.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-yellow-400 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-500 w-10 text-right">
                        {rating.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-[#00A36C] to-[#008c5a] rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">AI Insights</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-orange-300" />
                      <span className="text-sm font-medium">Trending</span>
                    </div>
                    <p className="text-sm text-white/90">Truffle Smashburger trending +23%</p>
                    <p className="text-xs text-white/60 mt-1">
                      Consider increasing stock for weekend rush
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-sm font-medium">Revenue Opportunity</span>
                    </div>
                    <p className="text-sm text-white/90">Peak hours: 6PM - 10PM</p>
                    <p className="text-xs text-white/60 mt-1">
                      Consider adding staff during peak times
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-8 right-8 bg-[#00A36C] text-white p-4 rounded-full shadow-lg hover:bg-[#008c5a] transition-colors z-40"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create New Item</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dish Title</label>
                  <input
                    type="text"
                    placeholder="Enter dish name"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-transparent">
                      <option>Burgers</option>
                      <option>Tacos</option>
                      <option>Desserts</option>
                      <option>Drinks</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#00A36C] transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Drag and drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>
                <button className="w-full bg-[#00A36C] text-white py-3 rounded-xl font-medium hover:bg-[#008c5a] transition-colors flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate AI Description
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-end z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedOrder.id}</p>
                    </div>
                    <span
                      className={`px-4 py-1.5 text-sm font-medium rounded-full ${statusColors[selectedOrder.status]}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <MapPin className="w-4 h-4 text-[#00A36C]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Address</p>
                        <p className="text-sm font-medium text-gray-900">{selectedOrder.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Phone className="w-4 h-4 text-[#00A36C]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{selectedOrder.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Item Breakdown</h4>
                    <div className="space-y-2">
                      {selectedOrder.breakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            ${(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
                      <span className="text-base font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-[#00A36C]">
                        ${selectedOrder.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <Printer className="w-4 h-4" />
                    Print Receipt
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopHeaderBar({
  isStoreOpen,
  setIsStoreOpen,
  activeDateFilter,
  setActiveDateFilter,
  showNotifications,
  setShowNotifications,
  searchQuery,
  setSearchQuery,
}: {
  isStoreOpen: boolean;
  setIsStoreOpen: (value: boolean) => void;
  activeDateFilter: string;
  setActiveDateFilter: (value: string) => void;
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, Alex&#39;s Kitchen</h1>
          <p className="text-gray-500 mt-1">Here&#39;s what&#39;s happening with your restaurant today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveDateFilter('Today')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeDateFilter === 'Today'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveDateFilter('This Week')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeDateFilter === 'This Week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setActiveDateFilter('Custom')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeDateFilter === 'Custom'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Custom
            </button>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
            <span className="text-sm font-medium text-gray-700">Store Status:</span>
            <button
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isStoreOpen ? 'bg-[#00A36C]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isStoreOpen ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${isStoreOpen ? 'text-[#00A36C]' : 'text-gray-500'}`}
            >
              {isStoreOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900">Notifications</h4>
                </div>
                <div className="p-3">
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">New order #2847</p>
                    <p className="text-xs text-gray-500 mt-0.5">2 minutes ago</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">Review received</p>
                    <p className="text-xs text-gray-500 mt-0.5">15 minutes ago</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">Delivery completed</p>
                    <p className="text-xs text-gray-500 mt-0.5">1 hour ago</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-transparent w-48"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
