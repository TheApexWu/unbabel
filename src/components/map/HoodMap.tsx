"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { HOOD_CENTROIDS } from "./hoodCentroids";

type Stats = Record<string, { posts: number; languages: number }>;

function heatColor(posts: number): string {
  if (posts >= 10) return "#dc2626";
  if (posts >= 5) return "#ea580c";
  if (posts >= 1) return "#ca8a04";
  return "#9ca3af";
}

export default function HoodMap() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [stats, setStats] = useState<Stats>({});

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.stats ?? {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [-73.92, 40.74],
      zoom: 10.3,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers: maplibregl.Marker[] = [];

    const addMarkers = () => {
      for (const hood of NEIGHBORHOODS) {
        const center = HOOD_CENTROIDS[hood.slug];
        if (!center) continue;
        const s = stats[hood.slug];
        const posts = s?.posts ?? 0;
        const languages = s?.languages ?? 0;

        const el = document.createElement("button");
        el.type = "button";
        el.setAttribute("aria-label", `${hood.name}: ${posts} posts`);
        const size = Math.min(48, 16 + posts * 2);
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = "9999px";
        el.style.background = heatColor(posts);
        el.style.border = "2px solid #fff";
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
        el.style.cursor = "pointer";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.color = "#fff";
        el.style.fontFamily = "Courier Prime, ui-monospace, monospace";
        el.style.fontSize = "11px";
        el.style.fontWeight = "700";
        el.textContent = posts > 0 ? String(posts) : "";

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          router.push(`/${hood.slug}`);
        });

        const popup = new maplibregl.Popup({
          offset: size / 2 + 6,
          closeButton: false,
          closeOnClick: false,
        }).setHTML(
          `<div style="font-family: Courier Prime, monospace; font-size: 12px;">
             <div style="font-weight:700; color:#6b21a8;">${hood.name}</div>
             <div style="color:#6b7280; font-size:10px;">${hood.borough}</div>
             <div style="color:#374151; margin-top:2px;">${posts} posts &middot; ${languages} languages</div>
           </div>`
        );

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(center)
          .setPopup(popup)
          .addTo(map);

        el.addEventListener("mouseenter", () => marker.togglePopup());
        el.addEventListener("mouseleave", () => marker.togglePopup());

        markers.push(marker);
      }
    };

    if (map.loaded()) addMarkers();
    else map.once("load", addMarkers);

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [stats, router]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[360px] border border-gray-300 bg-white"
      style={{ borderRadius: 0 }}
    />
  );
}
