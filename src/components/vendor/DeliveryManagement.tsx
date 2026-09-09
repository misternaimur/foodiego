'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Marker, Source, Layer, NavigationControl, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Truck,
  User,
  Search,
  Zap,
  Battery,
} from 'lucide-react';

type DeliveryStatus = 'Assigning...' | 'Picked Up' | 'Delayed (Traffic)' | 'Delivered';
type FilterTab = 'Active Deliveries (12)' | 'Rider Status' | 'Delivery History';

interface Rider {
  id: string;
  name: string;
  initials: string;
  status: 'Available' | 'Assigned' | 'Offline';
  distance?: string;
  speed?: number;
  battery?: number;
  lat: number;
  lng: number;
  vehicle: string;
  phone: string;
  deliveriesToday: number;
  rating: number;
}

interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  rider: string;
  riderInitials: string;
  status: DeliveryStatus;
  eta: number;
  phone: string;
  lat: number;
  lng: number;
  route: { lat: number; lng: number }[];
  progress: number;
}

interface DeliveryHistoryItem {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  rider: string;
  riderInitials: string;
  status: 'Delivered' | 'Cancelled';
  completedAt: string;
  totalEarnings: number;
}

const RESTAURANT_POSITION: [number, number] = [23.7937, 90.4066];

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    orderId: '#842',
    customerName: 'Sarah Jenkins',
    address: '123 Main St, Apt 4B',
    rider: 'Rahul',
    riderInitials: 'R',
    status: 'Picked Up',
    eta: 8,
    phone: '+880 1711-111111',
    progress: 0.35,
    lat: 23.8037,
    lng: 90.4166,
    route: [
      { lat: 23.7937, lng: 90.4066 },
      { lat: 23.8037, lng: 90.4166 },
      { lat: 23.8137, lng: 90.4266 },
    ],
  },
  {
    id: '2',
    orderId: '#843',
    customerName: 'James Wilson',
    address: '456 Oak Avenue',
    rider: 'Amit',
    riderInitials: 'A',
    status: 'Assigning...',
    eta: 12,
    phone: '+880 1812-222222',
    progress: 0,
    lat: 23.7837,
    lng: 90.3966,
    route: [
      { lat: 23.7937, lng: 90.4066 },
      { lat: 23.7837, lng: 90.3966 },
      { lat: 23.7737, lng: 90.3866 },
    ],
  },
  {
    id: '3',
    orderId: '#839',
    customerName: 'Emily Chen',
    address: '789 Pine Street',
    rider: 'Priya',
    riderInitials: 'P',
    status: 'Delayed (Traffic)',
    eta: 5,
    phone: '+880 1912-333333',
    progress: 0.6,
    lat: 23.7737,
    lng: 90.3866,
    route: [
      { lat: 23.7937, lng: 90.4066 },
      { lat: 23.7837, lng: 90.3966 },
      { lat: 23.7737, lng: 90.3866 },
    ],
  },
];

const mockRiders: Rider[] = [
  { id: '1', name: 'Rahul', initials: 'R', status: 'Assigned', distance: 'Kemal Ataturk Ave', speed: 28, battery: 82, lat: 23.8037, lng: 90.4166, vehicle: 'Bike', phone: '+880 1711-111111', deliveriesToday: 8, rating: 4.8 },
  { id: '2', name: 'Amit', initials: 'A', status: 'Assigned', distance: 'Gulshan 2 Circle', speed: 22, battery: 65, lat: 23.7837, lng: 90.3966, vehicle: 'Scooter', phone: '+880 1812-222222', deliveriesToday: 12, rating: 4.9 },
  { id: '3', name: 'Priya', initials: 'P', status: 'Assigned', distance: 'Mohakhali', speed: 35, battery: 91, lat: 23.7737, lng: 90.3866, vehicle: 'Bike', phone: '+880 1912-333333', deliveriesToday: 0, rating: 4.7 },
];

const deliveryHistory: DeliveryHistoryItem[] = [
  {
    id: '1',
    orderId: '#830',
    customerName: 'John Doe',
    address: '12 Elm Street',
    rider: 'Mike K.',
    riderInitials: 'MK',
    status: 'Delivered',
    completedAt: 'Today, 12:30 PM',
    totalEarnings: 1850,
  },
  {
    id: '2',
    orderId: '#828',
    customerName: 'Alice Smith',
    address: '34 Maple Avenue',
    rider: 'Tom Smith',
    riderInitials: 'TS',
    status: 'Delivered',
    completedAt: 'Today, 11:15 AM',
    totalEarnings: 2200,
  },
  {
    id: '3',
    orderId: '#825',
    customerName: 'Bob Johnson',
    address: '56 Oak Lane',
    rider: 'Rachel J.',
    riderInitials: 'RJ',
    status: 'Cancelled',
    completedAt: 'Today, 10:00 AM',
    totalEarnings: 0,
  },
];

