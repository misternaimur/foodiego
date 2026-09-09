'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Search,
  Bell,
  Clock,
  MapPin,
  Phone,
  Printer,
  X,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  TrendingUp,
  Star,
} from 'lucide-react';

type OrderStatus = 'New' | 'Active' | 'History';
type PaymentMethod = 'bKash' | 'Cash on Delivery' | 'Card';

interface OrderItem {
  id: string;
  name: string;
  customization?: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  elapsed: string;
  customerName: string;
  customerAvatar: string;
  customerSince: string;
  totalOrders: number;
  phone: string;
  address: string;
  city: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'COD';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
}

const mockOrders: Order[] = [
  {
    id: '#FG10234',
    status: 'New',
    elapsed: '2m ago',
    customerName: 'Rahim Ahmed',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    customerSince: '2022',
    totalOrders: 15,
    phone: '+880 1711-234567',
    address: '123 Lake Road, Block B',
    city: 'Dhaka',
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    items: [
      {
        id: '1',
        name: 'Truffle Smashburger',
        customization: '+ Extra Cheese',
        quantity: 2,
        unitPrice: 12.5,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=100',
      },
      {
        id: '2',
        name: 'Crispy Fries',
        quantity: 1,
        unitPrice: 4.5,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=100',
      },
    ],
    subtotal: 29.5,
    deliveryFee: 2.0,
    platformFee: 1.5,
  },
  {
    id: '#FG10235',
    status: 'New',
    elapsed: '5m ago',
    customerName: 'Karim Uddin',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    customerSince: '2021',
    totalOrders: 42,
    phone: '+880 1812-345678',
    address: '45 Park Avenue, Tejgaon',
    city: 'Dhaka',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'COD',
    items: [
      {
        id: '3',
        name: 'Margherita Pizza',
        quantity: 1,
        unitPrice: 14.0,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=100',
      },
    ],
    subtotal: 14.0,
    deliveryFee: 2.0,
    platformFee: 1.0,
  },
  {
    id: '#FG10236',
    status: 'Active',
    elapsed: '12m ago',
    customerName: 'Fatima Begum',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    customerSince: '2023',
    totalOrders: 8,
    phone: '+880 1912-456789',
    address: '78 Green Road, Dhanmondi',
    city: 'Dhaka',
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    items: [
      {
        id: '4',
        name: 'Chicken Biryani',
        customization: '+ Extra Raita',
        quantity: 2,
        unitPrice: 9.5,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=100',
      },
      {
        id: '5',
        name: 'Tandoori Chicken',
        quantity: 1,
        unitPrice: 11.0,
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=100',
      },
    ],
    subtotal: 30.0,
    deliveryFee: 2.5,
    platformFee: 1.5,
  },
  {
    id: '#FG10237',
    status: 'History',
    elapsed: '1h ago',
    customerName: 'Nasir Hossain',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    customerSince: '2020',
    totalOrders: 67,
    phone: '+880 1612-567890',
    address: '90 Main Road, Uttara',
    city: 'Dhaka',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    items: [
      {
        id: '6',
        name: 'BBQ Ribs',
        quantity: 1,
        unitPrice: 18.0,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=100',
      },
    ],
    subtotal: 18.0,
    deliveryFee: 2.0,
    platformFee: 1.0,
  },
];

const kpiCards = [
  {
    title: "Today's Sales",
    value: '$24,850',
    trend: '+12.5%',
    icon: TrendingUp,
    bgColor: 'bg-emerald-50',
    color: 'text-emerald-600',
    borderColor: 'border-emerald-100',
  },
  {
    title: 'Total Orders',
    value: '186',
    trend: '+8.2%',
    icon: ShoppingBag,
    bgColor: 'bg-blue-50',
    color: 'text-blue-600',
    borderColor: 'border-blue-100',
  },
  {
    title: 'Pending Orders',
    value: '12',
    trend: '3 urgent',
    icon: Clock,
    bgColor: 'bg-amber-50',
    color: 'text-amber-600',
    borderColor: 'border-amber-100',
  },
  {
    title: 'Active Rating',
    value: '4.8 ★',
    trend: 'Top 5%',
    icon: Star,
    bgColor: 'bg-yellow-50',
    color: 'text-yellow-600',
    borderColor: 'border-yellow-100',
  },
];

