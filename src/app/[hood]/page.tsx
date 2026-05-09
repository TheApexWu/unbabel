"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { NEIGHBORHOODS, getAdjacentSlugs } from "@/lib/neighborhoods";
import { PostCard } from "@/components/PostCard";
import { SignalCard } from "@/components/SignalCard";
import { LanguagePicker } from "@/components/LanguagePicker";
import { PostForm } from "@/components/PostForm";

interface Post {
  id: number;
  alias: string;
  body_original: string;
  source_lang: string;
  hood: string;
  tenure: string;
  created_at: string;
}

interface SignalPost {
  id: number;
  alias: string;
  body_original: string;
  source_lang: string;
  hood: string;
  created_at: string;
}

interface Signal {
  entity_value: string;
  entity_type: string;
  lang_count: number;
  post_count: number;
  languages: string;
  post_ids: string;
  posts?: SignalPost[];
}

export default function HoodFeed() {
  const params = useParams();
  const hood = params.hood as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [viewerLang, setViewerLang] = useState("en");
  const [viewerAlias, setViewerAlias] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [showRawReports, setShowRawReports] = useState(false);

  const neighborhood = NEIGHBORHOODS.find((n) => n.slug === hood);

  const loadPosts = useCallback(async () => {
    const adjacent = getAdjacentSlugs(hood);
    setLoading(true);
    try {
      const allHoods = [hood, ...adjacent];
      const params = new URLSearchParams();
      params.set("hoods", allHoods.join(","));
      const [feedRes, signalRes] = await Promise.all([
        fetch(`/api/feed?${params}`),
        fetch(`/api/signals?hood=${hood}`),
      ]);
      const feedData = await feedRes.json();
      const signalData = await signalRes.json();
      setPosts(feedData.posts ?? []);
      setSignals(signalData.signals ?? []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [hood]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handlePosted = useCallback((alias?: string) => {
    if (alias) setViewerAlias(alias);
    loadPosts();
  }, [loadPosts]);

  if (!neighborhood) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <p>neighborhood not found.</p>
        <Link href="/" className="text-purple-800 underline">
          back
        </Link>
      </main>
    );
  }

  const postCount = posts.length;
  const langSet = new Set(posts.map((p) => p.source_lang));

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-300 pb-3">
        <div>
          <Link href="/" className="text-xs text-gray-400 hover:text-purple-800">
            &larr; all neighborhoods
          </Link>
          <h1 className="text-2xl font-bold text-purple-800" style={{ fontFamily: "Georgia, serif" }}>
            {neighborhood.name}
          </h1>
          <span className="text-xs text-gray-400">{neighborhood.borough}</span>
        </div>
        <div className="flex items-center gap-3">
          {viewerAlias && (
            <Link
              href={`/tower/${viewerAlias}`}
              className="text-xs text-purple-800 underline hover:text-purple-600"
            >
              my tower
            </Link>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">reading in:</span>
            <LanguagePicker current={viewerLang} onChange={setViewerLang} />
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex gap-4 mb-4 text-sm border-b border-gray-200 pb-2">
        <span className="text-purple-800 font-bold border-b-2 border-purple-800 pb-1">
          signals
        </span>
        <Link
          href={`/${hood}/directory`}
          className="text-gray-500 hover:text-purple-800"
        >
          directory
        </Link>
      </div>

      {/* Signals -- HERO SECTION */}
      {loading ? (
        <p className="text-gray-400 text-sm animate-pulse font-mono">listening across languages...</p>
      ) : signals.length > 0 ? (
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 font-mono uppercase tracking-wide">
              cross-language patterns detected
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {signals.length} active
            </span>
          </div>
          {signals.map((signal) => (
            <SignalCard key={signal.entity_value} signal={signal} />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 p-6 mb-8 text-center font-mono">
          <p className="text-gray-500 text-sm mb-1">no cross-language patterns yet</p>
          <p className="text-gray-400 text-xs">
            when multiple languages mention the same person, place, or issue, it surfaces here.
          </p>
        </div>
      )}

      {/* Report form */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 font-mono mb-2 uppercase tracking-wide">
          report something
        </p>
        <PostForm hood={hood} onPosted={handlePosted} />
      </div>

      {/* Raw reports -- collapsed by default */}
      <div className="border-t border-gray-200 pt-4 pb-8">
        <button
          onClick={() => setShowRawReports(!showRawReports)}
          className="flex items-center gap-2 text-xs text-gray-500 font-mono hover:text-purple-800 mb-3"
        >
          <span className={`transition-transform ${showRawReports ? "rotate-90" : ""}`}>
            &#9654;
          </span>
          <span className="uppercase tracking-wide">
            raw reports ({postCount} posts, {langSet.size} languages)
          </span>
        </button>

        {showRawReports && (
          <div className="space-y-3">
            {posts.length === 0 ? (
              <p className="text-gray-400 text-sm font-mono">
                no reports yet. be the first.
              </p>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  viewerLang={viewerLang}
                  currentHood={hood}
                  viewerAlias={viewerAlias}
                />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