const statusColors: Record<DeliveryStatus, string> = {
  'Assigning...': 'bg-amber-50 text-amber-700 border-amber-200',
  'Picked Up': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Delayed (Traffic)': 'bg-red-50 text-red-700 border-red-200',
  'Delivered': 'bg-gray-50 text-gray-700 border-gray-200',
};

const riderMarkerStyle = `
  .rider-marker {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00A36C, #008f5a);
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .rider-marker:hover {
    transform: scale(1.15);
  }
  .rider-pulse {
    position: absolute;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(0,163,108,0.3);
    animation: riderPulse 2s infinite;
    pointer-events: none;
  }
  @keyframes riderPulse {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  .restaurant-marker {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00A36C, #00C48C);
    border: 4px solid white;
    box-shadow: 0 0 20px rgba(0,163,108,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    position: relative;
  }
  .restaurant-pulse {
    position: absolute;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0,163,108,0.4);
    animation: restaurantPulse 2s infinite;
    pointer-events: none;
  }
  @keyframes restaurantPulse {
    0% { transform: scale(1); opacity: 0.7; }
    100% { transform: scale(3); opacity: 0; }
  }
  .telemetry-badge {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    padding: 6px 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border: 1px solid rgba(0,0,0,0.05);
    white-space: nowrap;
  }
`;

function MapController({ selectedDelivery, mapRef }: { selectedDelivery: Delivery | null; mapRef: React.RefObject<MapRef | null> }) {
  useEffect(() => {
    if (selectedDelivery && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedDelivery.lng, selectedDelivery.lat],
        zoom: 15.5,
        duration: 2000,
      });
    }
  }, [selectedDelivery, mapRef]);

  return null;
}