const filterTabs: { label: string; value: OrderStatus; count?: number }[] = [
  { label: 'New Orders', value: 'New', count: 4 },
  { label: 'Active Orders', value: 'Active' },
  { label: 'History', value: 'History' },
];

const paymentColors: Record<PaymentMethod, string> = {
  bKash: 'bg-pink-50 text-pink-600 border-pink-100',
  'Cash on Delivery': 'bg-gray-100 text-gray-700 border-gray-200',
  Card: 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function OrdersDashboard() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus>('New');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(mockOrders[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesFilter = order.status === activeFilter;
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const selectedOrder = mockOrders.find((order) => order.id === selectedOrderId) || mockOrders[0];

  const totalAmount = selectedOrder.subtotal + selectedOrder.deliveryFee + selectedOrder.platformFee;


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search orders, customer name, dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <button
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                isStoreOpen
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${isStoreOpen ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {isStoreOpen ? 'Open' : 'Closed'}
            </button>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=100"
                alt="Profile"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`bg-white rounded-2xl p-5 shadow-sm border ${card.borderColor} hover:shadow-md transition-shadow duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-extrabold text-gray-900">{card.value}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  <TrendingUp size={12} />
                  {card.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Orders Queue */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-1 p-1.5 border-b border-gray-100">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveFilter(tab.value)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                      activeFilter === tab.value
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-white border border-gray-200 rounded-lg">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Filter Tag */}
              {activeFilter === 'New' && (
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">
                    Status: <span className="font-semibold text-gray-900">New</span>
                  </span>
                  <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Clear all
                  </button>
                </div>
              )}

              {/* Order Cards */}
              <div className="divide-y divide-gray-100">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrderId === order.id;
                    return (
                      <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        onClick={() => setSelectedOrderId(order.id)}
                        className={`p-5 cursor-pointer transition-all hover:bg-gray-50 ${
                          isSelected ? 'bg-emerald-50/50 ring-1 ring-inset ring-emerald-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                              <Image
                                src={order.customerAvatar}
                                alt={order.customerName}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-gray-900">{order.id}</h3>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                  order.status === 'New' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  order.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-gray-100 text-gray-700 border-gray-200'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                <Clock size={12} />
                                {order.elapsed}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border mt-1.5 ${paymentColors[order.paymentMethod]}`}>
                              {order.paymentMethod} - {order.paymentStatus}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 max-w-[180px] truncate">
                            {order.items.map(i => i.name).join(', ')}
                          </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Order ${order.id} accepted`);
                            }}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={16} />
                            Accept Order
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Order ${order.id} rejected`);
                            }}
                            className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Panel - Order Inspector */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{selectedOrder.id}</h2>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      selectedOrder.status === 'New' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      selectedOrder.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Clock size={12} />
                  Placed: Today, 14:32
                </p>
              </div>

              {/* Customer Information */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image
                      src={selectedOrder.customerAvatar}
                      alt={selectedOrder.customerName}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{selectedOrder.customerName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Customer since {selectedOrder.customerSince} • {selectedOrder.totalOrders} Orders
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} className="text-gray-400" />
                      {selectedOrder.phone}
                    </div>
                    <a href={`tel:${selectedOrder.phone}`} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                      Call
                    </a>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <span>
                      {selectedOrder.address}, {selectedOrder.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Itemized Order List */}
              <div className="p-6 border-b border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                        {item.customization && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.customization}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-gray-900">${selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium text-gray-900">${selectedOrder.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Actions */}
              <div className="p-4 bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => alert(`Order ${selectedOrder.id} accepted`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Accept Order
                  </button>
                  <button
                    onClick={() => alert(`Order ${selectedOrder.id} rejected`)}
                    className="bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject Order
                  </button>
                </div>
                <button className="w-full mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Printer size={16} />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
