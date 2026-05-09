"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

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
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1
          className="text-4xl font-bold text-purple-800 mb-1"
          style={{ fontFamily: "Georgia, serif" }}
        >
          unbabel
        </h1>
        <p className="text-sm text-gray-500">
          the neighborhood is talking. hear it out.
        </p>
      </div>

      <div className="border border-gray-300 bg-white p-4">
        <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-300 pb-2">
          pick your neighborhood
        </h2>
        <div className="space-y-1">
          {NEIGHBORHOODS.map((hood) => {
            const s = stats[hood.slug];
            return (
              <div key={hood.slug} className="flex items-baseline gap-2">
                <Link
                  href={`/${hood.slug}`}
                  className="text-purple-800 hover:text-purple-600 underline text-sm"
                >
                  {hood.name}
                </Link>
                <span className="text-xs text-gray-400">{hood.borough}</span>
                {s && s.posts > 0 && (
                  <span className="text-xs text-gray-400 ml-auto">
                    {s.posts} posts / {s.languages} lang
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">
          how it works
        </h3>
        <div className="space-y-2 text-xs text-gray-500">
          <p><strong className="text-gray-700">1. post in any language.</strong> write or speak. we detect, translate, and strip personal info in one pass.</p>
          <p><strong className="text-gray-700">2. read in yours.</strong> every post appears in the language you choose. the source language is invisible.</p>
          <p><strong className="text-gray-700">3. patterns emerge.</strong> when multiple languages mention the same landlord, clinic, or warning, a signal card surfaces it.</p>
          <p><strong className="text-gray-700">4. save what matters.</strong> bookmark posts to your tower. they stay even after the feed expires.</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 space-y-2">
        <p>
          no profiles. no DMs. no followers. no algorithm. posts expire in 7
          days. you don&apos;t need to meet anyone. you just need to hear them.
        </p>
      </div>
    </main>
  );
}
