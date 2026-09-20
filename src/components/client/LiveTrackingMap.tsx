"use client";

import { useEffect, useRef } from "react";
import { Map as MaplibreMap, Marker as MaplibreMarker, LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Bike } from "lucide-react";

// UPDATE (live-tracking fix): this used to be a static decorative div on
// /client/track ("Map placeholder" — see the old ClientTrackOrderPage).
// This component plots the rider's real GPS position (the same data the
// vendor's internal dispatch map already consumes — see
// vendor/components/DeliveryMap.tsx) on an actual map, using the same
// maplibre-gl + openfreemap combo (no API key required) that map already
// established. There's still no address-to-coordinate geocoding anywhere in
// this codebase, so the restaurant/customer endpoints are shown as labels,
// not pins — only the rider's position is ever plotted, because it's the
// only one that's real.

const DHAKA_FALLBACK: LngLatLike = [90.4125, 23.8103];

export interface LiveTrackingMapProps {
  riderLat: number | null;
  riderLng: number | null;
  riderName?: string;
  className?: string;
}

function createRiderMarkerEl(): HTMLElement {
  const el = document.createElement("div");
  el.className = "relative flex items-center justify-center w-10 h-10";
  el.innerHTML = `
    <div class="absolute w-10 h-10 rounded-full animate-ping" style="background: rgba(21,70,45,0.25); animation-duration: 2.2s;"></div>
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg" style="background:#15462D;border:2px solid #fff;">
      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
      </svg>
    </div>
  `;
  return el;
}

export default function LiveTrackingMap({ riderLat, riderLng, riderName, className }: LiveTrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MaplibreMap | null>(null);
  const markerRef = useRef<MaplibreMarker | null>(null);
  // Pure derived value from props — no need for state (and setting state
  // synchronously inside an effect body trips the React Compiler's
  // set-state-in-effect rule for no benefit here).
  const hasLocation = riderLat != null && riderLng != null;

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const center: LngLatLike = riderLat != null && riderLng != null ? [riderLng, riderLat] : DHAKA_FALLBACK;
    const map = new MaplibreMap({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center,
      zoom: 14,
    });
    mapInstance.current = map;

    map.on("load", () => {
      if (riderLat != null && riderLng != null) {
        markerRef.current = new MaplibreMarker({ element: createRiderMarkerEl() })
          .setLngLat([riderLng, riderLat])
          .addTo(map);
      }
      map.resize();
    });

    return () => {
      map.remove();
      mapInstance.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || riderLat == null || riderLng == null) return;

    if (!markerRef.current) {
      markerRef.current = new MaplibreMarker({ element: createRiderMarkerEl() }).setLngLat([riderLng, riderLat]).addTo(map);
      map.easeTo({ center: [riderLng, riderLat], duration: 400 });
    } else {
      markerRef.current.setLngLat([riderLng, riderLat]);
      map.easeTo({ center: [riderLng, riderLat], duration: 800 });
    }
  }, [riderLat, riderLng]);

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl ${className ?? "h-52"}`}>
      <div ref={mapContainer} className="absolute inset-0" />
      {!hasLocation && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-emerald-50/95 text-center backdrop-blur-sm">
          <Bike size={22} className="text-[#15462D]" />
          <p className="px-6 text-xs font-semibold text-[#15462D]">
            Waiting for {riderName || "your rider"}&apos;s location&hellip;
          </p>
        </div>
      )}
    </div>
  );
}
