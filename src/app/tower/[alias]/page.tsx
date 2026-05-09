"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface BookmarkedPost {
  topic: string;
  id: number;
  alias: string;
  body_original: string;
  source_lang: string;
  hood: string;
  tenure: string;
  created_at: string;
}

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", zh: "Chinese", ko: "Korean",
  hi: "Hindi", ne: "Nepali", bn: "Bengali", ar: "Arabic",
  tl: "Tagalog", ru: "Russian",
};

const FLOOR_LABELS: Record<string, string> = {
  housing: "HOUSING",
  food: "FOOD",
  legal: "LEGAL",
  jobs: "JOBS",
  health: "HEALTH",
  education: "EDUCATION",
  safety: "SAFETY",
  community: "COMMUNITY",
  services: "SERVICES",
  general: "GENERAL",
};

export default function TowerPage() {
  const params = useParams();
  const alias = params.alias as string;
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookmarks?alias=${encodeURIComponent(alias)}`)
      .then((r) => r.json())
      .then((data) => setBookmarks(data.bookmarks ?? []))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, [alias]);

  // Group by topic (floors)
  const floors: Record<string, BookmarkedPost[]> = {};
  for (const b of bookmarks) {
    const topic = b.topic || "general";
    if (!floors[topic]) floors[topic] = [];
    floors[topic].push(b);
  }

  const floorKeys = Object.keys(floors);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/" className="text-xs text-gray-400 hover:text-purple-800">
        &larr; all neighborhoods
      </Link>
      <div className="mb-6 border-b border-gray-300 pb-3">
        <h1
          className="text-2xl font-bold text-purple-800"
          style={{ fontFamily: "Georgia, serif" }}
        >
          tower of {alias}
        </h1>
        <p className="text-xs text-gray-500">
          {bookmarks.length} saved posts across {floorKeys.length} floors.
          these don&apos;t expire.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm animate-pulse">loading tower...</p>
      ) : floorKeys.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm mb-2">
            your tower is empty.
          </p>
          <p className="text-xs text-gray-400">
            bookmark posts from any neighborhood feed to start building.
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {/* Render floors bottom-up (oldest topic at bottom = foundation) */}
          {floorKeys.reverse().map((topic, floorIndex) => (
            <div key={topic} className="border border-gray-300 bg-white">
              {/* Floor label */}
              <div className="bg-gray-100 px-3 py-1 border-b border-gray-300 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600 tracking-widest">
                  FL {floorKeys.length - floorIndex} &mdash;{" "}
                  {FLOOR_LABELS[topic] ?? topic.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  {floors[topic].length} posts
                </span>
              </div>
              {/* Posts in this floor */}
              <div className="divide-y divide-gray-200">
                {floors[topic].map((post) => (
                  <div key={post.id} className="px-3 py-2 font-mono text-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="font-bold text-gray-700">
                        {post.alias}
                      </span>
                      <span className="text-gray-400">
                        {LANG_NAMES[post.source_lang] ?? post.source_lang}
                      </span>
                      <span className="text-gray-400">
                        {post.hood.replace(/-/g, " ")}
                      </span>
                    </div>
                    <p className="text-gray-900">{post.body_original}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
