"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";

// 중요도별 점 지름(px)
const DOT_SIZE = { 3: 18, 2: 14, 1: 11, 0: 9 };
// 중요도별 라벨 스타일 (계층화)
function labelStyle(imp) {
  if (imp >= 2) return { fs: 12.5, fw: 600, c: "#1c1917" };
  if (imp === 1) return { fs: 11.5, fw: 500, c: "#44403c" };
  return { fs: 10.5, fw: 500, c: "#78716c" };
}

export default function BibleMap({
  locations = [],
  journeys = [],
  selectedJourney = null,
  selectedLocation = null,
  onSelectLocation,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const pathLayersRef = useRef(null);
  const [ready, setReady] = useState(false);

  const activeJourney = useMemo(() => {
    if (!selectedJourney) return null;
    return journeys.find((j) => j.id === selectedJourney) || null;
  }, [selectedJourney, journeys]);

  const journeyLocationIds = useMemo(() => {
    if (!activeJourney) return new Set();
    return new Set(activeJourney.path || []);
  }, [activeJourney]);

  // 지도 초기화
  useEffect(() => {
    if (mapInstanceRef.current) return;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [33, 36],
        zoom: 5,
        minZoom: 3,
        maxZoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, subdomains: "abcd" }
      ).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);

      mapInstanceRef.current = map;
      setReady(true);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 마커
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      locations.forEach((loc) => {
        const isOnJourney = journeyLocationIds.has(loc.id);
        const isSelected = selectedLocation === loc.id;
        const color = isOnJourney && activeJourney ? activeJourney.color : "#B45309";
        const base = DOT_SIZE[loc.importance] || 9;
        const d = isSelected ? base + 4 : base;
        const ring = isSelected
          ? `box-shadow:0 0 0 4px ${color}33, 0 1px 3px rgba(0,0,0,0.3);`
          : `box-shadow:0 1px 3px rgba(0,0,0,0.35);`;
        const lbl = labelStyle(loc.importance);

        const icon = L.divIcon({
          className: "",
          iconSize: [140, d + 24],
          iconAnchor: [70, d / 2 + 2],
          html: `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;">
            <div style="width:${d}px;height:${d}px;border-radius:50%;background:${color};border:2.5px solid #ffffff;box-sizing:border-box;${ring}pointer-events:auto;cursor:pointer;"></div>
            <div style="margin-top:3px;font-size:${lbl.fs}px;font-weight:${lbl.fw};color:${lbl.c};white-space:nowrap;text-shadow:0 0 2px #fff,0 0 2px #fff,0 1px 2px #fff;pointer-events:none;">${loc.name}</div>
          </div>`,
        });

        const marker = L.marker([loc.lat, loc.lng], {
          icon,
          zIndexOffset: (loc.importance || 0) * 100,
        })
          .addTo(map)
          .on("click", () => onSelectLocation?.(loc.id));

        markersRef.current[loc.id] = marker;
      });
    });
  }, [ready, locations, activeJourney, journeyLocationIds, selectedLocation, onSelectLocation]);

  // 여정 경로
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;

      if (pathLayersRef.current) {
        pathLayersRef.current.forEach((l) => l.remove());
        pathLayersRef.current = null;
      }

      if (!activeJourney) return;

      const coords = (activeJourney.path || [])
        .map((id) => locations.find((l) => l.id === id))
        .filter(Boolean)
        .map((l) => [l.lat, l.lng]);

      if (coords.length < 2) return;

      const layers = [];

      // 배경 선
      layers.push(
        L.polyline(coords, { color: "white", weight: 6, opacity: 0.6 }).addTo(map)
      );
      // 색상 실선
      layers.push(
        L.polyline(coords, { color: activeJourney.color, weight: 3, opacity: 0.9 }).addTo(map)
      );

      // 출발점/도착점 표시
      const startLoc = locations.find((l) => l.id === activeJourney.path[0]);
      const endLoc = locations.find((l) => l.id === activeJourney.path[activeJourney.path.length - 1]);
      if (startLoc) {
        layers.push(
          L.circleMarker([startLoc.lat, startLoc.lng], {
            radius: 6, color: activeJourney.color, fillColor: "white", fillOpacity: 1, weight: 3, interactive: false,
          }).addTo(map)
        );
      }
      if (endLoc && endLoc.id !== startLoc?.id) {
        layers.push(
          L.circleMarker([endLoc.lat, endLoc.lng], {
            radius: 6, color: activeJourney.color, fillColor: activeJourney.color, fillOpacity: 1, weight: 2, interactive: false,
          }).addTo(map)
        );
      }

      // 경유지 번호 표시
      const uniquePath = [];
      const seen = new Set();
      for (const id of activeJourney.path) {
        if (!seen.has(id)) { seen.add(id); uniquePath.push(id); }
      }
      uniquePath.forEach((id, idx) => {
        const loc = locations.find((l) => l.id === id);
        if (!loc) return;
        const icon = L.divIcon({
          className: "",
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          html: `<div style="width:22px;height:22px;border-radius:50%;background:${activeJourney.color};color:white;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.3);">${idx + 1}</div>`,
        });
        layers.push(
          L.marker([loc.lat, loc.lng], { icon, interactive: false, zIndexOffset: 1000 }).addTo(map)
        );
      });

      pathLayersRef.current = layers;

      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 7 });
    });
  }, [ready, activeJourney, locations]);

  // 선택 장소로 이동
  useEffect(() => {
    if (!ready || !mapInstanceRef.current || !selectedLocation) return;
    const loc = locations.find((l) => l.id === selectedLocation);
    if (!loc) return;
    mapInstanceRef.current.setView(
      [loc.lat, loc.lng],
      Math.max(mapInstanceRef.current.getZoom(), 7),
      { animate: true }
    );
  }, [ready, selectedLocation, locations]);

  return (
    <div
      ref={mapRef}
      className="relative z-0 w-full rounded-xl overflow-hidden h-[48vh] min-h-[320px] md:h-[70vh]"
    />
  );
}
