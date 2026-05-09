"use client";

import { useState } from "react";

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", zh: "Chinese", ko: "Korean",
  hi: "Hindi", ne: "Nepali", bn: "Bengali", ar: "Arabic",
  tl: "Tagalog", ru: "Russian", el: "Greek", pt: "Portuguese", fr: "French",
};

const TYPE_LABELS: Record<string, string> = {
  street: "location",
  business: "business",
  org: "organization",
  issue: "issue",
};

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

export function SignalCard({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false);
  const langs = signal.languages.split(",");
  const typeLabel = TYPE_LABELS[signal.entity_type] ?? signal.entity_type;

  return (
    <div
      className="border-2 border-amber-400 bg-amber-50 font-mono text-sm cursor-pointer transition-all hover:border-amber-500"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5">
            SIGNAL
          </span>
          <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5">
            {signal.lang_count} languages
          </span>
          <span className="text-xs text-amber-700">
            [{typeLabel}]
          </span>
          <span className="ml-auto text-xs text-amber-600">
            {expanded ? "collapse" : `${signal.post_count} reports`}
          </span>
        </div>
        <p className="text-amber-900 font-bold text-base mb-2">
          {signal.entity_value}
        </p>
        <p className="text-xs text-amber-700 mb-2">
          {signal.post_count} independent reports across {signal.lang_count} languages mention this {typeLabel}.
          No reporter can read the others.
        </p>
        <div className="flex gap-2 flex-wrap">
          {langs.map((lang) => (
            <span
              key={lang}
              className="text-xs border border-amber-300 bg-white px-2 py-0.5 text-amber-800"
            >
              {LANG_NAMES[lang] ?? lang}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded: show contributing posts */}
      {expanded && signal.posts && signal.posts.length > 0 && (
        <div className="border-t-2 border-amber-300 bg-amber-100/50 p-4 space-y-3">
          <p className="text-xs text-amber-700 font-bold uppercase tracking-wide">
            contributing reports
          </p>
          {signal.posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-amber-200 p-3 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-1 text-amber-600">
                <span className="font-bold">{post.alias}</span>
                <span className="border border-amber-200 px-1">
                  {LANG_NAMES[post.source_lang] ?? post.source_lang}
                </span>
                <span className="text-amber-400">
                  {post.hood.replace(/-/g, " ")}
                </span>
              </div>
              <p className="text-gray-800">{post.body_original}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