export default function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [riders] = useState<Rider[]>(mockRiders);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>(mockDeliveries[0].id);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Active Deliveries (12)');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(mockDeliveries[0]);
  const mapRef = useRef<MapRef | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const centerMapOnDelivery = useCallback((delivery: Delivery) => {
    setSelectedDeliveryId(delivery.id);
    setSelectedDelivery(delivery);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveries((prev) =>
        prev.map((delivery) => {
          if (delivery.status === 'Assigning...' || delivery.status === 'Delivered') return delivery;
          const newProgress = Math.min(1, delivery.progress + 0.008);
          const routeIndex = Math.floor(newProgress * (delivery.route.length - 1));
          const nextIndex = Math.min(routeIndex + 1, delivery.route.length - 1);
          const segmentProgress = (newProgress * (delivery.route.length - 1)) - routeIndex;
          const lat = delivery.route[routeIndex].lat + (delivery.route[nextIndex].lat - delivery.route[routeIndex].lat) * segmentProgress;
          const lng = delivery.route[routeIndex].lng + (delivery.route[nextIndex].lng - delivery.route[routeIndex].lng) * segmentProgress;
          return {
            ...delivery,
            progress: newProgress,
            lat,
            lng,
            eta: Math.max(1, delivery.eta - 1),
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await fetch('/api/v1/vendor/deliveries/live');
        if (res.ok) {
          const data = await res.json();
          if (data.deliveries) setDeliveries(data.deliveries);
        }
      } catch {
        console.warn('Live data fetch failed, using mock data');
      }
    };
    fetchLiveData();
  }, []);

  useEffect(() => {
    let ws: WebSocket | null = null;
    const connectWs = () => {
      try {
        ws = new WebSocket('wss://api.foodiego.dev/ws/vendor/deliveries');
        ws.onopen = () => setWsConnected(true);
        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'RIDER_LOCATION_UPDATE') {
              setDeliveries((prev) =>
                prev.map((d) => {
                  if (d.id === msg.deliveryId) {
                    return { ...d, lat: msg.lat, lng: msg.lng, progress: msg.progress ?? d.progress };
                  }
                  return d;
                })
              );
            }
          } catch {}
        };
        ws.onclose = () => setWsConnected(false);
      } catch {
        setWsConnected(false);
      }
    };
    connectWs();
    return () => ws?.close();
  }, []);

  const filteredDeliveries = activeFilter === 'Active Deliveries (12)'
    ? deliveries.filter((d) => {
        const matchesSearch =
          searchQuery.trim().length === 0 ||
          d.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
    : [];

  const filteredRiders = activeFilter === 'Rider Status'
    ? riders.filter((r) => {
        const matchesSearch =
          searchQuery.trim().length === 0 ||
          r.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
    : [];

  const filteredHistory = activeFilter === 'Delivery History'
    ? deliveryHistory.filter((h) => {
        const matchesSearch =
          searchQuery.trim().length === 0 ||
          h.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{riderMarkerStyle}</style>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Delivery Management</h1>
            <p className="mt-1 text-gray-500">Track active dispatches, assign riders, and monitor delivery performance.</p>
          </div>
          <div className="flex items-center gap-3">
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
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-1.5 flex flex-wrap gap-1">
          {(['Active Deliveries (12)', 'Rider Status', 'Delivery History'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeFilter === tab
                  ? 'bg-[#00A36C] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {activeFilter === 'Active Deliveries (12)' && (
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">Active Dispatches</h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {deliveries.length} En Route
                  </span>
                </div>

                <div className="p-4 border-b border-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search orders or customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] transition-all"
                    />
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredDeliveries.map((delivery) => {
                      const isSelected = selectedDeliveryId === delivery.id;
                      return (
                        <motion.div
                          key={delivery.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          onClick={() => centerMapOnDelivery(delivery)}
                          className={`p-5 cursor-pointer transition-all hover:bg-gray-50 ${
                            isSelected ? 'bg-emerald-50/50 ring-1 ring-inset ring-emerald-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{delivery.orderId}</span>
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColors[delivery.status]}`}>
                                {delivery.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                              <Clock size={12} />
                              {delivery.eta > 0 ? `${delivery.eta} min` : '--'}
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <User size={14} className="text-gray-400" />
                              {delivery.customerName}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin size={14} className="text-gray-400" />
                              {delivery.address}
                            </div>
                            {delivery.rider && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Truck size={14} className="text-gray-400" />
                                {delivery.rider}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {delivery.status === 'Assigning...' ? (
                              <button className="flex-1 py-2.5 rounded-xl bg-[#00A36C] hover:bg-[#008f5a] text-white text-xs font-bold transition-colors">
                                Assign Rider
                              </button>
                            ) : (
                              <a
                                href={`tel:${delivery.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Phone size={14} />
                                Call Driver
                              </a>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Viewing details for ${delivery.orderId}`);
                              }}
                              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {activeFilter === 'Rider Status' && (
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">Rider Status</h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {riders.length} Riders
                  </span>
                </div>

                <div className="p-4 border-b border-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search riders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] transition-all"
                    />
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredRiders.map((rider) => (
                      <motion.div
                        key={rider.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm">
                              {rider.initials}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{rider.name}</p>
                              <p className="text-xs text-gray-500">{rider.vehicle} • {rider.phone}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            rider.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            rider.status === 'Assigned' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {rider.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center p-2 rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-500 mb-1">Deliveries</p>
                            <p className="text-sm font-bold text-gray-900">{rider.deliveriesToday}</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-500 mb-1">Rating</p>
                            <p className="text-sm font-bold text-gray-900">⭐ {rider.rating}</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-gray-50">
                            <p className="text-xs text-gray-500 mb-1">Speed</p>
                            <p className="text-sm font-bold text-gray-900">{rider.speed ? `${rider.speed} km/h` : '--'}</p>
                          </div>
                        </div>

                        {rider.distance && (
                          <p className="text-xs text-gray-500 mb-3">📍 {rider.distance}</p>
                        )}

                        <div className="flex items-center gap-2">
                          {rider.status === 'Available' ? (
                            <button className="flex-1 py-2.5 rounded-xl bg-[#00A36C] hover:bg-[#008f5a] text-white text-xs font-bold transition-colors">
                              Dispatch
                            </button>
                          ) : (
                            <button className="flex-1 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold transition-colors">
                              View Details
                            </button>
                          )}
                          <a
                            href={`tel:${rider.phone}`}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Phone size={14} />
                            Call
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {activeFilter === 'Delivery History' && (
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">Delivery History</h3>
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                    {deliveryHistory.length} Records
                  </span>
                </div>

                <div className="p-4 border-b border-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by order ID or customer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] transition-all"
                    />
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredHistory.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="p-5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{item.orderId}</span>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              item.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{item.completedAt}</span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <User size={14} className="text-gray-400" />
                            {item.customerName}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={14} className="text-gray-400" />
                            {item.address}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Truck size={14} className="text-gray-400" />
                            {item.rider}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">Earnings</span>
                          <span className={`text-sm font-bold ${item.totalEarnings > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {item.totalEarnings > 0 ? `৳${item.totalEarnings.toLocaleString()}` : '--'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {activeFilter === 'Active Deliveries (12)' && (
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Navigation size={18} className="text-emerald-600" />
                    Live GPS Tracking
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">Live</span>
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {wsConnected ? 'WS' : 'HTTP'}
                    </span>
                  </div>
                </div>

                <div className="relative h-96">
                  <Map
                    ref={mapRef}
                    initialViewState={{
                      longitude: RESTAURANT_POSITION[1],
                      latitude: RESTAURANT_POSITION[0],
                      zoom: 15.5,
                      pitch: 60,
                      bearing: 0,
                    }}
                    mapStyle="https://tiles.openfreemap.org/styles/liberty"
                    style={{ height: '100%', width: '100%' }}
                  >
                    <NavigationControl position="top-right" />
                    <MapController selectedDelivery={selectedDelivery} mapRef={mapRef} />

                    {/* Restaurant Origin Marker */}
                    <Marker longitude={RESTAURANT_POSITION[1]} latitude={RESTAURANT_POSITION[0]} anchor="center">
                      <div className="relative flex items-center justify-center">
                        <div className="restaurant-pulse" />
                        <div className="restaurant-marker">F</div>
                      </div>
                    </Marker>

                    {/* Rider Markers & Routes */}
                    {deliveries.map((delivery) => {
                      const rider = riders.find((r) => r.name === delivery.rider);
                      if (!rider || delivery.status === 'Assigning...') return null;
                      return (
                        <React.Fragment key={delivery.id}>
                          <Source
                            id={`route-${delivery.id}`}
                            type="geojson"
                            data={{
                              type: 'Feature',
                              properties: {},
                              geometry: {
                                type: 'LineString',
                                coordinates: [RESTAURANT_POSITION, [delivery.lng, delivery.lat]],
                              },
                            }}
                          >
                            <Layer
                              id={`route-line-${delivery.id}`}
                              type="line"
                              paint={{
                                'line-color': '#00A36C',
                                'line-width': 3,
                                'line-opacity': 0.7,
                                'line-dasharray': [2, 2],
                              }}
                            />
                            <Layer
                              id={`route-glow-${delivery.id}`}
                              type="line"
                              paint={{
                                'line-color': '#00A36C',
                                'line-width': 8,
                                'line-opacity': 0.15,
                                'line-blur': 4,
                              }}
                            />
                          </Source>

                          <Marker
                            longitude={delivery.lng}
                            latitude={delivery.lat}
                            anchor="center"
                            onClick={() => centerMapOnDelivery(delivery)}
                          >
                            <div className="relative flex items-center justify-center">
                              <div className="rider-pulse" />
                              <div className="rider-marker">{delivery.riderInitials}</div>
                            </div>
                            {selectedDeliveryId === delivery.id && rider && (
                              <div className="telemetry-badge absolute top-14 left-1/2 -translate-x-1/2 z-10">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-700">
                                  <span className="flex items-center gap-1 text-emerald-600">
                                    <Zap size={10} /> {rider.speed} km/h
                                  </span>
                                  <span className="flex items-center gap-1 text-blue-600">
                                    <Battery size={10} /> {rider.battery}%
                                  </span>
                                  <a href={`tel:${rider.phone}`} className="text-emerald-600 hover:text-emerald-700">
                                    <Phone size={10} />
                                  </a>
                                </div>
                                <div className="text-[10px] text-gray-500 mt-0.5">
                                  ETA {delivery.eta} mins
                                </div>
                              </div>
                            )}
                          </Marker>
                        </React.Fragment>
                      );
                    })}
                  </Map>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    Nearby Riders
                  </h3>
                  <button className="text-xs font-semibold text-[#00A36C] hover:text-[#008f5a] transition-colors">
                    Refresh
                  </button>
                </div>

                <div className="space-y-3">
                  {riders.map((rider) => (
                    <div
                      key={rider.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm">
                          {rider.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{rider.name}</p>
                          <p className="text-xs text-gray-500">
                            {rider.status === 'Available' && rider.distance ? rider.distance : rider.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {rider.status === 'Available' ? (
                          <button className="px-3 py-1.5 rounded-lg bg-[#00A36C] hover:bg-[#008f5a] text-white text-xs font-bold transition-colors">
                            Dispatch
                          </button>
                        ) : (
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                              rider.status === 'Assigned'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {rider.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
