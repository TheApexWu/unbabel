"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

const NeighborhoodMap = dynamic(() => import("@/components/NeighborhoodMap"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 bg-gray-50 flex items-center justify-center" style={{ height: 400 }}>
      <span className="text-xs text-gray-400">loading map...</span>
    </div>
  ),
});

export default function Home() {
  const [stats, setStats] = useState<
    Record<string, { posts: number; languages: number }>
  >({});

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.stats ?? {}))
      .catch(() => {});
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-4">
      <div className="text-center mb-4">
        <p className="text-base text-gray-500 mb-1">
          the neighborhood is talking. hear it out.
        </p>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          A multilingual bulletin board that detects when immigrant communities across language barriers report the same person, place, or problem.
        </p>
      </div>

      <div className="mb-4">
        <NeighborhoodMap />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {NEIGHBORHOODS.map((hood) => {
          const s = stats[hood.slug];
          return (
            <Link
              key={hood.slug}
              href={`/${hood.slug}`}
              className="border border-gray-300 bg-white p-3 hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <span className="text-purple-800 font-bold text-sm block">{hood.name}</span>
              <span className="text-xs text-gray-400">{hood.borough}</span>
              {s && s.posts > 0 && (
                <span className="text-xs text-gray-500 block mt-1">
                  {s.posts} posts / {s.languages} languages
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
        <div className="border border-gray-200 bg-gray-50 p-3">
          <strong className="text-gray-700 block mb-1">1. post in any language</strong>
          write or speak. we detect, translate, and strip personal info in one pass.
        </div>
        <div className="border border-gray-200 bg-gray-50 p-3">
          <strong className="text-gray-700 block mb-1">2. read in yours</strong>
          every post appears in the language you choose.
        </div>
        <div className="border border-gray-200 bg-gray-50 p-3">
          <strong className="text-gray-700 block mb-1">3. patterns emerge</strong>
          when multiple languages mention the same landlord, clinic, or warning, a signal surfaces it.
        </div>
        <div className="border border-gray-200 bg-gray-50 p-3">
          <strong className="text-gray-700 block mb-1">4. save what matters</strong>
          bookmark posts to your tower. they stay even after the feed expires.
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400 text-center">
        no profiles. no DMs. no followers. no algorithm. posts expire in 7
        days. you don&apos;t need to meet anyone. you just need to hear them.
      </p>
    </main>
  );
}
