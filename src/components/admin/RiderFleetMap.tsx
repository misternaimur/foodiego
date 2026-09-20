"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MaplibreMap, Marker as MaplibreMarker, LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Bike, LoaderCircle } from "lucide-react";
import type { RiderLocationEntry } from "@/app/api/admin/riders/locations/route";

// UPDATE (admin-rider-map fix): admin previously had zero visibility into
// where the delivery fleet actually is — the same GPS data the vendor's
// own dispatch map already uses (maplibre-gl + openfreemap, no API key
// needed — see vendor/components/DeliveryMap.tsx) was never surfaced here.

const DHAKA_CENTER: LngLatLike = [90.4125, 23.8103];

function colorFor(id: string): string {
  const palette = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#06B6D4", "#EC4899"];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

function markerEl(rider: RiderLocationEntry): HTMLElement {
  const color = rider.isAvailable ? colorFor(rider._id) : "#94A3B8";
  const el = document.createElement("div");
  el.className = "flex flex-col items-center";
  el.innerHTML = `
    <div class="flex h-8 w-8 items-center justify-center rounded-full shadow-lg" style="background:${color};border:2px solid #fff;">
      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
      </svg>
    </div>
    <span class="mt-1 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 shadow-sm whitespace-nowrap">${rider.fullName}</span>
  `;
  return el;
}

export default function RiderFleetMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<Map<string, MaplibreMarker>>(new Map());
  const [riders, setRiders] = useState<RiderLocationEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch("/api/admin/riders/locations", { credentials: "include" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { riders: RiderLocationEntry[] };
        setRiders(data.riders);
      } catch {
        // Next poll retries.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    Promise.resolve().then(poll);
    const interval = setInterval(poll, 20000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;
    const map = new MaplibreMap({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: DHAKA_CENTER,
      zoom: 12,
    });
    mapInstance.current = map;
    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const seen = new Set<string>();
    riders.forEach((rider) => {
      seen.add(rider._id);
      const existing = markersRef.current.get(rider._id);
      if (existing) {
        existing.setLngLat([rider.lng, rider.lat]);
      } else {
        const marker = new MaplibreMarker({ element: markerEl(rider) }).setLngLat([rider.lng, rider.lat]).addTo(map);
        markersRef.current.set(rider._id, marker);
      }
    });

    for (const [id, marker] of markersRef.current) {
      if (!seen.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }
  }, [riders]);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-gray-200">
      <div ref={mapContainer} className="absolute inset-0" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
          <LoaderCircle size={24} className="animate-spin text-gray-400" />
        </div>
      )}
      {!loading && riders.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/90 text-center">
          <Bike size={22} className="text-gray-300" />
          <p className="px-6 text-xs font-semibold text-gray-500">No riders currently sharing their live location.</p>
        </div>
      )}
      <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-gray-600 shadow-sm">
        {riders.length} rider{riders.length === 1 ? "" : "s"} live
      </div>
    </div>
  );
}
