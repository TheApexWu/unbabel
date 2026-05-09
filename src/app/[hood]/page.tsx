"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { NEIGHBORHOODS, getAdjacentSlugs, SUPPORTED_LANGUAGES } from "@/lib/neighborhoods";
import { PostCard } from "@/components/PostCard";
import { SignalCard } from "@/components/SignalCard";
import { LanguagePicker } from "@/components/LanguagePicker";
import { PostForm } from "@/components/PostForm";
import { t } from "@/lib/ui-strings";

function detectLang(): string {
  if (typeof navigator === "undefined") return "en";
  const raw = navigator.language || "en";
  const prefix = raw.split("-")[0].toLowerCase();
  const supported = SUPPORTED_LANGUAGES.map((l) => l.code);
  if (supported.includes(prefix)) return prefix;
  return "en";
}

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

interface CrossHoodSignal {
  entity_value: string;
  entity_type: string;
  hood_count: number;
  post_count: number;
  hoods: string;
  languages: string;
}

export default function HoodFeed() {
  const params = useParams();
  const hood = params.hood as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [crossHoodSignals, setCrossHoodSignals] = useState<CrossHoodSignal[]>([]);
  const [viewerLang, setViewerLang] = useState("en");

  useEffect(() => {
    setViewerLang(detectLang());
    const saved = localStorage.getItem("unbabel_alias");
    if (saved) {
      setViewerAlias(saved);
    } else {
      setViewerAlias("demo-user");
      localStorage.setItem("unbabel_alias", "demo-user");
    }
  }, []);
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
      setCrossHoodSignals(signalData.crossHoodSignals ?? []);
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
    if (alias) {
      setViewerAlias(alias);
      localStorage.setItem("unbabel_alias", alias);
    }
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
      <div className="flex flex-wrap items-center justify-between mb-4 border-b border-gray-300 pb-3">
        <div>
          <Link href="/" className="text-xs text-gray-400 hover:text-purple-800">
            &larr; {t(viewerLang, "allNeighborhoods")}
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
              {t(viewerLang, "myTower")}
            </Link>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{t(viewerLang, "readingIn")}</span>
            <LanguagePicker current={viewerLang} onChange={setViewerLang} />
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex gap-4 mb-4 text-sm border-b border-gray-200 pb-2">
        <span className="text-purple-800 font-bold border-b-2 border-purple-800 pb-1">
          {t(viewerLang, "signals")}
        </span>
        {viewerLang === "en" && (
          <Link
            href={`/${hood}/directory`}
            className="text-gray-500 hover:text-purple-800"
          >
            {t(viewerLang, "directory")}
          </Link>
        )}
      </div>

      {/* Signals -- HERO SECTION */}
      {loading ? (
        <p className="text-gray-400 text-sm animate-pulse font-mono">listening across languages...</p>
      ) : signals.length > 0 ? (
        <div className="space-y-4 mb-8">
          <p className="text-sm text-gray-600 font-mono mb-3">
            {t(viewerLang, "crossLangHeader")}
          </p>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 font-mono uppercase tracking-wide">
              {t(viewerLang, "patternsDetected")}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {signals.length} {t(viewerLang, "active")}
            </span>
          </div>
          {signals.map((signal, i) => (
            <SignalCard key={signal.entity_value} signal={signal} hood={hood} viewerLang={viewerLang} defaultExpanded={i === 0} />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 p-6 mb-8 text-center font-mono">
          <p className="text-gray-500 text-sm mb-1">{t(viewerLang, "noPatterns")}</p>
          <p className="text-gray-400 text-xs">
            {t(viewerLang, "noPatternsDesc")}
          </p>
        </div>
      )}

      {/* Cross-neighborhood signals */}
      {!loading && crossHoodSignals.length > 0 && (
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-red-600 font-mono uppercase tracking-wide font-bold">
              cross-neighborhood patterns
            </span>
            <span className="text-xs text-red-400 font-mono">
              {crossHoodSignals.length} city-level
            </span>
          </div>
          {crossHoodSignals.map((signal) => {
            const hoods = signal.hoods.split(",");
            const langs = signal.languages.split(",");
            return (
              <div
                key={signal.entity_value}
                className="border-2 border-rose-500 bg-rose-50 font-mono text-sm"
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5">
                      CITY-LEVEL SIGNAL
                    </span>
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5">
                      {signal.hood_count} neighborhoods
                    </span>
                    <span className="text-xs text-rose-700">
                      [{signal.entity_type}]
                    </span>
                    <span className="ml-auto text-xs text-rose-600">
                      {signal.post_count} reports
                    </span>
                  </div>
                  <p className="text-rose-900 font-bold text-base mb-2">
                    {signal.entity_value}
                  </p>
                  <p className="text-xs text-rose-700 mb-2">
                    Reported across {signal.hood_count} neighborhoods. This is not a local issue -- it is a city-level pattern.
                  </p>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {hoods.map((h) => (
                      <span
                        key={h}
                        className="text-xs border border-rose-300 bg-white px-2 py-0.5 text-rose-800"
                      >
                        {h.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {langs.map((lang) => (
                      <span
                        key={lang}
                        className="text-xs border border-rose-200 bg-rose-100 px-2 py-0.5 text-rose-700"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report form */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 font-mono mb-2 uppercase tracking-wide">
          {t(viewerLang, "reportSomething")}
        </p>
        <PostForm hood={hood} onPosted={handlePosted} viewerLang={viewerLang} />
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
            {t(viewerLang, "rawReports")} ({postCount} {t(viewerLang, "posts")}, {langSet.size} {t(viewerLang, "languages")})
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
