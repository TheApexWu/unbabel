"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const COORDS: Record<string, [number, number]> = {
  "jackson-heights": [40.7557, -73.8831],
  flushing: [40.7674, -73.833],
  "washington-heights": [40.8417, -73.9393],
  "sunset-park": [40.6454, -73.9929],
  bushwick: [40.6944, -73.9213],
  astoria: [40.7723, -73.9301],
  corona: [40.745, -73.8624],
  "east-harlem": [40.7957, -73.9389],
  elmhurst: [40.736, -73.878],
  chinatown: [40.7158, -73.997],
  "brighton-beach": [40.5776, -73.9599],
  fordham: [40.8614, -73.8977],
};

interface Stats {
  [slug: string]: { posts: number; languages: number };
}

export default function NeighborhoodMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [stats, setStats] = useState<Stats>({});

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.stats ?? {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [-73.9, 40.73],
      zoom: 10.5,
      scrollZoom: false,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

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

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const { NEIGHBORHOODS } = require("@/lib/neighborhoods");

    for (const hood of NEIGHBORHOODS) {
      const coord = COORDS[hood.slug];
      if (!coord) continue;

      const s = stats[hood.slug];
      const postCount = s?.posts ?? 0;
      const langCount = s?.languages ?? 0;

      const size = Math.max(16, Math.min(50, 16 + postCount * 4));

      // Create a purple circle DOM element for the marker
      const el = document.createElement("div");
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "rgba(168, 85, 247, 0.6)";
      el.style.border = "2px solid #7e22ce";
      el.style.cursor = "pointer";
      el.style.transition = "transform 0.15s ease";
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(
        `<div style="text-align:center;font-family:Georgia,serif;">
          <strong style="font-size:14px;color:#7e22ce;">${hood.name}</strong><br/>
          <span style="font-size:12px;color:#999;">${postCount} posts &middot; ${langCount} languages</span><br/>
          <a href="/${hood.slug}" style="font-size:12px;color:#a855f7;">enter neighborhood &rarr;</a>
        </div>`
      );

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([coord[1], coord[0]])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    }
  }, [stats]);

  return (
    <div
      ref={mapRef}
      style={{ height: 400, width: "100%", borderRadius: 4 }}
      className="border border-gray-700"
    />
  );
}
