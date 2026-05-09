"use client";

interface DirectoryEntry {
  id: number;
  name: string;
  description_original: string | null;
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
};

export function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  return (
    <div className="border border-gray-300 bg-white p-4 font-mono text-sm">
      <div className="flex items-center gap-2 mb-1">
        {entry.category && (
          <span className="text-xs text-purple-700 font-bold">
            {CATEGORY_ICONS[entry.category] ?? `[${entry.category.toUpperCase()}]`}
          </span>
        )}
        <span className="font-bold text-gray-900">{entry.name}</span>
      </div>
      {entry.address && (
        <p className="text-xs text-gray-500 mb-1">{entry.address}</p>
      )}
      {entry.description_original && (
        <p className="text-gray-700">{entry.description_original}</p>
      )}
      {entry.source !== "user" && (
        <p className="text-xs text-gray-400 mt-1 italic">
          via {entry.source}
        </p>
      )}
    </div>
  );
}
