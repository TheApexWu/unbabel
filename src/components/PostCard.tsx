"use client";

import { useEffect, useState } from "react";
import { TenureBadge } from "./TenureBadge";

interface Post {
  id: number;
  alias: string;
  body_original: string;
  source_lang: string;
  hood: string;
  tenure: string;
  created_at: string;
}

const LANG_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  zh: "Chinese",
  ko: "Korean",
  hi: "Hindi",
  ne: "Nepali",
  bn: "Bengali",
  ar: "Arabic",
  tl: "Tagalog",
  ru: "Russian",
  el: "Greek",
  pt: "Portuguese",
  fr: "French",
};

const TOPIC_OPTIONS = [
  "housing", "food", "legal", "jobs", "health",
  "education", "safety", "community", "services", "general",
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function PostCard({
  post,
  viewerLang,
  currentHood,
  viewerAlias,
}: {
  post: Post;
  viewerLang: string;
  currentHood: string;
  viewerAlias?: string;
}) {
  const [displayText, setDisplayText] = useState(post.body_original);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const isBleed = post.hood !== currentHood;

  useEffect(() => {
    if (post.source_lang === viewerLang) {
      setDisplayText(post.body_original);
      return;
    }

    setLoading(true);
    fetch(`/api/translate?postId=${post.id}&lang=${viewerLang}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.translated_text) setDisplayText(data.translated_text);
      })
      .catch(() => setDisplayText(post.body_original))
      .finally(() => setLoading(false));
  }, [post.id, post.source_lang, post.body_original, viewerLang]);

  async function handleBookmark(topic: string) {
    if (!viewerAlias) return;
    setShowTopicPicker(false);

    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alias: viewerAlias,
        postId: post.id,
        topic,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div
      className={`border p-4 font-mono text-sm transition-all ${
        isBleed
          ? "border-purple-200 bg-purple-50/30 border-l-4 border-l-purple-400"
          : "border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
        <span className="font-bold text-gray-700">{post.alias}</span>
        <TenureBadge tenure={post.tenure} />
        <span className="text-gray-400">
          {LANG_NAMES[post.source_lang] ?? post.source_lang}
        </span>
        <span>{timeAgo(post.created_at)}</span>
        {isBleed && (
          <span className="ml-auto text-purple-600 text-xs">
            from {post.hood.replace(/-/g, " ")}
          </span>
        )}
        {/* Bookmark button */}
        {viewerAlias && (
          <button
            onClick={() => setShowTopicPicker(!showTopicPicker)}
            className={`ml-auto text-xs border px-2 py-0.5 ${
              saved
                ? "bg-purple-800 text-white border-purple-800"
                : "bg-white text-gray-500 border-gray-300 hover:border-purple-400"
            }`}
          >
            {saved ? "saved" : "save"}
          </button>
        )}
      </div>

      {/* Topic picker for bookmark */}
      {showTopicPicker && (
        <div className="flex flex-wrap gap-1 mb-2">
          {TOPIC_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => handleBookmark(t)}
              className="text-xs px-2 py-0.5 border border-gray-300 bg-white text-gray-600 hover:bg-purple-100 hover:border-purple-400"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <p className={loading ? "text-gray-400 animate-pulse" : "text-gray-900"}>
        {displayText}
      </p>
    </div>
  );
}
