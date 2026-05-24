"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";

const MARKER_SIZE = 10;

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
        const color = isOnJourney && activeJourney ? activeJourney.color : "#1C1917";
        const s = isSelected ? MARKER_SIZE + 3 : MARKER_SIZE;
        const ring = isSelected ? `box-shadow:0 0 0 3px ${color}40, 0 2px 8px rgba(0,0,0,0.25);` : `box-shadow:0 1px 4px rgba(0,0,0,0.2);`;

        const icon = L.divIcon({
          className: "",
          iconSize: [120, s * 2 + 22],
          iconAnchor: [60, s + 2],
          html: `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;">
            <div style="width:${s * 2}px;height:${s * 2}px;border-radius:50%;background:white;border:2px solid ${color};${ring}display:flex;align-items:center;justify-content:center;pointer-events:auto;cursor:pointer;">
              <div style="width:${s * 0.7}px;height:${s * 0.7}px;border-radius:50%;background:${color};"></div>
            </div>
            <div style="margin-top:2px;font-size:12px;font-weight:600;color:#1C1917;white-space:nowrap;text-shadow:0 0 3px white,0 0 3px white,0 0 3px white,0 0 3px white;pointer-events:none;">${loc.name}</div>
          </div>`,
        });

        const marker = L.marker([loc.lat, loc.lng], { icon })
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
      className="w-full rounded-xl overflow-hidden"
      style={{ height: "70vh", minHeight: 400 }}
    />
  );
}
