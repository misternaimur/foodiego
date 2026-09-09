'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  Users,
  Flame,
  Phone,
  Clock,
  Activity,
  Zap,
  X,
  UserPlus,
  QrCode,
  Timer,
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
  timer?: string;
  reservedFor?: string;
}

interface Driver {
  id: string;
  name: string;
  vehicle: string;
  phone: string;
  speed: number;
  eta: number;
  lat: number;
  lng: number;
  route: { lat: number; lng: number }[];
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
  { id: 'T1', label: 'T1', status: 'occupied', seats: 4, timer: '45m' },
  { id: 'T2', label: 'T2', status: 'occupied', seats: 2, timer: '30m' },
  { id: 'T3', label: 'T3', status: 'free', seats: 4 },
  { id: 'T4', label: 'T4', status: 'reserved', seats: 6, reservedFor: '7:30 PM' },
  { id: 'T5', label: 'T5', status: 'occupied', seats: 2, timer: '15m' },
  { id: 'T6', label: 'T6', status: 'free', seats: 4 },
  { id: 'T7', label: 'T7', status: 'occupied', seats: 8, timer: '1h' },
  { id: 'T8', label: 'T8', status: 'free', seats: 2 },
  { id: 'T9', label: 'T9', status: 'reserved', seats: 4, reservedFor: '8:00 PM' },
  { id: 'T10', label: 'T10', status: 'occupied', seats: 4, timer: '20m' },
  { id: 'T11', label: 'T11', status: 'free', seats: 6 },
  { id: 'T12', label: 'T12', status: 'occupied', seats: 2, timer: '55m' },
];

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Rahul',
    vehicle: 'Bike',
    phone: '+880 1711-111111',
    speed: 28,
    eta: 8,
    lat: 23.7937,
    lng: 90.4166,
    progress: 0.3,
    route: [
      { lat: 23.7937, lng: 90.4166 },
      { lat: 23.8037, lng: 90.4066 },
      { lat: 23.8137, lng: 90.3966 },
      { lat: 23.8237, lng: 90.3866 },
    ],
  },
  {
    id: '2',
    name: 'Amit',
    vehicle: 'Scooter',
    phone: '+880 1812-222222',
    speed: 22,
    eta: 12,
    lat: 23.7837,
    lng: 90.3966,
    progress: 0.6,
    route: [
      { lat: 23.7837, lng: 90.3966 },
      { lat: 23.7937, lng: 90.4066 },
      { lat: 23.8037, lng: 90.4166 },
      { lat: 23.8137, lng: 90.4266 },
    ],
  },
  {
    id: '3',
    name: 'Priya',
    vehicle: 'Bike',
    phone: '+880 1912-333333',
    speed: 35,
    eta: 5,
    lat: 23.7737,
    lng: 90.3866,
    progress: 0.8,
    route: [
      { lat: 23.7737, lng: 90.3866 },
      { lat: 23.7837, lng: 90.3966 },
      { lat: 23.7937, lng: 90.4066 },
      { lat: 23.8037, lng: 90.4166 },
    ],
  },
];

const restaurantPosition: [number, number] = [23.7937, 90.4066];

const statusConfig: Record<TableStatus, { color: string; bg: string; border: string; shadow: string; label: string }> = {
  occupied: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    shadow: 'shadow-[0_0_15px_rgba(255,59,48,0.25)]',
    label: 'Occupied',
  },
  free: {
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    shadow: 'shadow-[0_0_15px_rgba(0,163,108,0.25)]',
    label: 'Free',
  },
  reserved: {
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    shadow: 'shadow-[0_0_15px_rgba(0,122,255,0.25)]',
    label: 'Reserved',
  },
};

