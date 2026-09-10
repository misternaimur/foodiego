"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, Marker, NavigationControl, type LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface ProfileMapProps {
  lat: number;
  lng: number;
  address: string;
  onLocationChange?: (lat: number, lng: number) => void;
}

export default function ProfileMap({ lat, lng, address, onLocationChange }: ProfileMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  /* Map should only be initialized once on mount */
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const center: LngLatLike = [lng || 90.4066, lat || 23.7937];

      const map = new MapLibreMap({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tiles: ["https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "background",
              type: "background",
              paint: { "background-color": "#f8fafc" },
            },
            {
              id: "raster-tiles",
              type: "raster",
              source: "raster-tiles",
            },
          ],
        },
        center,
        zoom: 13,
        pitch: 45,
        bearing: -17.6,
      });

      map.addControl(new NavigationControl(), "top-right");

      const marker = new Marker({ draggable: true })
        .setLngLat(center)
        .addTo(map);

      marker.on("dragend", () => {
        const position = marker.getLngLat();
        onLocationChange?.(position.lat, position.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setIsMapReady(true);
    }

    return () => {
      markerRef.current?.remove();
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const center: LngLatLike = [lng || 90.4066, lat || 23.7937];
      markerRef.current.setLngLat(center);
      mapInstanceRef.current.flyTo({ center, zoom: 13, duration: 1000 });
    }
  }, [lat, lng, onLocationChange]);

  return (
    <>
      <div ref={mapContainerRef} className="h-full w-full rounded-2xl" />
      {address && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>{address}</span>
        </div>
      )}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      )}
    </>
  );
}
