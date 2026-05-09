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
  tl: "Tagalog", ru: "Russian", el: "Greek", pt: "Portuguese", fr: "French",
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

const FLOOR_COLORS: Record<string, string> = {
  housing: "border-l-amber-500 bg-amber-50",
  food: "border-l-green-500 bg-green-50",
  legal: "border-l-blue-500 bg-blue-50",
  jobs: "border-l-indigo-500 bg-indigo-50",
  health: "border-l-red-500 bg-red-50",
  education: "border-l-violet-500 bg-violet-50",
  safety: "border-l-orange-500 bg-orange-50",
  community: "border-l-purple-500 bg-purple-50",
  services: "border-l-teal-500 bg-teal-50",
  general: "border-l-gray-400 bg-gray-50",
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
  const totalPosts = bookmarks.length;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/" className="text-xs text-gray-400 hover:text-purple-800">
        &larr; all neighborhoods
      </Link>

      {/* Tower header */}
      <div className="mb-6 border-b border-gray-300 pb-3">
        <h1
          className="text-2xl font-bold text-purple-800"
          style={{ fontFamily: "Georgia, serif" }}
        >
          tower of {alias}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {totalPosts} saved across {floorKeys.length} floor{floorKeys.length !== 1 ? "s" : ""}.
          these don&apos;t expire.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm animate-pulse">loading tower...</p>
      ) : floorKeys.length === 0 ? (
        <div className="border border-dashed border-gray-300 p-8 text-center">
          <div className="text-3xl text-gray-300 mb-2" style={{ fontFamily: "Georgia, serif" }}>
            &#x1F3D7;
          </div>
          <p className="text-gray-400 text-sm mb-1">
            your tower is empty.
          </p>
          <p className="text-xs text-gray-400">
            bookmark posts from any neighborhood feed to start building.
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {/* Tower visualization -- floors stack bottom up */}
          {[...floorKeys].reverse().map((topic, floorIndex) => {
            const floorNum = floorKeys.length - floorIndex;
            const color = FLOOR_COLORS[topic] ?? FLOOR_COLORS.general;

            return (
              <div
                key={topic}
                className={`border border-gray-300 border-l-4 ${color}`}
              >
                {/* Floor header */}
                <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 font-mono">
                      FL{floorNum}
                    </span>
                    <span className="text-xs font-bold text-gray-700 tracking-widest">
                      {FLOOR_LABELS[topic] ?? topic.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {floors[topic].length}
                  </span>
                </div>

                {/* Posts in this floor */}
                <div className="divide-y divide-gray-200">
                  {floors[topic].map((post) => (
                    <div key={post.id} className="px-3 py-3 font-mono text-sm">
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
            );
          })}

          {/* Foundation */}
          <div className="bg-purple-800 text-white text-center py-2 text-xs font-mono tracking-widest">
            FOUNDATION
          </div>
        </div>
      )}
    </main>
  );
}
