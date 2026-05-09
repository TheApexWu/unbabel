"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { DirectoryCard } from "@/components/DirectoryCard";

interface DirectoryEntry {
  id: number;
  name: string;
  description_original: string | null;
  category: string | null;
  hood: string;
  address: string | null;
  source: string;
}

const CATEGORIES = ["all", "food", "services", "community", "nightlife"];

export default function DirectoryPage() {
  const params = useParams();
  const hood = params.hood as string;
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const neighborhood = NEIGHBORHOODS.find((n) => n.slug === hood);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams({ hood });
    if (category !== "all") p.set("category", category);
    fetch(`/api/directory?${p}`)
      .then((r) => r.json())
      .then((data) => setEntries(data.entries ?? []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [hood, category]);

  if (!neighborhood) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <p>neighborhood not found.</p>
        <Link href="/" className="text-purple-800 underline">back</Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4 border-b border-gray-300 pb-3">
        <Link href="/" className="text-xs text-gray-400 hover:text-purple-800">
          &larr; all neighborhoods
        </Link>
        <h1 className="text-2xl font-bold text-purple-800" style={{ fontFamily: "Georgia, serif" }}>
          {neighborhood.name}
        </h1>
      </div>

      {/* Nav */}
      <div className="flex gap-4 mb-4 text-sm border-b border-gray-200 pb-2">
        <Link href={`/${hood}`} className="text-gray-500 hover:text-purple-800">
          the feed
        </Link>
        <span className="text-purple-800 font-bold border-b-2 border-purple-800 pb-1">
          directory
        </span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs px-2 py-1 border ${
              category === cat
                ? "bg-purple-800 text-white border-purple-800"
                : "bg-white text-gray-600 border-gray-300 hover:border-purple-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-400 text-sm animate-pulse">loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-400 text-sm">no listings yet.</p>
        ) : (
          entries.map((entry) => (
            <DirectoryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </main>
  );
}
