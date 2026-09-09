'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Users,
  Flame,
  Phone,
  Clock,
  Activity,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type TableStatus = 'occupied' | 'free' | 'reserved';

interface Table {
  id: string;
  label: string;
  status: TableStatus;
  seats: number;
}

interface Driver {
  id: string;
  name: string;
  vehicle: string;
  phone: string;
  speed: number;
  eta: number;
  x: number;
  y: number;
  route: { x: number; y: number }[];
  progress: number;
}

const hourlyData = [
  { hour: '11AM', today: 12, avg: 8 },
  { hour: '12PM', today: 28, avg: 22 },
  { hour: '1PM', today: 35, avg: 30 },
  { hour: '2PM', today: 18, avg: 15 },
  { hour: '3PM', today: 10, avg: 12 },
  { hour: '4PM', today: 8, avg: 10 },
  { hour: '5PM', today: 15, avg: 18 },
  { hour: '6PM', today: 32, avg: 28 },
  { hour: '7PM', today: 40, avg: 35 },
  { hour: '8PM', today: 25, avg: 22 },
];

const tables: Table[] = [
  { id: 'T1', label: 'T1', status: 'occupied', seats: 4 },
  { id: 'T2', label: 'T2', status: 'occupied', seats: 2 },
  { id: 'T3', label: 'T3', status: 'free', seats: 4 },
  { id: 'T4', label: 'T4', status: 'reserved', seats: 6 },
  { id: 'T5', label: 'T5', status: 'occupied', seats: 2 },
  { id: 'T6', label: 'T6', status: 'free', seats: 4 },
  { id: 'T7', label: 'T7', status: 'occupied', seats: 8 },
  { id: 'T8', label: 'T8', status: 'free', seats: 2 },
  { id: 'T9', label: 'T9', status: 'reserved', seats: 4 },
  { id: 'T10', label: 'T10', status: 'occupied', seats: 4 },
  { id: 'T11', label: 'T11', status: 'free', seats: 6 },
  { id: 'T12', label: 'T12', status: 'occupied', seats: 2 },
];

const statusColors: Record<TableStatus, string> = {
  occupied: 'bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]',
  free: 'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]',
  reserved: 'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.4)]',
};

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Rahul',
    vehicle: 'Bike',
    phone: '+880 1711-111111',
    speed: 28,
    eta: 8,
    x: 20,
    y: 30,
    progress: 0.3,
    route: [
      { x: 20, y: 30 },
      { x: 40, y: 25 },
      { x: 60, y: 40 },
      { x: 80, y: 35 },
    ],
  },
  {
    id: '2',
    name: 'Amit',
    vehicle: 'Scooter',
    phone: '+880 1812-222222',
    speed: 22,
    eta: 12,
    x: 70,
    y: 60,
    progress: 0.6,
    route: [
      { x: 70, y: 60 },
      { x: 55, y: 50 },
      { x: 40, y: 45 },
      { x: 25, y: 40 },
    ],
  },
  {
    id: '3',
    name: 'Priya',
    vehicle: 'Bike',
    phone: '+880 1912-333333',
    speed: 35,
    eta: 5,
    x: 45,
    y: 75,
    progress: 0.8,
    route: [
      { x: 45, y: 75 },
      { x: 50, y: 60 },
      { x: 55, y: 45 },
      { x: 60, y: 30 },
    ],
  },
];

