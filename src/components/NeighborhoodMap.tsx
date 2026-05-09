"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const COORDS: Record<string, [number, number]> = {
  "jackson-heights": [40.7557, -73.8831],
  flushing: [40.7674, -73.833],
  "washington-heights": [40.8417, -73.9393],
  "sunset-park": [40.6454, -73.9929],
  bushwick: [40.6944, -73.9213],
  astoria: [40.7723, -73.9301],
  corona: [40.745, -73.8624],
  "east-harlem": [40.7957, -73.9389],
};

interface Stats {
  [slug: string]: { posts: number; languages: number };
}

export default function NeighborhoodMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [stats, setStats] = useState<Stats>({});

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.stats ?? {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [40.73, -73.9],
      zoom: 11,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update markers when stats change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Import neighborhoods inline to avoid circular deps
    const { NEIGHBORHOODS } = require("@/lib/neighborhoods");

    for (const hood of NEIGHBORHOODS) {
      const coord = COORDS[hood.slug];
      if (!coord) continue;

      const s = stats[hood.slug];
      const postCount = s?.posts ?? 0;
      const langCount = s?.languages ?? 0;

      const radius = Math.max(8, Math.min(25, 8 + postCount * 2));

      const circle = L.circleMarker(coord, {
        radius,
        color: "#7e22ce",
        fillColor: "#a855f7",
        fillOpacity: 0.6,
        weight: 2,
      }).addTo(map);

      circle.bindPopup(
        `<div style="text-align:center;font-family:Georgia,serif;">
          <strong style="font-size:14px;color:#7e22ce;">${hood.name}</strong><br/>
          <span style="font-size:12px;color:#666;">${postCount} posts &middot; ${langCount} languages</span><br/>
          <a href="/${hood.slug}" style="font-size:12px;color:#7e22ce;">enter neighborhood &rarr;</a>
        </div>`
      );
    }
  }, [stats]);

  return (
    <div
      ref={mapRef}
      style={{ height: 400, width: "100%", borderRadius: 4 }}
      className="border border-gray-300"
    />
  );
}
