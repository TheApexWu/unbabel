"use client";

import { useEffect, useState } from "react";

interface DirectoryEntry {
  id: number;
  name: string;
  description_original: string | null;
  source_lang: string | null;
  category: string | null;
  hood: string;
  address: string | null;
  source: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  food: "[FOOD]",
  services: "[SVCS]",
  community: "[COMM]",
  nightlife: "[NITE]",
  health: "[HLTH]",
};

export function DirectoryCard({
  entry,
  viewerLang,
}: {
  entry: DirectoryEntry;
  viewerLang?: string;
}) {
  const [displayName, setDisplayName] = useState(entry.name);
  const [displayDesc, setDisplayDesc] = useState(entry.description_original);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no viewer lang, same as source, or no source lang, show original
    if (!viewerLang || !entry.source_lang || viewerLang === entry.source_lang) {
      setDisplayName(entry.name);
      setDisplayDesc(entry.description_original);
      return;
    }

    setLoading(true);
    fetch(
      `/api/translate-directory?id=${entry.id}&lang=${viewerLang}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.translated_name) setDisplayName(data.translated_name);
        if (data.translated_description)
          setDisplayDesc(data.translated_description);
      })
      .catch(() => {
        setDisplayName(entry.name);
        setDisplayDesc(entry.description_original);
      })
      .finally(() => setLoading(false));
  }, [entry.id, entry.name, entry.description_original, entry.source_lang, viewerLang]);

  return (
    <div className="border border-gray-300 bg-white p-4 font-mono text-sm">
      <div className="flex items-center gap-2 mb-1">
        {entry.category && (
          <span className="text-xs text-purple-700 font-bold">
            {CATEGORY_ICONS[entry.category] ??
              `[${entry.category.toUpperCase()}]`}
          </span>
        )}
        <span
          className={`font-bold ${loading ? "text-gray-400 animate-pulse" : "text-gray-900"}`}
        >
          {displayName}
        </span>
      </div>
      {entry.address && (
        <p className="text-xs text-gray-500 mb-1">{entry.address}</p>
      )}
      {displayDesc && (
        <p
          className={
            loading ? "text-gray-400 animate-pulse" : "text-gray-700"
          }
        >
          {displayDesc}
        </p>
      )}
      {entry.source !== "user" && (
        <p className="text-xs text-gray-400 mt-1 italic">via {entry.source}</p>
      )}
    </div>
  );
}