const CustomRestaurantIcon = () => {
  return new L.DivIcon({
    className: 'custom-restaurant-marker',
    html: `<div style="position:relative;width:40px;height:40px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,163,108,0.15);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
      <div style="position:absolute;inset:8px;border-radius:50%;background:#00A36C;box-shadow:0 0 10px rgba(0,163,108,0.6);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;">F</div>
    </div>
    <style>
      @keyframes ping { 75%,100% { transform: scale(2.5); opacity: 0; } }
    </style>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const CustomRiderIcon = (name: string) => {
  return new L.DivIcon({
    className: 'custom-rider-marker',
    html: `<div style="position:relative;width:36px;height:36px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,163,108,0.1);border:2px solid #00A36C;display:flex;align-items:center;justify-content:center;color:#00A36C;font-weight:bold;font-size:11px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">${name[0]}</div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

function MapController() {
  const map = useMap();
  useEffect(() => {
    map.setView([23.7937, 90.4066], 14);
  }, [map]);
  return null;
}

export default function RestaurantCommandCenter() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(mockDrivers[0]);
  const [liveOccupancy, setLiveOccupancy] = useState(48);
  const [queueCount, setQueueCount] = useState(7);
  const [activeOrders, setActiveOrders] = useState({ kitchen: 12, enRoute: 8 });
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const totalSeats = 65;
  const occupancyPercent = Math.min(100, Math.round((liveOccupancy / totalSeats) * 100));

  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const freeCount = tables.filter((t) => t.status === 'free').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;

  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers((prev) =>
        prev.map((driver) => {
          const newProgress = driver.progress + 0.005;
          if (newProgress >= 1) {
            const nextRoute = driver.route.map((p) => ({
              lat: p.lat + (Math.random() - 0.5) * 0.01,
              lng: p.lng + (Math.random() - 0.5) * 0.01,
            }));
            return {
              ...driver,
              progress: 0,
              route: nextRoute,
              lat: nextRoute[0].lat,
              lng: nextRoute[0].lng,
              eta: Math.max(3, driver.eta - 1),
            };
          }
          const routeIndex = Math.floor(newProgress * (driver.route.length - 1));
          const nextIndex = Math.min(routeIndex + 1, driver.route.length - 1);
          const segmentProgress = (newProgress * (driver.route.length - 1)) - routeIndex;
          const lat = driver.route[routeIndex].lat + (driver.route[nextIndex].lat - driver.route[routeIndex].lat) * segmentProgress;
          const lng = driver.route[routeIndex].lng + (driver.route[nextIndex].lng - driver.route[routeIndex].lng) * segmentProgress;
          return { ...driver, progress: newProgress, lat, lng };
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

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setIsTableModalOpen(true);
  };

  const closeTableModal = () => {
    setIsTableModalOpen(false);
    setSelectedTable(null);
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1 - Live Driver Tracking with Bangladesh Map */}
          <div className="lg:col-span-7 space-y-4">
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
              <div className="h-80 w-full">
                <MapContainer center={restaurantPosition} zoom={14} className="h-full w-full" zoomControl={false}>
                  <MapController />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={restaurantPosition} icon={CustomRestaurantIcon()}>
                    <Popup>
                      <div className="text-xs font-bold text-gray-900">FoodieGo Restaurant</div>
                      <div className="text-[10px] text-gray-500">Banani Road 11, Dhaka</div>
                    </Popup>
                  </Marker>
                  {drivers.map((driver) => (
                    <Marker
                      key={driver.id}
                      position={[driver.lat, driver.lng]}
                      icon={CustomRiderIcon(driver.name)}
                    >
                      <Popup>
                        <div className="text-xs font-bold text-gray-900">Rider {driver.name}</div>
                        <div className="text-[10px] text-gray-500">{driver.vehicle} • {driver.speed} km/h</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">ETA {driver.eta} mins</div>
                      </Popup>
                    </Marker>
                  ))}
                  {drivers.map((driver) => (
                    <Polyline
                      key={`route-${driver.id}`}
                      positions={driver.route.map((p) => [p.lat, p.lng])}
                      pathOptions={{
                        color: '#00A36C',
                        weight: 3,
                        opacity: 0.6,
                        dashArray: '6, 8',
                        lineCap: 'round',
                      }}
                    />
                  ))}
                  {drivers.map((driver) => (
                    <Polyline
                      key={`route-glow-${driver.id}`}
                      positions={driver.route.map((p) => [p.lat, p.lng])}
                      pathOptions={{
                        color: '#00A36C',
                        weight: 8,
                        opacity: 0.15,
                        lineCap: 'round',
                      }}
                    />
                  ))}
                </MapContainer>
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

          {/* Column 2 - 3D Floor Occupancy Visualizer */}
          <div className="lg:col-span-5 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    Floor Occupancy & Table Status
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {tables.length} Tables • {occupiedCount} Occupied • {freeCount} Free • {reservedCount} Reserved
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Live
                </span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-4 gap-3">
                  {tables.map((table, idx) => {
                    const config = statusConfig[table.status];
                    return (
                      <motion.div
                        key={table.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        whileHover={{ rotateX: 5, rotateY: 5, scale: 1.05, z: 10 }}
                        onClick={() => handleTableClick(table)}
                        className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 ${config.border} ${config.bg} ${config.shadow} backdrop-blur-sm`}
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                      >
                        <span className="text-sm font-extrabold text-gray-900">{table.label}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{config.label}</span>
                        {table.status === 'occupied' && table.timer && (
                          <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md">
                            <Timer size={8} /> {table.timer}
                          </span>
                        )}
                        {table.status === 'reserved' && table.reservedFor && (
                          <span className="absolute top-2 right-2 text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-md">
                            {table.reservedFor}
                          </span>
                        )}
                        {table.status === 'free' && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                            Ready
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-red-500 shadow-[0_0_8px_rgba(255,59,48,0.4)]" />
                    <span className="text-xs font-semibold text-gray-600">Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-emerald-500 shadow-[0_0_8px_rgba(0,163,108,0.4)]" />
                    <span className="text-xs font-semibold text-gray-600">Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500 shadow-[0_0_8px_rgba(0,122,255,0.4)]" />
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

      {/* Table Management Modal */}
      <AnimatePresence>
        {isTableModalOpen && selectedTable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeTableModal} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Manage Table {selectedTable.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedTable.seats} Seats • {statusConfig[selectedTable.status].label}
                  </p>
                </div>
                <button onClick={closeTableModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {selectedTable.status === 'occupied' && selectedTable.timer && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                    <Timer size={20} className="text-red-600" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Currently Occupied</p>
                      <p className="text-xs text-red-600">Active for {selectedTable.timer}</p>
                    </div>
                  </div>
                )}
                {selectedTable.status === 'reserved' && selectedTable.reservedFor && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <Clock size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-bold text-blue-700">Reservation</p>
                      <p className="text-xs text-blue-600">Reserved for {selectedTable.reservedFor}</p>
                    </div>
                  </div>
                )}
                {selectedTable.status === 'free' && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <Users size={20} className="text-emerald-600" />
                    <div>
                      <p className="text-sm font-bold text-emerald-700">Available</p>
                      <p className="text-xs text-emerald-600">Ready for walk-ins</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-bold text-gray-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all">
                    <UserPlus size={16} />
                    Assign Walk-in
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-bold text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all">
                    <QrCode size={16} />
                    Scan QR
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
