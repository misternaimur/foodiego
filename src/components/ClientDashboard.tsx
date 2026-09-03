'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, UtensilsCrossed, Sparkles, Pencil, Star,
  ShoppingBag, BadgeCheck, Store, LayoutDashboard, Search, Bell,
  ChevronDown, DollarSign, TrendingUp, Download, Flame, CheckCircle2,
  BarChart3, Calendar, Receipt, Camera, Loader2, Clock, X, ArrowRight,
  CreditCard, Eye, LogOut, LayoutGrid, Settings, Truck, Ticket, Lock, Shield,
} from 'lucide-react';
import CreateMenuItem from '@/components/CreateMenuItem';
import { useApp } from '@/context/AppContext';

interface ClientDashboardProps {
  name?: string;
  role?: string;
  email?: string;
}

type TabId = 'dashboard' | 'profile' | 'orders' | 'create_menu' | 'ai-studio' | 'analytics' | 'payments' | 'delivery' | 'reviews' | 'support' | 'notifications' | 'settings';

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'create_menu', label: 'Create Menu Item', icon: Sparkles },
  { id: 'ai-studio', label: 'AI Food Studio', icon: Sparkles },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'payments', label: 'Payments & Earnings', icon: CreditCard },
  { id: 'delivery', label: 'Delivery Management', icon: Truck },
  { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
  { id: 'support', label: 'Support Ticket', icon: Ticket },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
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

type EarningStatus = 'Pending' | 'Available' | 'Paid Out';
type PaymentMethod = 'Bank Transfer' | 'Stripe' | 'PayPal';
type PaymentStatus = 'Completed' | 'Processing' | 'Failed';

interface OrderEarning {
  orderId: string;
  date: string;
  customerName: string;
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netEarning: number;
  status: EarningStatus;
  items?: Array<{ name: string; qty: number; price: number }>;
}

interface PaymentHistoryEntry {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  orderId?: string;
  receipt?: string;
}

const orderEarningsSeed: OrderEarning[] = [
  {
    orderId: '#A2045',
    date: '2026-08-30',
    customerName: 'Priya S.',
    grossAmount: 37.0,
    commissionRate: 12,
    commissionAmount: 4.44,
    netEarning: 32.56,
    status: 'Paid Out',
    items: [{ name: 'Truffle Smashburger', qty: 2, price: 18.5 }],
  },
  {
    orderId: '#A2044',
    date: '2026-08-30',
    customerName: 'Marcus J.',
    grossAmount: 22.0,
    commissionRate: 12,
    commissionAmount: 2.64,
    netEarning: 19.36,
    status: 'Available',
    items: [{ name: 'Woodfired Margherita', qty: 1, price: 22 }],
  },
  {
    orderId: '#A2043',
    date: '2026-08-29',
    customerName: 'Aisha R.',
    grossAmount: 44.0,
    commissionRate: 12,
    commissionAmount: 5.28,
    netEarning: 38.72,
    status: 'Paid Out',
    items: [{ name: 'Woodfired Margherita', qty: 2, price: 22 }],
  },
  {
    orderId: '#A2042',
    date: '2026-08-29',
    customerName: 'Ethan W.',
    grossAmount: 5.5,
    commissionRate: 12,
    commissionAmount: 0.66,
    netEarning: 4.84,
    status: 'Available',
    items: [{ name: 'Iced Caramel Latte', qty: 1, price: 5.5 }],
  },
  {
    orderId: '#A2041',
    date: '2026-08-28',
    customerName: 'Diego R.',
    grossAmount: 27.0,
    commissionRate: 12,
    commissionAmount: 3.24,
    netEarning: 23.76,
    status: 'Pending',
    items: [{ name: 'Truffle Smashburger', qty: 1, price: 18.5 }, { name: 'Crispy Fries', qty: 1, price: 8.5 }],
  },
  {
    orderId: '#A2040',
    date: '2026-08-28',
    customerName: 'Maya P.',
    grossAmount: 18.5,
    commissionRate: 12,
    commissionAmount: 2.22,
    netEarning: 16.28,
    status: 'Pending',
    items: [{ name: 'Truffle Smashburger', qty: 1, price: 18.5 }],
  },
  {
    orderId: '#A2039',
    date: '2026-08-27',
    customerName: 'Liam C.',
    grossAmount: 50.0,
    commissionRate: 12,
    commissionAmount: 6.0,
    netEarning: 44.0,
    status: 'Paid Out',
    items: [{ name: 'Truffle Smashburger', qty: 1, price: 18.5 }, { name: 'Crispy Truffle Fries', qty: 2, price: 8.0 }, { name: 'Iced Caramel Latte', qty: 2, price: 5.75 }],
  },
  {
    orderId: '#A2038',
    date: '2026-08-27',
    customerName: 'Sofia R.',
    grossAmount: 30.0,
    commissionRate: 12,
    commissionAmount: 3.6,
    netEarning: 26.4,
    status: 'Available',
    items: [{ name: 'Woodfired Margharita', qty: 1, price: 22 }, { name: 'Iced Caramel Latte', qty: 2, price: 4 }],
  },
  {
    orderId: '#A2037',
    date: '2026-08-26',
    customerName: 'Noor K.',
    grossAmount: 20.0,
    commissionRate: 12,
    commissionAmount: 2.4,
    netEarning: 17.6,
    status: 'Available',
    items: [{ name: 'Crispy Truffle Fries', qty: 1, price: 8 }, { name: 'Iced Caramel Latte', qty: 2, price: 6 }],
  },
  {
    orderId: '#A2036',
    date: '2026-08-26',
    customerName: 'Aarav M.',
    grossAmount: 40.5,
    commissionRate: 15,
    commissionAmount: 6.07,
    netEarning: 34.43,
    status: 'Paid Out',
    items: [{ name: 'Truffle Smashburger', qty: 2, price: 18.5 }, { name: 'Crispy Fries', qty: 1, price: 3.5 }],
  },
];

const paymentHistorySeed: PaymentHistoryEntry[] = [
  { id: 'P-10042', date: '2026-08-30T10:30', amount: 50.0, method: 'Bank Transfer', status: 'Completed', orderId: '#A2045', receipt: 'receipt-10042.pdf' },
  { id: 'P-10041', date: '2026-08-30T10:30', amount: 19.36, method: 'Bank Transfer', status: 'Completed', orderId: '#A2044', receipt: 'receipt-10041.pdf' },
  { id: 'P-10040', date: '2026-08-29T09:15', amount: 38.72, method: 'Stripe', status: 'Completed', orderId: '#A2043', receipt: 'receipt-10040.pdf' },
  { id: 'P-10039', date: '2026-08-29T09:15', amount: 4.84, method: 'Stripe', status: 'Completed', orderId: '#A2042', receipt: 'receipt-10039.pdf' },
  { id: 'P-10038', date: '2026-08-28T14:00', amount: 66.0, method: 'Bank Transfer', status: 'Processing', orderId: '#A2039', receipt: 'receipt-10038.pdf' },
  { id: 'P-10037', date: '2026-08-28T14:00', amount: 26.4, method: 'PayPal', status: 'Completed', orderId: '#A2038', receipt: 'receipt-10037.pdf' },
  { id: 'P-10036', date: '2026-08-27T11:45', amount: 17.6, method: 'PayPal', status: 'Completed', orderId: '#A2037', receipt: 'receipt-10036.pdf' },
  { id: 'P-10035', date: '2026-08-27T11:45', amount: 34.43, method: 'Bank Transfer', status: 'Failed', orderId: '#A2036', receipt: 'receipt-10035.pdf' },
];

type DeliveryStage = 'Picked Up' | 'In Transit' | 'Arriving Soon' | 'Delivered';
type RiderStatus = 'Available' | 'Busy' | 'Offline';

type NotificationType = 'New Order' | 'Order Status' | 'Payment' | 'Review' | 'Delivery' | 'Support' | 'System';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const notificationsSeed: NotificationItem[] = [
  { id: 'notif-1', type: 'New Order', title: 'New High-Value Order', message: 'Order #A2077 has been placed for $84.20.', time: '2 min ago', unread: true, icon: ShoppingBag },
  { id: 'notif-2', type: 'Order Status', title: 'Order Status Updated', message: 'Order #A2051 has been picked up by the rider.', time: '8 min ago', unread: true, icon: ArrowRight },
  { id: 'notif-3', type: 'Payment', title: 'Weekly Payout Processed', message: 'Your weekly payout of $1,284.50 has been initiated.', time: '4 hr ago', unread: true, icon: DollarSign },
  { id: 'notif-4', type: 'Review', title: 'New 5-Star Review', message: 'Priya S. left a 5-star review on Truffle Smashburger.', time: '12 min ago', unread: false, icon: Star },
  { id: 'notif-5', type: 'Delivery', title: 'Delivery Update', message: 'Driver is 3 minutes away from the customer.', time: '18 min ago', unread: false, icon: Truck },
  { id: 'notif-6', type: 'Support', title: 'Support Ticket Update', message: 'Your ticket #T-4821 has been marked as In Progress.', time: '2 hr ago', unread: false, icon: Ticket },
  { id: 'notif-7', type: 'System', title: 'System Announcement', message: 'Scheduled maintenance on Sep 5th from 2 AM to 4 AM.', time: '1 day ago', unread: false, icon: Bell },
];

interface RiderInfo {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  rating: number;
  vehicle: string;
  status: RiderStatus;
  eta: string;
}

interface DeliveryRecord {
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  rider: RiderInfo;
  stage: DeliveryStage;
  pickupTime: string;
  estimatedDelivery: string;
  actualDelivery: string | null;
  orderItems: Array<{ name: string; qty: number; price: number }>;
}

const ridersSeed: RiderInfo[] = [
  { id: 'R-001', name: 'Afrin', phone: '+1 (555) 101-2020', avatarUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=100', rating: 4.9, vehicle: 'Motorcycle', status: 'Available', eta: '5 min' },
  { id: 'R-002', name: 'Karim', phone: '+1 (555) 102-3030', rating: 4.7, vehicle: 'Bike', status: 'Busy', eta: '12 min' },
  { id: 'R-003', name: 'Diego', phone: '+1 (555) 103-4040', rating: 4.8, vehicle: 'Car', status: 'Available', eta: '8 min' },
  { id: 'R-004', name: 'Sara', phone: '+1 (555) 104-5050', rating: 4.6, vehicle: 'Motorcycle', status: 'Offline', eta: 'N/A' },
];

const activeDeliveriesSeed: DeliveryRecord[] = [
  {
    orderId: '#A2051',
    customerName: 'Aarav Mehta',
    customerAddress: '220 Maple St, Apt 4B',
    customerPhone: '+1 (555) 012-3344',
    rider: ridersSeed[0],
    stage: 'In Transit',
    pickupTime: '2026-09-02 11:32',
    estimatedDelivery: '2026-09-02 11:45',
    actualDelivery: null,
    orderItems: [{ name: 'Truffle Smashburger', qty: 2, price: 18.5 }],
  },
  {
    orderId: '#A2050',
    customerName: 'Sofia Reyes',
    customerAddress: '88 Oak Lane',
    customerPhone: '+1 (555) 022-9810',
    rider: ridersSeed[1],
    stage: 'Arriving Soon',
    pickupTime: '2026-09-02 11:28',
    estimatedDelivery: '2026-09-02 11:42',
    actualDelivery: null,
    orderItems: [{ name: 'Woodfired Margherita', qty: 1, price: 22.0 }],
  },
];

const deliveryHistorySeed: DeliveryRecord[] = [
  {
    orderId: '#A2044',
    customerName: 'Marcus J.',
    customerAddress: '7 Walnut Way',
    customerPhone: '+1 (555) 909-6611',
    rider: { id: 'R-003', name: 'Diego', phone: '+1 (555) 103-4040', rating: 4.8, vehicle: 'Car', status: 'Available', eta: 'N/A' },
    stage: 'Delivered',
    pickupTime: '2026-09-01 10:15',
    estimatedDelivery: '2026-09-01 10:30',
    actualDelivery: '2026-09-01 10:28',
    orderItems: [{ name: 'Woodfired Margherita', qty: 2, price: 22.0 }],
  },
  {
    orderId: '#A2041',
    customerName: 'Priya S.',
    customerAddress: '14 Pine Court',
    customerPhone: '+1 (555) 332-9988',
    rider: { id: 'R-001', name: 'Afrin', phone: '+1 (555) 101-2020', avatarUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=100', rating: 4.9, vehicle: 'Motorcycle', status: 'Available', eta: 'N/A' },
    stage: 'Delivered',
    pickupTime: '2026-09-01 09:45',
    estimatedDelivery: '2026-09-01 10:00',
    actualDelivery: '2026-09-01 09:58',
    orderItems: [{ name: 'Truffle Smashburger', qty: 1, price: 18.5 }],
  },
  {
    orderId: '#A2039',
    customerName: 'Ethan W.',
    customerAddress: '44 Spruce Pl',
    customerPhone: '+1 (555) 220-7788',
    rider: { id: 'R-002', name: 'Karim', phone: '+1 (555) 102-3030', rating: 4.7, vehicle: 'Bike', status: 'Busy', eta: 'N/A' },
    stage: 'Delivered',
    pickupTime: '2026-08-31 14:20',
    estimatedDelivery: '2026-08-31 14:35',
    actualDelivery: '2026-08-31 14:42',
    orderItems: [{ name: 'Iced Caramel Latte', qty: 1, price: 5.5 }],
  },
];

function deliveryStageBadge(stage: DeliveryStage): string {
  const map: Record<DeliveryStage, string> = {
    'Picked Up': 'bg-amber-50 text-amber-700 border border-amber-200',
    'In Transit': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Arriving Soon': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Delivered': 'bg-teal-50 text-teal-700 border border-teal-200',
  };
  return map[stage];
}

function riderStatusBadge(status: RiderStatus): string {
  const map: Record<RiderStatus, string> = {
    'Available': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Busy': 'bg-orange-50 text-orange-700 border border-orange-200',
    'Offline': 'bg-gray-100 text-gray-600 border border-gray-300',
  };
  return map[status];
}

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

  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [dateFilter, setDateFilter] = useState<'Today' | 'This Week' | 'This Month' | 'This Year'>('Today');
  const [orderFilter, setOrderFilter] = useState<'All' | 'New' | 'Active' | 'History'>('All');
  const [orders, setOrders] = useState<LiveOrder[]>(liveOrdersSeed);
  const [showRejectFor, setShowRejectFor] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [analyticsRange, setAnalyticsRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [chartMetric, setChartMetric] = useState<'Sales' | 'Orders'>('Sales');

  // Payments & Earnings state
  const [paymentsSearch, setPaymentsSearch] = useState('');
  const [paymentsDateRange, setPaymentsDateRange] = useState<'Today' | 'This Week' | 'This Month' | 'This Year'>('Today');
  const [earningStatusFilter, setEarningStatusFilter] = useState<EarningStatus | 'All'>('All');
  const [paymentsSubTab, setPaymentsSubTab] = useState<'earnings' | 'history' | 'commission'>('earnings');
  const [orderEarnings, setOrderEarnings] = useState<OrderEarning[]>(orderEarningsSeed);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryEntry[]>(paymentHistorySeed);
  const [selectedEarningOrder, setSelectedEarningOrder] = useState<OrderEarning | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Restaurant Profile state
  const [restaurantName, setRestaurantName] = useState('Truffle House Kitchen');
  const [restaurantDescription, setRestaurantDescription] = useState('Gourmet burgers and artisanal sides crafted with premium ingredients.');
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [restaurantCover, setRestaurantCover] = useState<string | null>(null);
  const [businessHours, setBusinessHours] = useState('10:00 AM - 11:00 PM');
  const operatingDaysSeed = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [openDays, setOpenDays] = useState<string[]>(operatingDaysSeed);
  const [restaurantStatus, setRestaurantStatus] = useState<'Open' | 'Closed'>('Open');
  const [contactEmail, setContactEmail] = useState('hello@trufflehouse.co');
  const [contactPhone, setContactPhone] = useState('+1 (555) 019-2834');
  const [restaurantAddress, setRestaurantAddress] = useState('128 Savor Avenue, Foodiego City, CA 90001');

  // Settings state
  const [settingsSubTab, setSettingsSubTab] = useState<'account' | 'business' | 'notifications' | 'security'>('account');
  const [ownerName, setOwnerName] = useState('abid');
  const [accountEmail, setAccountEmail] = useState('abid@trufflehouse.co');
  const [accountPhone, setAccountPhone] = useState('+1 (555) 019-2834');
  const [taxId, setTaxId] = useState('TX-8492-5521');
  const [payoutMethod, setPayoutMethod] = useState('Bank Transfer · Chase ****4521');
  const [notificationFlags, setNotificationFlags] = useState({
    newOrder: true,
    orderStatus: true,
    paymentEarnings: true,
    newReview: true,
    deliveryUpdate: true,
    supportTicket: false,
    systemAnnouncement: true,
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Support Ticket state
  const [supportCategory, setSupportCategory] = useState<'Order Issue' | 'Payment Issue' | 'Menu Issue' | 'Delivery Issue' | 'Account Issue' | 'Other'>('Order Issue');
  const [supportAttachment, setSupportAttachment] = useState<string | null>(null);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsSeed);
  const [notificationsFilter, setNotificationsFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Delivery Management state
  const [deliverySubTab, setDeliverySubTab] = useState<'active' | 'riders' | 'history'>('active');
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryRecord[]>(activeDeliveriesSeed);
  const [deliveryHistory, setDeliveryHistory] = useState<DeliveryRecord[]>(deliveryHistorySeed);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null);

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

  const handleImageUpload = (file: File, setter: (val: string) => void) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
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

  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showUserDropdown]);

  const metrics = useMemo(() => {
    const factor = dateFilter === 'Today' ? 1 : dateFilter === 'This Week' ? 6.5 : dateFilter === 'This Month' ? 27 : 312;
    return {
      orders: Math.round(38 * factor),
      revenue: Math.round(1240 * factor),
      rating: 4.8,
      growth: dateFilter === 'Today' ? 12 : dateFilter === 'This Week' ? 18 : 24,
    };
  }, [dateFilter]);

  const dashboardEarnings = useMemo(() => {
    const all = orderEarningsSeed;
    return {
      totalGross: all.reduce((s, o) => s + o.grossAmount, 0),
      totalNet: all.reduce((s, o) => s + o.netEarning, 0),
      totalCommission: all.reduce((s, o) => s + o.commissionAmount, 0),
      available: all.filter((o) => o.status === 'Available').reduce((s, o) => s + o.netEarning, 0),
      pending: all.filter((o) => o.status === 'Pending').reduce((s, o) => s + o.netEarning, 0),
    };
  }, []);

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

  // Payments & Earnings computed metrics
  const paymentsFactor = paymentsDateRange === 'Today' ? 1 : paymentsDateRange === 'This Week' ? 0.85 : paymentsDateRange === 'This Month' ? 0.75 : 0.6;
  const paymentsMetrics = useMemo(() => {
    const all = orderEarnings;
    const totalGross = all.reduce((s, o) => s + o.grossAmount, 0);
    const totalCommission = all.reduce((s, o) => s + o.commissionAmount, 0);
    const totalNet = all.reduce((s, o) => s + o.netEarning, 0);
    const pending = all.filter((o) => o.status === 'Pending').reduce((s, o) => s + o.netEarning, 0);
    const available = all.filter((o) => o.status === 'Available').reduce((s, o) => s + o.netEarning, 0);
    return {
      totalGross: Math.round(totalGross * paymentsFactor * 100) / 100,
      totalCommission: Math.round(totalCommission * paymentsFactor * 100) / 100,
      totalNet: Math.round(totalNet * paymentsFactor * 100) / 100,
      pending: Math.round(pending * paymentsFactor * 100) / 100,
      available: Math.round(available * paymentsFactor * 100) / 100,
    };
  }, [paymentsDateRange]);

  const filteredEarnings = useMemo(() => {
    return orderEarnings.filter((o) => {
      const matchesSearch = o.orderId.toLowerCase().includes(paymentsSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(paymentsSearch.toLowerCase());
      const matchesStatus = earningStatusFilter === 'All' || o.status === earningStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orderEarnings, paymentsSearch, earningStatusFilter]);

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
    <div className="min-h-screen bg-[#FAF8F5] font-sans">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="fixed bottom-6 right-6 z-[100] bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-orange-500/10 p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 flex items-center justify-center"><CheckCircle2 size={18} /></div>
            <p className="text-sm font-bold text-gray-900">{toast}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'dashboard' && (
          <>
            {/* Top Header */}
            <header className="w-full px-4 sm:px-8 lg:px-12 mt-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-white rounded-2xl border border-gray-200/70 shadow-sm px-4 py-2.5 flex items-center justify-between relative z-50"
        >
          {/* Left: Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search orders, menu items, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2 pl-10 text-xs w-80 text-gray-700 focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Right: Notification & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Notification Bell */}
            <button
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative inline-block" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown((prev) => !prev)}
                aria-label="User menu"
                className="flex items-center gap-2 bg-white border border-gray-200/70 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200">
                  {(name || 'U').charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline-block max-w-[100px] truncate text-xs font-semibold text-gray-800">{name}</span>
                <motion.span animate={{ rotate: showUserDropdown ? 180 : 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
                  <ChevronDown size={14} className="text-gray-500" />
                </motion.span>
              </button>

              {/* Floating Dropdown - directly under the pill button */}
              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-2"
                  >
                    <div className="px-3 py-2.5 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-500">user@example.com</p>
                    </div>

                    <div className="py-1.5">
                      <Link
                        href="/cart"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <ShoppingBag size={16} className="text-gray-500" />
                        My Cart
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <LayoutGrid size={16} className="text-gray-500" />
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Settings size={16} className="text-gray-500" />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 pt-1.5">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowUserDropdown(false); handleLogout(); }}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                  </motion.button>
                </div>
              </motion.div>
            )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        </header>

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
          </>
        )}

      {/* MERCHANT SUB-NAVIGATION PILL BAR */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-6">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-1.5 inline-flex gap-1.5"
        >
          {[
            { id: 'dashboard' as const, label: 'Merchant Dashboard', icon: LayoutDashboard },
            { id: 'create_menu' as const, label: 'Create Menu Item', icon: Sparkles },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: isActive ? 1 : 1.03, y: isActive ? 0 : -1 }}
                whileTap={{ scale: 0.97, y: 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center justify-center gap-2 font-semibold py-2.5 px-6 rounded-2xl transition-all text-sm ${
                  isActive
                    ? 'bg-[#c8481a] text-white shadow-lg shadow-[#b93815]/30 border border-white/30 border-b-0'
                    : 'text-gray-700 hover:text-[#b93815] hover:bg-gray-50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </motion.button>
            );
          })}
        </motion.nav>
      </div>

      {/* MAIN CONTENT (driven by activeTab) */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mt-8 pb-12">
        {activeTab === 'create_menu' ? (
          <CreateMenuItem />
        ) : (
          <>
            {/* INTERNAL NAV + MAIN CONTENT (existing tabs) */}
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
            {activeTab === 'dashboard' && (
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

                    <div className="relative h-48 sm:h-64 flex items-end justify-between gap-2 sm:gap-3 px-2 pt-6" style={{ perspective: '1000px' }}>
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

                {/* BEST-SELLING ITEMS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                      <Flame size={18} className="text-orange-500" />
                      Best-Selling Items
                    </h3>
                    <Link href="#analytics" onClick={() => setActiveTab('analytics')} className="text-xs font-bold text-[#b93815] hover:text-[#9a2c0f] hover:underline">
                      View All →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {popularItemsSeed.slice(0, 4).map((item, i) => (
                      <TiltCard
                        key={item.name}
                        className="group bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl shadow-gray-300/30 p-4 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/60 shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-extrabold text-gray-900 truncate group-hover:text-[#b93815] transition-colors">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.orders} orders</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-extrabold text-[#b93815]">${item.revenue.toLocaleString()}</p>
                            <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              i === 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
                            }`}>
                              #{i + 1}
                            </span>
                          </div>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
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

                {/* EARNINGS OVERVIEW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Tilt3DCard className="lg:col-span-2 rounded-3xl bg-white/85 backdrop-blur-md border border-white/70 shadow-2xl shadow-gray-300/40 p-6">
                    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />
                    <div className="relative flex items-center justify-between mb-4">
                      <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                        <DollarSign size={20} className="text-emerald-500" />
                        Earnings Overview
                      </h3>
                      <span className="text-xs text-gray-500">All-time totals from order earnings</span>
                    </div>
                    <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total Earnings</p>
                        <p className="text-2xl font-extrabold text-gray-900 mt-1">${dashboardEarnings.totalNet.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Net after commission</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Available</p>
                        <p className="text-2xl font-extrabold text-emerald-600 mt-1">${dashboardEarnings.available.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Ready to withdraw</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Pending</p>
                        <p className="text-2xl font-extrabold text-amber-600 mt-1">${dashboardEarnings.pending.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">In uncleared orders</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Commission</p>
                        <p className="text-2xl font-extrabold text-rose-600 mt-1">-${dashboardEarnings.totalCommission.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Platform fees</p>
                      </div>
                    </div>
                  </Tilt3DCard>

                  <Tilt3DCard className="rounded-3xl bg-white/85 backdrop-blur-md border border-white/70 shadow-2xl shadow-gray-300/40 p-6">
                    <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />
                    <h3 className="relative text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                      <Receipt size={18} className="text-purple-600" />
                      Gross vs Commission
                    </h3>
                    <div className="relative space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-gray-500">Gross Revenue</span>
                          <span className="text-sm font-extrabold text-gray-900">${dashboardEarnings.totalGross.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-gray-500">Commission Deducted</span>
                          <span className="text-sm font-extrabold text-rose-600">-${dashboardEarnings.totalCommission.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(dashboardEarnings.totalCommission / dashboardEarnings.totalGross * 100).toFixed(0)}%` }} transition={{ duration: 0.8, delay: 0.1 }} className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-gray-500">Net Received</span>
                          <span className="text-sm font-extrabold text-emerald-600">${dashboardEarnings.totalNet.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(dashboardEarnings.totalNet / dashboardEarnings.totalGross * 100).toFixed(0)}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full" />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-200/60 flex justify-between text-xs">
                        <span className="text-gray-500">Commission Rate</span>
                        <span className="font-bold text-gray-900">{(dashboardEarnings.totalCommission / dashboardEarnings.totalGross * 100).toFixed(1)}%</span>
                      </div>
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

            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Restaurant Profile</h2>
                    <p className="mt-1 text-base text-gray-500">Manage your restaurant&apos;s business information.</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97, y: 2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    onClick={() => showToast('Profile updated successfully')}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] hover:from-[#b93815] hover:to-[#7a1d09] text-white text-xs font-bold py-2.5 px-5 rounded-2xl shadow-lg shadow-[#b93815]/30 border border-white/20 transition-all"
                  >
                    <CheckCircle2 size={14} /> Save Changes
                  </motion.button>
                </div>

                <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-8">
                  <div className="space-y-6">
                    {/* Logo & Cover Image */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Branding</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Restaurant Logo</label>
                          <label className="mt-2 flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-[#F8FAFC] cursor-pointer hover:border-[#b93815]/60 transition-colors">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, setRestaurantLogo); }} />
                            {restaurantLogo ? <Image src={restaurantLogo} alt="Logo" width={64} height={64} className="object-cover rounded-xl" /> : <Camera size={24} className="text-gray-400" />}
                            <span className="text-[10px] font-bold text-gray-500">Upload Logo</span>
                          </label>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cover Image</label>
                          <label className="mt-2 flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-[#F8FAFC] cursor-pointer hover:border-[#b93815]/60 transition-colors">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, setRestaurantCover); }} />
                            {restaurantCover ? <Image src={restaurantCover} alt="Cover" width={120} height={64} className="object-cover rounded-xl w-full h-16" /> : <Camera size={24} className="text-gray-400" />}
                            <span className="text-[10px] font-bold text-gray-500">Upload Cover</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Basic Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Restaurant Name</label>
                          <input value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} type="text" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Restaurant Status</label>
                          <div className="mt-1 flex items-center gap-3">
                            <button
                              onClick={() => setRestaurantStatus(restaurantStatus === 'Open' ? 'Closed' : 'Open')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${restaurantStatus === 'Open' ? 'bg-emerald-500' : 'bg-gray-400'}`}
                            >
                              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${restaurantStatus === 'Open' ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <span className={`text-xs font-bold ${restaurantStatus === 'Open' ? 'text-emerald-700' : 'text-gray-500'}`}>{restaurantStatus}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                        <textarea
                          value={restaurantDescription}
                          onChange={(e) => setRestaurantDescription(e.target.value)}
                          rows={4}
                          className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 resize-none focus:outline-none focus:border-orange-400"
                          placeholder="Describe your restaurant..."
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Contact Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                          <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                          <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} type="tel" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
                        <input
                          value={restaurantAddress}
                          onChange={(e) => setRestaurantAddress(e.target.value)}
                          type="text"
                          className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400"
                        />
                      </div>
                    </div>

                    {/* Business Hours & Operating Days */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Business Hours</h3>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hours</label>
                        <input value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} type="text" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operating Days</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {operatingDaysSeed.map((day) => {
                            const isOn = openDays.includes(day);
                            return (
                              <motion.button
                                key={day} type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setOpenDays(isOn ? openDays.filter((d) => d !== day) : [...openDays, day])}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${isOn ? 'bg-orange-50 text-[#b93815] border-orange-200' : 'bg-white/70 text-gray-500 border-white/60 hover:bg-white'}`}
                              >
                                {isOn && <CheckCircle2 size={10} className="inline mr-1" />}
                                {day.slice(0, 3)}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            )}

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
                      className={`relative flex flex-col items-center justify-center gap-3 h-48 sm:h-72 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
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

            {activeTab === 'payments' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Payments & Earnings</h2>
                    <p className="mt-1 text-base text-gray-500">Track your earnings, payouts, and platform commission.</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        value={paymentsDateRange}
                        onChange={(e) => setPaymentsDateRange(e.target.value as typeof paymentsDateRange)}
                        className="appearance-none bg-white/90 backdrop-blur-md border border-white/70 text-sm font-semibold text-gray-700 rounded-2xl pl-10 pr-10 py-2.5 shadow-lg shadow-gray-300/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 hover:shadow-xl transition-shadow"
                      >
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>This Year</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.97, y: 2 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-semibold py-2.5 px-5 rounded-2xl shadow-xl shadow-emerald-500/40 border border-white/30 border-b-4 border-b-emerald-800 active:border-b-0 active:translate-y-1 active:shadow-md transition-all text-sm"
                      onClick={() => showToast('Withdrawal request submitted')}
                    >
                      <Download size={16} /> Request Withdrawal
                    </motion.button>
                  </div>
                </div>

                {/* Summary Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                  {[
                    { label: 'Total Earnings (Gross)', value: `$${paymentsMetrics.totalGross.toLocaleString()}`, delta: '+8.2%', icon: DollarSign, bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'shadow-emerald-500/30' },
                    { label: 'Available Earnings', value: `$${paymentsMetrics.available.toLocaleString()}`, delta: 'Ready to payout', icon: TrendingUp, bg: 'bg-blue-50', text: 'text-blue-600', ring: 'shadow-blue-500/30' },
                    { label: 'Pending Earnings', value: `$${paymentsMetrics.pending.toLocaleString()}`, delta: 'In uncleared orders', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600', ring: 'shadow-amber-500/30' },
                    { label: 'Total Commission', value: `$${paymentsMetrics.totalCommission.toLocaleString()}`, delta: 'Platform fees', icon: Receipt, bg: 'bg-purple-50', text: 'text-purple-600', ring: 'shadow-purple-500/30' },
                    { label: 'Net Amount Received', value: `$${paymentsMetrics.totalNet.toLocaleString()}`, delta: '+10.3%', icon: CheckCircle2, bg: 'bg-teal-50', text: 'text-teal-600', ring: 'shadow-teal-500/30' },
                  ].map((m) => (
                    <Tilt3DCard key={m.label} className={`group rounded-3xl bg-white/80 backdrop-blur-md border border-white/70 shadow-2xl ${m.ring} p-5`}>
                      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/40 via-transparent to-white/10 pointer-events-none" />
                      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-2xl pointer-events-none" />
                      <div className="relative flex items-center justify-between">
                        <div>
                          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{m.label}</p>
                          <p className="mt-2 text-2xl font-extrabold text-gray-900 leading-none drop-shadow-sm">{m.value}</p>
                          <span className={`mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${m.bg} ${m.text} shadow-inner`}>
                            {m.delta}
                          </span>
                        </div>
                        <motion.div whileHover={{ rotate: 8, scale: 1.08 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className={`h-14 w-14 rounded-2xl ${m.bg} ${m.text} flex items-center justify-center shadow-xl ${m.ring} border border-white/40`}>
                          <m.icon size={26} />
                        </motion.div>
                      </div>
                    </Tilt3DCard>
                  ))}
                </div>

                {/* Sub-Module Tabs */}
                <div className="flex gap-1.5 bg-gray-100/80 rounded-2xl p-1 border border-white/60 shadow-inner overflow-x-auto">
                  {[
                    { id: 'earnings', label: 'Earnings & Order Breakdown' },
                    { id: 'history', label: 'Payment History' },
                    { id: 'commission', label: 'Commission Summary' },
                  ].map((s) => (
                    <motion.button
                      key={s.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setPaymentsSubTab(s.id as typeof paymentsSubTab); setSelectedEarningOrder(null); }}
                      className={`relative shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${paymentsSubTab === s.id ? 'text-white' : 'text-gray-600'}`}
                    >
                      {paymentsSubTab === s.id && (
                        <motion.div layoutId="payments-sub-pill" className="absolute inset-0 bg-gradient-to-b from-[#b93815] to-[#9a3412] rounded-xl shadow-lg shadow-[#b93815]/40" transition={{ type: 'spring', stiffness: 380, damping: 28 }} />
                      )}
                      <span className="relative z-10">{s.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Sub-Module: Earnings & Order Breakdown */}
                {paymentsSubTab === 'earnings' && (
                  <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                    <div className="mb-4 flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                          value={paymentsSearch}
                          onChange={(e) => setPaymentsSearch(e.target.value)}
                          type="text"
                          placeholder="Search by Order ID or Customer Name..."
                          className="w-full bg-white/70 text-sm text-gray-800 placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 border border-white/60 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#b93815]/30"
                        />
                      </div>
                      <div className="relative">
                        <select
                          value={earningStatusFilter}
                          onChange={(e) => setEarningStatusFilter(e.target.value as EarningStatus | 'All')}
                          className="appearance-none bg-white/90 backdrop-blur-md border border-white/70 text-sm font-semibold text-gray-700 rounded-xl pl-3 pr-9 py-2 shadow focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Pending">Pending</option>
                          <option value="Available">Available</option>
                          <option value="Paid Out">Paid Out</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-200/60">
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Gross</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Commission</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Net</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEarnings.length === 0 ? (
                            <tr><td colSpan={8} className="py-8 text-center text-sm text-gray-500 italic">No earnings match your filters.</td></tr>
                          ) : (
                            filteredEarnings.map((oe) => (
                              <tr key={oe.orderId} className="border-b border-gray-100/60 hover:bg-gray-50/80 transition-colors">
                                <td className="px-4 py-3 font-extrabold text-gray-900">{oe.orderId}</td>
                                <td className="px-4 py-3 text-gray-600">{new Date(oe.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                <td className="px-4 py-3 text-gray-600 font-medium">{oe.customerName}</td>
                                <td className="px-4 py-3 text-right font-bold text-gray-900">${oe.grossAmount.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right">
                                  <span className="text-gray-600">{oe.commissionRate}%</span>
                                  <span className="block text-xs text-gray-400">= ${oe.commissionAmount.toFixed(2)}</span>
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-emerald-600">${oe.netEarning.toFixed(2)}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    oe.status === 'Paid Out' ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                    : oe.status === 'Available' ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}>
                                    {oe.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedEarningOrder(oe)}
                                    className="inline-flex items-center justify-center gap-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm"
                                  >
                                    <Eye size={12} /> View
                                  </motion.button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200/60 flex justify-between items-center text-sm text-gray-500">
                      <span>Showing {filteredEarnings.length} of {orderEarnings.length} orders</span>
                      <span>Net total: <span className="font-extrabold text-emerald-600">${filteredEarnings.reduce((s, o) => s + o.netEarning, 0).toFixed(2)}</span></span>
                    </div>
                  </TiltCard>
                )}

                {/* Order Detail Modal */}
                <AnimatePresence>
                  {selectedEarningOrder && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                      onClick={() => setSelectedEarningOrder(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-extrabold text-gray-900">Order {selectedEarningOrder.orderId}</h3>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedEarningOrder(null)} className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200">
                            <X size={16} />
                          </motion.button>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">Customer:</span><span className="font-semibold text-gray-900">{selectedEarningOrder.customerName}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-semibold text-gray-900">{new Date(selectedEarningOrder.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Gross Amount:</span><span className="font-semibold text-gray-900">${selectedEarningOrder.grossAmount.toFixed(2)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Commission Rate:</span><span className="font-semibold text-gray-900">{selectedEarningOrder.commissionRate}% (${selectedEarningOrder.commissionAmount.toFixed(2)})</span></div>
                          <div className="flex justify-between border-t border-gray-200 pt-2 mt-2"><span className="text-gray-500">Net Earning:</span><span className="font-extrabold text-emerald-600">${selectedEarningOrder.netEarning.toFixed(2)}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Status:</span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              selectedEarningOrder.status === 'Paid Out' ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : selectedEarningOrder.status === 'Available' ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {selectedEarningOrder.status}
                            </span>
                          </div>
                        </div>
                        {selectedEarningOrder.items && selectedEarningOrder.items.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Items</h4>
                            <div className="space-y-2">
                              {selectedEarningOrder.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{item.qty}× {item.name}</span>
                                  <span className="font-semibold text-gray-900">${(item.qty * item.price).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sub-Module: Payment History */}
                {paymentsSubTab === 'history' && (
                  <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-200/60">
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Payment Method</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((p) => (
                            <tr key={p.id} className="border-b border-gray-100/60 hover:bg-gray-50/80 transition-colors">
                              <td className="px-4 py-3 font-extrabold text-gray-900">{p.id}</td>
                              <td className="px-4 py-3 text-gray-600">{new Date(p.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                              <td className="px-4 py-3 text-right font-bold text-gray-900">${p.amount.toFixed(2)}</td>
                              <td className="px-4 py-3 text-gray-600 font-medium">{p.method}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : p.status === 'Processing' ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {p.receipt ? (
                                  <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href={`#receipt-${p.id}`}
                                    onClick={(e) => { e.preventDefault(); showToast(`Opening receipt ${p.receipt}`); }}
                                    className="inline-flex items-center justify-center gap-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm"
                                  >
                                    <Receipt size={12} /> View Receipt
                                  </motion.a>
                                ) : (
                                  <span className="text-gray-400 text-xs">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200/60 flex justify-between items-center text-sm text-gray-500">
                      <span>Total completed payouts: {paymentHistory.filter((p) => p.status === 'Completed').length}</span>
                      <span>Total amount paid out: <span className="font-extrabold text-emerald-600">${paymentHistory.filter((p) => p.status === 'Completed').reduce((s, p) => s + p.amount, 0).toFixed(2)}</span></span>
                    </div>
                  </TiltCard>
                )}

                {/* Sub-Module: Commission Summary */}
                {paymentsSubTab === 'commission' && (
                  <div className="space-y-6">
                    {/* Commission Breakdown Card */}
                    <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                      <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                        <Receipt size={20} className="text-purple-600" />
                        Commission Breakdown
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {[
                          { label: 'Gross Revenue', value: `$${paymentsMetrics.totalGross.toFixed(2)}`, icon: DollarSign, soft: 'bg-emerald-50', text: 'text-emerald-700' },
                          { label: 'Platform Commission', value: `$${paymentsMetrics.totalCommission.toFixed(2)}`, icon: Receipt, soft: 'bg-rose-50', text: 'text-rose-700' },
                          { label: 'Net Earnings', value: `$${paymentsMetrics.totalNet.toFixed(2)}`, icon: CheckCircle2, soft: 'bg-blue-50', text: 'text-blue-700' },
                        ].map((m) => (
                          <div key={m.label} className={`p-5 rounded-2xl ${m.soft} border border-white/60 shadow-inner flex items-center justify-between`}>
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{m.label}</p>
                              <p className="text-2xl font-extrabold text-gray-900 mt-1">{m.value}</p>
                            </div>
                            <div className={`h-12 w-12 rounded-2xl ${m.soft} ${m.text} flex items-center justify-center shadow-inner border border-white/60`}>
                              <m.icon size={22} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </TiltCard>

                    {/* Visual Doughnut-like Breakdown */}
                    <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                      <h3 className="text-lg font-extrabold text-gray-900 mb-4">Revenue Distribution</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-4">
                          {(() => {
                            const gross = paymentsMetrics.totalGross;
                            const commission = paymentsMetrics.totalCommission;
                            const net = paymentsMetrics.totalNet;
                            const commissionPct = gross > 0 ? (commission / gross) * 100 : 0;
                            const netPct = gross > 0 ? (net / gross) * 100 : 0;
                            return [
                              { label: 'Platform Commission', value: commission, pct: commissionPct, color: 'bg-rose-500' },
                              { label: 'Net Earnings', value: net, pct: netPct, color: 'bg-emerald-500' },
                            ].map((seg) => (
                              <div key={seg.label} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-semibold text-gray-700">{seg.label}</span>
                                  <span className="text-sm font-extrabold text-gray-900">${seg.value.toFixed(2)} ({seg.pct.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-gray-200/60 rounded-full h-4 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${seg.pct}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${seg.color} shadow-lg`}
                                  />
                                </div>
                              </div>
                            ));
                          })()}
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-extrabold text-gray-500 uppercase tracking-wider">Commission Rate Rules</h4>
                          <div className="space-y-3">
                            <div className="border border-gray-200/60 rounded-xl p-3 bg-gray-50/60">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">Food Delivery</span>
                                <span className="text-sm font-extrabold text-[#b93815]">12%</span>
                              </div>
                              <p className="text-[10px] text-gray-500">Standard commission for all food delivery orders.</p>
                            </div>
                            <div className="border border-gray-200/60 rounded-xl p-3 bg-gray-50/60">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">High-Ticket Orders</span>
                                <span className="text-sm font-extrabold text-[#b93815]">15%</span>
                              </div>
                              <p className="text-[10px] text-gray-500">Orders over $50 incur a slightly higher rate.</p>
                            </div>
                            <div className="border border-gray-200/60 rounded-xl p-3 bg-gray-50/60">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-500 uppercase">Premium Placement</span>
                                <span className="text-sm font-extrabold text-[#b93815]">10%</span>
                              </div>
                              <p className="text-[10px] text-gray-500">Featured menu spots receive a discounted rate.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TiltCard>

                    {/* Commission Table */}
                    <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                      <h3 className="text-lg font-extrabold text-gray-900 mb-4">Commission by Order</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-200/60">
                              <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Order ID</th>
                              <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Gross</th>
                              <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Rate</th>
                              <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Commission</th>
                              <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Net</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredEarnings.map((oe) => (
                              <tr key={oe.orderId} className="border-b border-gray-100/60">
                                <td className="px-4 py-3 font-extrabold text-gray-900">{oe.orderId}</td>
                                <td className="px-4 py-3 text-gray-600">${oe.grossAmount.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right text-gray-600">{oe.commissionRate}%</td>
                                <td className="px-4 py-3 text-right font-bold text-rose-600">-${oe.commissionAmount.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right font-bold text-emerald-600">${oe.netEarning.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TiltCard>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'delivery' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Delivery Management</h2>
                    <p className="mt-1 text-base text-gray-500">Monitor active deliveries, rider status, and delivery history.</p>
                  </div>
                </div>

                {/* Sub-Module Tabs */}
                <div className="flex gap-1.5 bg-gray-100/80 rounded-2xl p-1.5 border border-white/60 shadow-inner overflow-x-auto">
                  {[
                    { id: 'active', label: 'Active Deliveries' },
                    { id: 'riders', label: 'Rider Status' },
                    { id: 'history', label: 'Delivery History' },
                  ].map((s) => (
                    <motion.button
                      key={s.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setDeliverySubTab(s.id as typeof deliverySubTab); setSelectedDelivery(null); }}
                      className={`relative shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${deliverySubTab === s.id ? 'text-white' : 'text-gray-600'}`}
                    >
                      {deliverySubTab === s.id && (
                        <motion.div layoutId="delivery-sub-pill" className="absolute inset-0 bg-gradient-to-b from-[#b93815] to-[#9a3412] rounded-xl shadow-lg shadow-[#b93815]/40" transition={{ type: 'spring', stiffness: 380, damping: 28 }} />
                      )}
                      <span className="relative z-10">{s.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { label: 'In Transit', value: activeDeliveries.filter((d) => d.stage === 'In Transit').length.toString(), icon: Truck, soft: 'bg-blue-50', text: 'text-blue-600' },
                    { label: 'Arriving Soon', value: activeDeliveries.filter((d) => d.stage === 'Arriving Soon').length.toString(), icon: MapPin, soft: 'bg-emerald-50', text: 'text-emerald-600' },
                    { label: 'Delivered Today', value: deliveryHistory.length.toString(), icon: CheckCircle2, soft: 'bg-teal-50', text: 'text-teal-600' },
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

                {/* Sub-Module: Active Deliveries */}
                {deliverySubTab === 'active' && (
                  <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-200/60">
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Rider</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Stage</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Pickup</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Est. Delivery</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeDeliveries.length === 0 ? (
                            <tr><td colSpan={7} className="py-8 text-center text-sm text-gray-500 italic">No active deliveries at the moment.</td></tr>
                          ) : (
                            activeDeliveries.map((d) => (
                              <tr key={d.orderId} className="border-b border-gray-100/60 hover:bg-gray-50/80 transition-colors">
                                <td className="px-4 py-3 font-extrabold text-gray-900">{d.orderId}</td>
                                <td className="px-4 py-3 text-gray-600 font-medium">{d.customerName}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                                      {d.rider.avatarUrl ? (
                                        <Image src={d.rider.avatarUrl} alt={d.rider.name} width={32} height={32} className="object-cover rounded-full" />
                                      ) : (
                                         <span className="text-xs font-bold text-[#b93815]">{d.rider.name.charAt(0)}</span>
                                      )}
                                      </div>
                                      <span className="text-sm font-semibold text-gray-900">{d.rider.name}</span>
                                    <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold rounded-full ${riderStatusBadge(d.rider.status)}`}>
                                      {d.rider.status}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${deliveryStageBadge(d.stage)}`}>
                                    {d.stage}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{d.pickupTime}</td>
                                <td className="px-4 py-3 text-gray-600">{d.estimatedDelivery}</td>
                                <td className="px-4 py-3 text-center">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDelivery(d)}
                                    className="inline-flex items-center justify-center gap-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm"
                                  >
                                    <Eye size={12} /> View
                                  </motion.button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </TiltCard>
                )}

                {/* Sub-Module: Rider Status */}
                {deliverySubTab === 'riders' && (
                  <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {ridersSeed.map((r) => (
                        <div key={r.id} className="p-5 rounded-2xl bg-white border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                              {r.avatarUrl ? (
                                <Image src={r.avatarUrl} alt={r.name} fill className="object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-sm font-bold text-[#b93815]">
                                  {r.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-gray-900">{r.name}</h3>
                              <p className="text-xs text-gray-500">{r.vehicle}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Phone:</span><span className="font-semibold text-gray-900">{r.phone}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Rating:</span><span className="font-semibold text-gray-900">⭐ {r.rating}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">ETA:</span><span className="font-semibold text-gray-900">{r.eta}</span></div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Status:</span>
                              <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full ${riderStatusBadge(r.status)}`}>
                                {r.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TiltCard>
                )}

                {/* Sub-Module: Delivery History */}
                {deliverySubTab === 'history' && (
                  <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-200/60">
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Rider</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Stage</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Picked Up</th>
                            <th className="px-4 py-2.5 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Delivered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deliveryHistory.length === 0 ? (
                            <tr><td colSpan={6} className="py-8 text-center text-sm text-gray-500 italic">No delivery history available.</td></tr>
                          ) : (
                            deliveryHistory.map((d) => (
                              <tr key={d.orderId} className="border-b border-gray-100/60 hover:bg-gray-50/80 transition-colors">
                                <td className="px-4 py-3 font-extrabold text-gray-900">{d.orderId}</td>
                                <td className="px-4 py-3 text-gray-600 font-medium">{d.customerName}</td>
                                <td className="px-4 py-3 text-gray-600">{d.rider.name}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${deliveryStageBadge(d.stage)}`}>
                                    {d.stage}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{d.pickupTime}</td>
                                <td className="px-4 py-3 text-gray-600">{d.actualDelivery ?? '—'}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </TiltCard>
                )}

                {/* Delivery Detail Modal */}
                <AnimatePresence>
                  {selectedDelivery && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                      onClick={() => setSelectedDelivery(null)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-extrabold text-gray-900">Order {selectedDelivery.orderId}</h3>
                          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedDelivery(null)} className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200">
                            <X size={16} />
                          </motion.button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Customer Info */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Customer</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span className="text-gray-500">Name:</span><span className="font-semibold text-gray-900">{selectedDelivery.customerName}</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">Phone:</span><span className="font-semibold text-gray-900">{selectedDelivery.customerPhone}</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">Address:</span><span className="font-semibold text-gray-900 text-right">{selectedDelivery.customerAddress}</span></div>
                            </div>
                          </div>

                          {/* Rider Info */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Assigned Rider</h4>
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                {selectedDelivery.rider.avatarUrl ? (
                                  <Image src={selectedDelivery.rider.avatarUrl} alt={selectedDelivery.rider.name} fill className="object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-sm font-bold text-[#b93815]">
                                    {selectedDelivery.rider.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{selectedDelivery.rider.name}</p>
                                <p className="text-xs text-gray-500">{selectedDelivery.rider.vehicle} · ⭐ {selectedDelivery.rider.rating}</p>
                                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${riderStatusBadge(selectedDelivery.rider.status)}`}>
                                  {selectedDelivery.rider.status}
                                </span>
                              </div>
                            </div>
                            <div className="pt-2 space-y-1 text-sm">
                              <div className="flex justify-between"><span className="text-gray-500">Pickup Time:</span><span className="font-semibold text-gray-900">{selectedDelivery.pickupTime}</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">Est. Delivery:</span><span className="font-semibold text-gray-900">{selectedDelivery.estimatedDelivery}</span></div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="mt-4">
                          <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Order Items</h4>
                          <div className="space-y-2">
                            {selectedDelivery.orderItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.qty}× {item.name}</span>
                                <span className="font-semibold text-gray-900">${(item.qty * item.price).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Progress */}
                        <div className="mt-4">
                          <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Delivery Progress</h4>
                          <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase">
                            {(['Picked Up', 'In Transit', 'Arriving Soon', 'Delivered'] as const).map((stage, i) => {
                              const stages = ['Picked Up', 'In Transit', 'Arriving Soon', 'Delivered'];
                              const currentIndex = stages.indexOf(selectedDelivery.stage);
                              const stageIndex = stages.indexOf(stage);
                              const isPassed = stageIndex <= currentIndex;
                              const isCurrent = selectedDelivery.stage === stage;
                              return (
                                <div key={stage} className="flex items-center gap-1">
                                  <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] ${isPassed ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {i + 1}
                                  </div>
                                  <span className={isCurrent ? 'text-emerald-600' : isPassed ? 'text-gray-900' : 'text-gray-400'}>
                                    {stage}
                                  </span>
                                  {i < 3 && <div className={`h-0.5 w-8 ${isPassed ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Reviews & Ratings</h2>
                  <p className="mt-1 text-base text-gray-500">See what customers are saying about your restaurant.</p>
                </div>
                <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6">
                  <div className="space-y-4">
                    {[
                      { name: 'Priya S.', rating: 5, text: 'Truffle Smashburger is a masterpiece. The beef was perfectly seared and the smokehouse sauce is addicting.', time: '2 hours ago' },
                      { name: 'Marco L.', rating: 4, text: 'Great burgers and fast delivery. The sweet potato fries were a nice touch. Will order again!', time: '1 day ago' },
                      { name: 'Sofia R.', rating: 5, text: 'Amazing flavor and presentation. The staff was friendly too. Highly recommend.', time: '3 days ago' },
                    ].map((r) => (
                      <div key={r.name + r.time} className="flex gap-3">
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} size={14} fill="currentColor" />
                          ))}
                          {Array.from({ length: 5 - r.rating }).map((_, j) => (
                            <Star key={`e-${j}`} size={14} className="text-gray-300" />
                          ))}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                            <span className="text-xs text-gray-400">· {r.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5">{r.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            )}

            {activeTab === 'support' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Support Ticket</h2>
                  <p className="mt-1 text-base text-gray-500">Open a ticket and our support team will get back to you shortly.</p>
                </div>
                <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                      <input
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2 text-xs text-gray-700 focus:outline-none focus:border-orange-400"
                        placeholder="Brief summary of your issue"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Problem Category</label>
                      <select
                        value={supportCategory}
                        onChange={(e) => setSupportCategory(e.target.value as typeof supportCategory)}
                        className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2 text-xs text-gray-700 focus:outline-none focus:border-orange-400"
                      >
                        <option>Order Issue</option>
                        <option>Payment Issue</option>
                        <option>Menu Issue</option>
                        <option>Delivery Issue</option>
                        <option>Account Issue</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea
                      value={supportDescription}
                      onChange={(e) => setSupportDescription(e.target.value)}
                      rows={4}
                      className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2 text-xs text-gray-700 resize-none focus:outline-none focus:border-orange-400"
                      placeholder="How can we help you? Please provide as much detail as possible."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attachment (evidence)</label>
                    <label className="mt-2 flex flex-col items-center justify-center gap-2 h-24 rounded-2xl border-2 border-dashed border-gray-300 bg-[#F8FAFC] cursor-pointer hover:border-[#b93815]/60 transition-colors">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageUpload(f, setSupportAttachment);
                        }}
                      />
                      <Camera size={20} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-500">Click to upload or drag & drop (PNG, JPG, PDF up to 10MB)</span>
                    </label>
                    {supportAttachment && (
                      <div className="mt-2 flex items-center gap-2">
                        <Image src={supportAttachment} alt="Attachment preview" width={40} height={40} className="object-cover rounded-lg border border-gray-200" />
                        <button
                          type="button"
                          onClick={() => setSupportAttachment(null)}
                          className="text-[10px] text-rose-600 hover:text-rose-700 font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (!supportSubject.trim() || !supportDescription.trim()) {
                        showToast('Please enter a subject and description');
                        return;
                      }
                      showToast(`Ticket submitted (${supportCategory})`);
                      setSupportSubject('');
                      setSupportDescription('');
                      setSupportCategory('Order Issue');
                      setSupportAttachment(null);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] hover:from-[#b93815] hover:to-[#7a1d09] text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md border border-white/20 transition-all"
                  >
                    <Ticket size={14} />
                    Submit Ticket
                  </motion.button>
                  <p className="text-[10px] text-gray-400 mt-2">Ticket Status Flow: Open → In Progress → Waiting for Vendor → Resolved → Closed</p>
                </TiltCard>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Notifications</h2>
                    <p className="mt-1 text-base text-gray-500">Stay updated on all business and system activities.</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 bg-gray-100/80 rounded-2xl p-1.5 border border-white/60 shadow-inner">
                    {(['all', 'unread', 'read'] as const).map((f) => (
                      <motion.button
                        key={f}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNotificationsFilter(f)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                          notificationsFilter === f
                            ? 'bg-gradient-to-b from-[#c94118] to-[#9a2c0f] text-white border-transparent'
                            : 'bg-white text-gray-600 border-white/60 hover:bg-gray-50'
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === 'all' && ` (${notifications.length})`}
                        {f === 'unread' && ` (${notifications.filter((n) => n.unread).length})`}
                        {f === 'read' && ` (${notifications.filter((n) => !n.unread).length})`}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {notifications.filter((n) => n.unread).length} unread notification{notifications.filter((n) => n.unread).length !== 1 ? 's' : ''}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                      showToast('All notifications marked as read');
                    }}
                    className="text-xs font-bold text-[#b93815] hover:text-[#9a2c0f] bg-[#fff1ec] hover:bg-[#ffe5d9] px-3 py-1.5 rounded-xl border border-orange-200 transition-colors"
                  >
                    Mark All as Read
                  </motion.button>
                </div>

                <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 overflow-hidden">
                  <div className="divide-y divide-gray-100/60">
                    {notifications.filter((n) => {
                      if (notificationsFilter === 'unread') return n.unread;
                      if (notificationsFilter === 'read') return !n.unread;
                      return true;
                    }).map((n) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-4 p-4 hover:bg-gray-50/80 transition-colors cursor-pointer ${n.unread ? 'bg-orange-50/30' : ''}`}
                        onClick={() => {
                          if (n.unread) {
                            setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, unread: false } : x));
                          }
                        }}
                      >
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          n.type === 'New Order' ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : n.type === 'Order Status' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                          : n.type === 'Payment' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : n.type === 'Review' ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : n.type === 'Delivery' ? 'bg-violet-50 text-violet-600 border border-violet-200'
                          : n.type === 'Support' ? 'bg-purple-50 text-purple-600 border border-purple-200'
                          : 'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}>
                          <n.icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-bold ${n.unread ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                            {n.unread && <span className="w-2 h-2 rounded-full bg-orange-500 shadow-lg shadow-orange-200" />}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                          n.type === 'New Order' ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : n.type === 'Order Status' ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : n.type === 'Payment' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : n.type === 'Review' ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : n.type === 'Delivery' ? 'bg-violet-50 text-violet-700 border-violet-200'
                          : n.type === 'Support' ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-gray-50 text-gray-600 border-gray-300'
                        }`}>
                          {n.type}
                        </span>
                      </motion.div>
                    ))}
                    {notifications.filter((n) => {
                      if (notificationsFilter === 'unread') return n.unread;
                      if (notificationsFilter === 'read') return !n.unread;
                      return true;
                    }).length === 0 && (
                      <p className="text-center py-8 text-sm text-gray-500 italic">No {notificationsFilter} notifications.</p>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Settings</h2>
                    <p className="mt-1 text-base text-gray-500">Manage your account, business, notification, and security settings.</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97, y: 2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    onClick={() => showToast('Settings saved successfully')}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] hover:from-[#b93815] hover:to-[#7a1d09] text-white text-xs font-bold py-2.5 px-5 rounded-2xl shadow-lg shadow-[#b93815]/30 border border-white/20 transition-all"
                  >
                    <CheckCircle2 size={14} /> Save Changes
                  </motion.button>
                </div>

                {/* Settings Sub-Tab Navigation */}
                <div className="flex gap-1.5 bg-gray-100/80 rounded-2xl p-1.5 border border-white/60 shadow-inner overflow-x-auto">
                {(['account', 'business', 'notifications', 'security'] as const).map((key) => {
                    const labelMap = { account: 'Account Settings', business: 'Business Settings', notifications: 'Notification Settings', security: 'Security Settings' };
                    const iconMap = { account: User, business: Store, notifications: Bell, security: Lock };
                    const Icon = iconMap[key];
                    const label = labelMap[key];
                    return (
                      <motion.button
                        key={key}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSettingsSubTab(key)}
                        className={`relative shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          settingsSubTab === key
                            ? 'bg-gradient-to-b from-[#c94118] to-[#9a2c0f] text-white border-transparent shadow-md shadow-[#b93815]/30'
                            : 'bg-white text-gray-600 border-white/60 hover:bg-gray-50'
                        }`}
                      >
                        {settingsSubTab === key && (
                          <motion.div layoutId="settings-pill" className="absolute inset-0 bg-gradient-to-b from-[#c94118] to-[#9a2c0f] rounded-xl" transition={{ type: 'spring', stiffness: 380, damping: 28 }} />
                        )}
                        <Icon size={13} className="relative z-10" />
                        <span className="relative z-10">{label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Account Settings */}
                {settingsSubTab === 'account' && (
                  <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-8">
                    <h3 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2"><User size={18} className="text-orange-500" /> Account Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Owner Name</label>
                        <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} type="text" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                        <input value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} type="email" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                        <input value={accountPhone} onChange={(e) => setAccountPhone(e.target.value)} type="tel" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                      </div>
                    </div>
                  </TiltCard>
                )}

                {/* Business Settings */}
                {settingsSubTab === 'business' && (
                  <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-8">
                    <h3 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2"><Store size={18} className="text-orange-500" /> Business Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tax ID</label>
                        <input value={taxId} onChange={(e) => setTaxId(e.target.value)} type="text" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payout Method</label>
                        <input value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value)} type="text" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Currency</label>
                        <select className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400">
                          <option>USD - US Dollar</option>
                          <option>EUR - Euro</option>
                          <option>GBP - British Pound</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Commission Plan</label>
                        <select className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400">
                          <option>Standard (12%)</option>
                          <option>Premium (15%)</option>
                        </select>
                      </div>
                    </div>
                  </TiltCard>
                )}

                {/* Notification Settings */}
                {settingsSubTab === 'notifications' && (
                  <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-8">
                    <h3 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2"><Bell size={18} className="text-orange-500" /> Notification Settings</h3>
                    <div className="space-y-3">
                      {Object.entries(notificationFlags).map(([key, val]) => {
                        const labels: Record<string, string> = {
                          newOrder: 'New Order',
                          orderStatus: 'Order Status Update',
                          paymentEarnings: 'Payment / Earnings Update',
                          newReview: 'New Review',
                          deliveryUpdate: 'Delivery Update',
                          supportTicket: 'Support Ticket Update',
                          systemAnnouncement: 'System Announcement',
                        };
                        return (
                          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100/60 last:border-0">
                            <span className="text-sm font-medium text-gray-700">{labels[key]}</span>
                            <button
                              onClick={() => setNotificationFlags((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notificationFlags] }))}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                val ? 'bg-[#b93815]' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                val ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </TiltCard>
                )}

                {/* Security Settings */}
                {settingsSubTab === 'security' && (
                  <div className="space-y-6">
                    {/* Password Management */}
                    <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-8">
                      <h3 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2"><Eye size={18} className="text-orange-500" /> Password Management</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
                          <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                          <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password</label>
                          <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="mt-1 w-full bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-none focus:border-orange-400" />
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (!currentPassword || !newPassword) {
                            showToast('Please fill in all password fields');
                            return;
                          }
                          if (newPassword !== confirmPassword) {
                            showToast('Passwords do not match');
                            return;
                          }
                          showToast('Password changed successfully');
                          setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
                        }}
                        className="mt-4 inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-md border border-white/20 transition-all"
                      >
                        Update Password
                      </motion.button>
                    </TiltCard>

                    {/* Session / Account Security */}
                    <TiltCard className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-gray-300/40 p-6 sm:p-8">
                      <h3 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2"><Shield size={18} className="text-orange-500" /> Session / Account Security</h3>
                      <div className="space-y-3">
                        {[
                          { id: 'sess-1', device: 'MacBook Pro · Chrome', location: 'San Francisco, CA', current: true },
                          { id: 'sess-2', device: 'iPhone 15 · Safari', location: 'Foodiego City, CA', current: false },
                          { id: 'sess-3', device: 'Windows 11 · Firefox', location: 'Foodiego City, CA', current: false },
                        ].map((s) => (
                          <div key={s.id} className="flex items-center justify-between py-3 border-b border-gray-100/60 last:border-0">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{s.device}</p>
                              <p className="text-xs text-gray-500">{s.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {s.current && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Current</span>}
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => showToast(`Session ${s.current ? 'cannot be revoked (current)' : 'revoked'}`)}
                                disabled={s.current}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                                  s.current
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                                }`}
                              >
                              {s.current ? 'Active' : 'Revoke'}
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TiltCard>
                  </div>
                )}
              </motion.div>
            )}
          </main>
          </>
        )}
      </div>
    </div>
  );
}