export default function RestaurantCommandCenter() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(mockDrivers[0]);
  const [liveOccupancy, setLiveOccupancy] = useState(48);
  const [queueCount, setQueueCount] = useState(7);
  const [activeOrders, setActiveOrders] = useState({ kitchen: 12, enRoute: 8 });

  const totalSeats = 65;
  const occupancyPercent = Math.min(100, Math.round((liveOccupancy / totalSeats) * 100));

  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers((prev) =>
        prev.map((driver) => {
          const newProgress = driver.progress + 0.005;
          if (newProgress >= 1) {
            const nextRoute = driver.route.map((p) => ({
              x: p.x + (Math.random() - 0.5) * 20,
              y: p.y + (Math.random() - 0.5) * 20,
            }));
            return {
              ...driver,
              progress: 0,
              route: nextRoute,
              x: nextRoute[0].x,
              y: nextRoute[0].y,
              eta: Math.max(3, driver.eta - 1),
            };
          }
          const routeIndex = Math.floor(newProgress * (driver.route.length - 1));
          const nextIndex = Math.min(routeIndex + 1, driver.route.length - 1);
          const segmentProgress = (newProgress * (driver.route.length - 1)) - routeIndex;
          const x = driver.route[routeIndex].x + (driver.route[nextIndex].x - driver.route[routeIndex].x) * segmentProgress;
          const y = driver.route[routeIndex].y + (driver.route[nextIndex].y - driver.route[routeIndex].y) * segmentProgress;
          return { ...driver, progress: newProgress, x, y };
        })
      );
      setLiveOccupancy((prev) => Math.max(20, Math.min(totalSeats, prev + Math.floor(Math.random() * 5) - 2)));
      setQueueCount((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      setActiveOrders((prev) => ({
        kitchen: Math.max(5, prev.kitchen + Math.floor(Math.random() * 5) - 2),
        enRoute: Math.max(3, prev.enRoute + Math.floor(Math.random() * 3) - 1),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">Live Occupancy</p>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">
              {liveOccupancy} <span className="text-base font-medium text-gray-500">/ {totalSeats} Seats</span>
            </p>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${occupancyPercent}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full rounded-full ${occupancyPercent > 80 ? 'bg-red-500' : occupancyPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              />
            </div>
            <p className="text-xs font-semibold text-gray-500 mt-2">{occupancyPercent}% occupied</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">Active Drivers</p>
              <Navigation className="text-emerald-600" size={20} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">
              {drivers.length} <span className="text-base font-medium text-gray-500">En-Route</span>
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-2">Avg Speed 28 km/h</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">Live Order Queue</p>
              <Activity className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">
              {activeOrders.kitchen + activeOrders.enRoute}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-semibold text-gray-500">
                Kitchen: <span className="text-gray-900">{activeOrders.kitchen}</span>
              </span>
              <span className="text-xs font-semibold text-gray-500">
                En-Route: <span className="text-gray-900">{activeOrders.enRoute}</span>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">AI System Health</p>
              <Zap className="text-violet-600" size={20} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">Active</p>
            <div className="flex items-center gap-1 mt-2">
              <div className="h-1.5 flex-1 bg-violet-100 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-violet-500 rounded-full" />
              </div>
              <span className="text-xs font-bold text-violet-600">80%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Menu Optimizer + Auto-Pricing</p>
          </motion.div>
        </div>

        {/* Main Split Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1 - Driver GPS Map */}
          <div className="lg:col-span-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" />
                  Live Driver Tracking
                </h3>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {drivers.length} Active
                </span>
              </div>
              <div className="relative h-72 bg-slate-50">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Roads */}
                  <line x1="0" y1="30" x2="100" y2="30" stroke="#e2e8f0" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="100" y2="60" stroke="#e2e8f0" strokeWidth="0.5" />
                  <line x1="30" y1="0" x2="30" y2="100" stroke="#e2e8f0" strokeWidth="0.5" />
                  <line x1="60" y1="0" x2="60" y2="100" stroke="#e2e8f0" strokeWidth="0.5" />
                  <line x1="0" y1="0" x2="100" y2="100" stroke="#e2e8f0" strokeWidth="0.3" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="#e2e8f0" strokeWidth="0.3" />

                  {/* Restaurant Origin */}
                  <circle cx="25" cy="40" r="3" fill="#00A36C" />
                  <text x="25" y="45" textAnchor="middle" className="text-[3px] fill-gray-600 font-bold">
                    Restaurant
                  </text>

                  {/* Driver Routes */}
                  {drivers.map((driver) => (
                    <polyline
                      key={`route-${driver.id}`}
                      points={driver.route.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke="#00A36C"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                      opacity="0.4"
                    />
                  ))}

                  {/* Driver Markers */}
                  {drivers.map((driver) => (
                    <g key={driver.id}>
                      <circle cx={driver.x} cy={driver.y} r="4" fill="#00A36C" className="animate-pulse" />
                      <circle cx={driver.x} cy={driver.y} r="7" fill="none" stroke="#00A36C" strokeWidth="0.5" opacity="0.4" />
                    </g>
                  ))}
                </svg>
              </div>

              {/* Driver Cards */}
              <div className="divide-y divide-gray-100">
                {drivers.map((driver) => (
                  <motion.div
                    key={driver.id}
                    whileHover={{ backgroundColor: 'rgba(0,163,108,0.04)' }}
                    onClick={() => setSelectedDriver(driver)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedDriver?.id === driver.id ? 'bg-emerald-50/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                          {driver.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Rider {driver.name}</p>
                          <p className="text-xs text-gray-500">{driver.vehicle} • {driver.speed} km/h</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">ETA {driver.eta} mins</p>
                        <a href={`tel:${driver.phone}`} className="text-xs text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                          <Phone size={12} /> Call
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Column 2 - Customer Foot Traffic & Occupancy */}
          <div className="lg:col-span-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  Floor Occupancy
                </h3>
                <span className="text-xs font-semibold text-gray-500">{tables.length} Tables</span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-4 gap-2">
                  {tables.map((table) => (
                    <motion.div
                      key={table.id}
                      whileHover={{ scale: 1.05 }}
                      className={`aspect-square rounded-xl border-2 flex items-center justify-center text-xs font-bold text-white transition-all cursor-default ${statusColors[table.status]}`}
                    >
                      {table.label}
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-red-500" />
                    <span className="text-xs font-semibold text-gray-600">Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-emerald-500" />
                    <span className="text-xs font-semibold text-gray-600">Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span className="text-xs font-semibold text-gray-600">Reserved</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Flame size={18} className="text-orange-500" />
                  Hourly Foot Traffic
                </h3>
                <span className="text-xs font-semibold text-gray-500">Today vs Average</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="today" fill="#00A36C" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="avg" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
            >
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
                <Clock size={18} className="text-amber-500" />
                Queue & Waitlist
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-extrabold text-gray-900">{queueCount}</p>
                  <p className="text-xs text-gray-500">Customers waiting</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">~{Math.max(5, queueCount * 3)} min</p>
                  <p className="text-xs text-gray-500">Est. wait time</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
