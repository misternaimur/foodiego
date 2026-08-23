"use client";

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Zone = {
  name: string;
  demand: string;
  surge: string;
  color: string;
  lat: number;
  lng: number;
};

const zones: Zone[] = [
  { name: 'Downtown', demand: 'High', surge: '+$3.00', color: '#EF4444', lat: 23.8103, lng: 90.4125 },
  { name: 'Uptown', demand: 'Very Busy', surge: '+$3.00', color: '#EF4444', lat: 23.815, lng: 90.418 },
  { name: 'University Campus', demand: 'Busy', surge: '+$1.50', color: '#EAB308', lat: 23.805, lng: 90.408 },
  { name: 'Suburbs', demand: 'Low', surge: '+$0.00', color: '#22C55E', lat: 23.82, lng: 90.42 },
];

const pickup = { lat: 23.811, lng: 90.413, label: 'P' };
const dropoff = { lat: 23.8095, lng: 90.411, label: 'D' };
const rider = { lat: 23.8103, lng: 90.4125, label: 'You' };

type Props = { className?: string };

export default function RealMap({ className }: Props) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  return (
    <div className={className ?? 'h-64 lg:h-96'}>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Live Rider Map</h2>
            <p className="text-xs text-gray-500">View active deliveries and demand hotspots</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-lg text-xs">📍</button>
            <button className="p-2 border border-slate-200 rounded-lg text-xs">☰</button>
          </div>
        </div>
        <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 min-h-0">
          <MapContainer center={[rider.lat, rider.lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CircleMarker center={[rider.lat, rider.lng]} radius={10} pathOptions={{ color: '#16A34A', fillColor: '#16A34A', fillOpacity: 1 }}>
              <Popup>You</Popup>
            </CircleMarker>
            <CircleMarker center={[pickup.lat, pickup.lng]} radius={10} pathOptions={{ color: '#FF5C28', fillColor: '#FF5C28', fillOpacity: 1 }}>
              <Popup>Pickup - {pickup.label}</Popup>
            </CircleMarker>
            <CircleMarker center={[dropoff.lat, dropoff.lng]} radius={10} pathOptions={{ color: '#B33C00', fillColor: '#B33C00', fillOpacity: 1 }}>
              <Popup>Dropoff - {dropoff.label}</Popup>
            </CircleMarker>
            <Polyline positions={[[rider.lat, rider.lng], [pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]]} color="#2563EB" weight={4} opacity={0.7} />
            {zones.map((zone) => (
              <CircleMarker
                key={zone.name}
                center={[zone.lat, zone.lng]}
                radius={18}
                pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.35 }}
                eventHandlers={{
                  click: () => setSelectedZone(zone.name),
                }}
              >
                <Popup>{zone.name} - {zone.demand} - Surge {zone.surge}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF5C28]"></span>Hotspot</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#B33C00]"></span>Pickup</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600"></span>You</span>
        </div>
      </div>
    </div>
  );
}