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

interface Signal {
  entity_value: string;
  entity_type: string;
  lang_count: number;
  post_count: number;
  languages: string;
  post_ids: string;
}

export default function HoodFeed() {
  const params = useParams();
  const hood = params.hood as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [viewerLang, setViewerLang] = useState("en");
  const [viewerAlias, setViewerAlias] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

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

  // When user posts, we get their alias back
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
          the feed
        </span>
        <Link
          href={`/${hood}/directory`}
          className="text-gray-500 hover:text-purple-800"
        >
          directory
        </Link>
      </div>

      {/* Post form */}
      <div className="mb-6">
        <PostForm hood={hood} onPosted={handlePosted} />
      </div>

      {/* Signal Cards */}
      {signals.length > 0 && (
        <div className="space-y-3 mb-6">
          {signals.map((signal) => (
            <SignalCard key={signal.entity_value} signal={signal} />
          ))}
        </div>
      )}

      {/* Posts */}
      <div className="space-y-3 pb-8">
        {loading ? (
          <p className="text-gray-400 text-sm animate-pulse">loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-400 text-sm">
            no posts yet. be the first to talk.
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
    </main>
  );
}
