"use client";

import { useEffect, useRef } from "react";
import { Map as MaplibreMap, Marker as MaplibreMarker, LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export interface RiderLocation {
  orderId: string;
  riderId: string;
  lat: number;
  lng: number;
  speed: number;
}

export interface DeliveryPoint {
  orderId: string;
  customerName: string;
  // UPDATE (rider-GPS fix): destination coordinates are now optional. This
  // codebase has no address-to-coordinate geocoding, so a delivery address
  // stored as free text has no real lat/lng — rather than invent one, the
  // map now simply skips the destination pin/route line for that order
  // (see the render effects below) instead of plotting a fake location.
  lat?: number;
  lng?: number;
  riderLat?: number;
  riderLng?: number;
  riderSpeed?: number;
  riderId?: string;
  riderName?: string;
  status: string;
}

export interface DeliveryMapProps {
  riderLocations: RiderLocation[];
  deliveries: DeliveryPoint[];
  onRiderClick?: (riderId: string) => void;
  className?: string;
}

const BANANI_COORD: LngLatLike = [90.4066, 23.7937];
const RESTAURANT_COORD: LngLatLike = [90.4066, 23.7611];

// UPDATE (rider-GPS fix): riders used to be looked up by a fixed set of 7
// fake IDs ("rider_001".."rider_007") with hardcoded names/colors. Real
// riders have arbitrary Mongo ObjectIds, so colors are now generated
// deterministically from the id itself and names come from the real
// delivery data (DeliveryPoint.riderName) instead of a lookup table.
const RIDER_COLOR_PALETTE = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#06B6D4", "#EC4899"];

function colorForRider(riderId: string): string {
  let hash = 0;
  for (let i = 0; i < riderId.length; i++) hash = (hash * 31 + riderId.charCodeAt(i)) >>> 0;
  return RIDER_COLOR_PALETTE[hash % RIDER_COLOR_PALETTE.length];
}

function createRestaurantMarkerEl(): HTMLElement {
  const el = document.createElement("div");
  el.className = "relative flex items-center justify-center w-8 h-8";
  el.innerHTML = `
    <div class="absolute w-3 h-3 rounded-full" style="background: #10B981; z-index: 2;"></div>
    <div class="absolute w-6 h-6 rounded-full animate-ping" style="background: rgba(16, 185, 129, 0.4); animation-duration: 2s;"></div>
    <div class="absolute w-10 h-10 rounded-full animate-ping" style="background: rgba(16, 185, 129, 0.2); animation-duration: 2s; animation-delay: 0.5s;"></div>
  `;
  return el;
}

function createRiderMarkerEl(riderId: string, riderName: string, speed: number): HTMLElement {
  const color = colorForRider(riderId);
  const el = document.createElement("div");
  el.className = "flex flex-col items-center cursor-pointer h-12";
  el.innerHTML = `
    <div class="relative flex items-center justify-center w-9 h-9 rounded-full shadow-lg transition-all"
         style="background: ${color}; border: 2px solid #fff; box-shadow: 0 0 8px ${color};">
      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
      </svg>
    </div>
    ${speed > 0 ? `<span class="text-[8px] font-semibold mt-1 whitespace-nowrap" style="color: ${color}; text-shadow: 0 0 4px rgba(0,0,0,0.3);">${speed} km/h</span>` : ""}
  `;
  el.title = riderName;
  return el;
}

function createDestinationMarkerEl(): HTMLElement {
  const el = document.createElement("div");
  el.className = "flex items-center justify-center w-6 h-6";
  el.innerHTML = `
    <div class="relative flex items-center justify-center w-4 h-4 rounded-full shadow-lg"
         style="background: #EF4444; border: 2px solid #fff;">
      <div class="absolute w-2 h-2 rounded-full bg-white"></div>
    </div>
  `;
  return el;
}

export default function DeliveryMap({ riderLocations, deliveries, onRiderClick, className }: DeliveryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<Map<string, MaplibreMarker>>(new Map());
  const routeSourcesRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapInstance.current) return;

    const map = new MaplibreMap({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: BANANI_COORD,
      zoom: 14,
      pitch: 60,
      bearing: -17,
    });

    mapInstance.current = map;

    map.on("load", () => {
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find((l) => l.type === "symbol" && l.id)?.id;

      if (labelLayerId && !map.getSource("3d-buildings")) {
        map.addSource("3d-buildings-source", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
      }

      void labelLayerId;

      const restaurantMarker = new MaplibreMarker({ element: createRestaurantMarkerEl() })
        .setLngLat(RESTAURANT_COORD)
        .addTo(map);
      markersRef.current.set("restaurant", restaurantMarker);

      deliveries.forEach((delivery) => {
        if (delivery.status === "Delivered" || !delivery.riderLat || !delivery.riderLng) return;

        const rLoc = riderLocations.find((rl) => rl.orderId === delivery.orderId);
        const riderId = rLoc?.riderId || delivery.riderId || delivery.orderId;
        const riderName = delivery.riderName || "Rider";
        const speed = rLoc?.speed || delivery.riderSpeed || 0;

        const riderEl = createRiderMarkerEl(riderId, riderName, speed);
        const riderMarker = new MaplibreMarker({ element: riderEl })
          .setLngLat([delivery.riderLng, delivery.riderLat] as LngLatLike)
          .addTo(map);
        markersRef.current.set(`rider-${delivery.orderId}`, riderMarker);

        if (onRiderClick) {
          riderEl.addEventListener("click", () => onRiderClick(riderId));
        }

        // No address-to-coordinate geocoding exists, so a destination pin
        // and route line are only drawn when a real lat/lng is present.
        if (delivery.lat == null || delivery.lng == null) return;

        new MaplibreMarker({ element: createDestinationMarkerEl() })
          .setLngLat([delivery.lng, delivery.lat] as LngLatLike)
          .addTo(map);

        const sourceId = `route-${delivery.orderId}`;
        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [delivery.riderLng, delivery.riderLat],
                  [delivery.lng, delivery.lat],
                ],
              },
              properties: {},
            }],
          },
        });
        map.addLayer({
          id: sourceId,
          type: "line",
          source: sourceId,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": colorForRider(riderId),
            "line-width": 3,
            "line-opacity": 0.7,
          },
        });
        routeSourcesRef.current.set(delivery.orderId, sourceId);
      });

      map.resize();
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !map.isStyleLoaded()) return;

    deliveries.forEach((delivery) => {
      const markerKey = `rider-${delivery.orderId}`;
      const marker = markersRef.current.get(markerKey);

      if (delivery.riderLat && delivery.riderLng && marker) {
        marker.setLngLat([delivery.riderLng, delivery.riderLat] as LngLatLike);
      }

      const sourceId = routeSourcesRef.current.get(delivery.orderId);
      if (sourceId && delivery.riderLat && delivery.riderLng && delivery.lat != null && delivery.lng != null) {
        const source = map.getSource(sourceId) as unknown as { setData: (data: unknown) => void };
        if (source && source.setData) {
          source.setData({
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [delivery.riderLng, delivery.riderLat],
                  [delivery.lng, delivery.lat],
                ],
              },
              properties: {},
            }],
          });
        }
      }
    });

    map.resize();
  }, [riderLocations, deliveries, onRiderClick]);

  return (
    <div
      ref={mapContainer}
      className={`relative w-full overflow-hidden rounded-xl ${className ?? "h-[500px]"}`}
      style={className ? undefined : { minHeight: "500px" }}
    />
  );
}
