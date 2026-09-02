'use client';

import { useState } from 'react';
import { 
  ShoppingCart, 
  Wallet, 
  Store, 
  Users, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  UserCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  MoreVertical 
} from 'lucide-react';
import Link from 'next/link';

// ==========================================
// 1. Types & Interfaces
// ==========================================
interface Metric {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
}

interface SalesPoint {
  day: string;
  amount: number;
  active?: boolean;
}

interface Activity {
  id: string;
  type: 'vendor' | 'payment' | 'inventory' | 'system';
  title: string;
  timestamp: string;
}

interface Order {
  id: string;
  orderId: string;
  customer: string;
  vendor: string;
  amount: number;
  status: 'Completed' | 'Processing' | 'Cancelled';
  date: string;
}

interface DashboardData {
  metrics: Metric[];
  salesOverview: SalesPoint[];
  recentActivities: Activity[];
  recentOrders: Order[];
}

// ==========================================
// 2. Initial Mock Data (Replace with API Response)
// ==========================================
const initialData: DashboardData = {
  metrics: [
    { title: 'TOTAL ORDERS', value: '12,540', trend: 12, icon: <ShoppingCart size={20} /> },
    { title: 'TOTAL REVENUE', value: '৳845,200', trend: 8.4, icon: <Wallet size={20} /> },
    { title: 'TOTAL VENDORS', value: '248', trend: 0, icon: <Store size={20} /> },
    { title: 'TOTAL CUSTOMERS', value: '8,420', trend: 24, icon: <Users size={20} /> },
  ],
  salesOverview: [
    { day: 'Mon', amount: 3000 },
    { day: 'Tue', amount: 5000 },
    { day: 'Wed', amount: 9500, active: true },
    { day: 'Thu', amount: 4500 },
    { day: 'Fri', amount: 6000 },
    { day: 'Sat', amount: 9000 },
    { day: 'Sun', amount: 7500 },
  ],
  recentActivities: [
    { id: '1', type: 'vendor', title: 'New Vendor registration approved.', timestamp: '10 mins ago' },
    { id: '2', type: 'payment', title: 'Payment failed for Order #8920.', timestamp: '1 hour ago' },
    { id: '3', type: 'inventory', title: 'Inventory restock requested by Vendor A.', timestamp: '3 hours ago' },
    { id: '4', type: 'system', title: 'System update completed successfully.', timestamp: 'Yesterday, 14:00' },
  ],
  recentOrders: [
    { id: '1', orderId: '#ORD-0921', customer: 'Sarah Jenkins', vendor: 'Fresh Farms Co.', amount: 1250, status: 'Completed', date: 'Today, 10:42 AM' },
    { id: '2', orderId: '#ORD-0920', customer: 'Michael Chen', vendor: 'Daily Grocers', amount: 840, status: 'Processing', date: 'Today, 09:15 AM' },
    { id: '3', orderId: '#ORD-0919', customer: 'Emma Wilson', vendor: 'Organic Valley', amount: 3200, status: 'Cancelled', date: 'Yesterday, 16:30 PM' },
    { id: '4', orderId: '#ORD-0918', customer: 'David Lee', vendor: 'Fresh Farms Co.', amount: 450, status: 'Completed', date: 'Yesterday, 14:10 PM' },
  ]
};

// ==========================================
// 3. Main Single-Page Component
// ==========================================
export default function SinglePageDashboard() {
  // TODO: Ekhane apni TanStack React Query ba SWR use kore API connect korte parben.
  // const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboardAPI });
  
  const [data] = useState<DashboardData>(initialData);
  const [timeframe, setTimeframe] = useState('This Week');

  // Helper for Activity Icons
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'vendor': return <UserCheck className="text-emerald-600 bg-emerald-50 p-2 rounded-xl" size={36} />;
      case 'payment': return <AlertTriangle className="text-amber-600 bg-amber-50 p-2 rounded-xl" size={36} />;
      case 'inventory': return <FileText className="text-blue-600 bg-blue-50 p-2 rounded-xl" size={36} />;
      case 'system': return <CheckCircle2 className="text-emerald-600 bg-emerald-50 p-2 rounded-xl" size={36} />;
    }
  };

  // Helper for Order Status Badge
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'Processing': return 'bg-sky-50 text-sky-700 border border-sky-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border border-rose-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">Monitor key metrics and recent activities across the platform.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer">
            <Download size={16} />
            <span>Export Data</span>
          </button>
        </div>

        {/* ================= METRICS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.metrics.map((metric, index) => {
            const isPositive = metric.trend > 0;
            const isNeutral = metric.trend === 0;

            return (
              <div key={index} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700">
                    {metric.icon}
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    isNeutral ? 'bg-slate-100 text-slate-600' : isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {isNeutral ? <Minus size={14} /> : isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{isPositive ? `+${metric.trend}%` : `${metric.trend}%`}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{metric.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= SALES CHART & RECENT ACTIVITY ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sales Overview Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Sales Overview</h3>
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>

            {/* Bar Bars */}
            <div className="h-48 flex items-end justify-between gap-4 pt-6 px-2 border-b border-slate-100">
              {data.salesOverview.map((item, idx) => {
                const heightClasses = ['h-1/4', 'h-2/5', 'h-3/5', 'h-full', 'h-1/3', 'h-4/5', 'h-3/4'];
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div 
                      className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 ${
                        item.active 
                          ? 'bg-emerald-700 shadow-lg shadow-emerald-700/20' 
                          : 'bg-slate-100 group-hover:bg-slate-200'
                      } ${heightClasses[idx % heightClasses.length]}`}
                    />
                    <span className={`text-xs font-medium ${item.active ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
              <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {data.recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="shrink-0">{getActivityIcon(act.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 leading-snug">{act.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RECENT ORDERS TABLE ================= */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Vendor</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-emerald-700">{order.orderId}</td>
                    <td className="py-4 px-6 text-slate-900">{order.customer}</td>
                    <td className="py-4 px-6">{order.vendor}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900">৳{order.amount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-slate-400">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}