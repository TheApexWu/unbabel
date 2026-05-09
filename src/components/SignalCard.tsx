"use client";

import { useState, useEffect } from "react";

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

interface EnrichResult {
  title: string;
  url: string;
  content: string;
}

function getComplaintUrl(entityType: string, entityValue: string): { url: string; label: string } {
  const val = entityValue.toLowerCase();

  if (entityType === "issue") {
    if (/rent|landlord|no hot water|heat/.test(val)) {
      return { url: "https://portal.311.nyc.gov/sr-step/?id=5887c3f4-df69-ee11-a204-0af34963091e", label: "file housing complaint with NYC 311" };
    }
    if (/overcharging|scam|hidden fees/.test(val)) {
      return { url: "https://www.nyc.gov/site/dca/consumers/file-complaint.page", label: "file complaint with NYC consumer affairs" };
    }
    if (/wage|job/.test(val)) {
      return { url: "https://dol.ny.gov/unpaidwithheld-wages-and-wage-supplements", label: "file wage theft complaint with NY DOL" };
    }
  }

  if (entityType === "business") {
    return { url: "https://portal.311.nyc.gov/", label: "file business complaint with NYC 311" };
  }

  if (entityType === "street" && /dangerous|intersection/.test(val)) {
    return { url: "https://portal.311.nyc.gov/", label: "report street condition to NYC 311" };
  }

  return { url: "https://portal.311.nyc.gov/", label: "file complaint with NYC 311" };
}

function SignalStrength({ langCount }: { langCount: number }) {
  const barClass = "inline-block w-1.5 h-4 rounded-sm mr-0.5";
  if (langCount >= 5) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="inline-flex items-end">
          <span className={`${barClass} bg-red-500 h-2.5`} />
          <span className={`${barClass} bg-red-500 h-3.5`} />
          <span className={`${barClass} bg-red-500 h-4`} />
        </span>
        <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
          strong corroboration
        </span>
      </span>
    );
  }
  if (langCount >= 3) {
    return (
      <span className="inline-flex items-end">
        <span className={`${barClass} bg-orange-400 h-2.5`} />
        <span className={`${barClass} bg-orange-400 h-3.5`} />
      </span>
    );
  }
  return (
    <span className="inline-flex items-end">
      <span className={`${barClass} bg-yellow-400 h-2.5`} />
    </span>
  );
}

export function SignalCard({ signal, hood, viewerLang }: { signal: Signal; hood?: string; viewerLang?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [enrichResults, setEnrichResults] = useState<EnrichResult[] | null>(null);
  const [enrichLoading, setEnrichLoading] = useState(false);
  const [translations, setTranslations] = useState<Record<number, string>>({});
  // Fetch translations for contributing posts when expanded
  useEffect(() => {
    if (!expanded || !viewerLang || !signal.posts) return;
    for (const post of signal.posts) {
      if (post.source_lang !== viewerLang && !translations[post.id]) {
        fetch(`/api/translate?postId=${post.id}&lang=${viewerLang}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.translated_text) {
              setTranslations((prev) => ({ ...prev, [post.id]: data.translated_text }));
            }
          })
          .catch(() => {});
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, viewerLang]);

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
          <SignalStrength langCount={signal.lang_count} />
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
          Independent reports from people who cannot read each other. Corroboration, not consensus.
        </p>
        <p className="text-[11px] italic text-amber-800 mb-2">
          This pattern was invisible until {signal.lang_count} communities reported independently.
        </p>
        <div className="flex gap-2 flex-wrap">
          {(() => {
            // Count posts per language for privacy protection
            const langPostCounts: Record<string, number> = {};
            if (signal.posts) {
              for (const post of signal.posts) {
                langPostCounts[post.source_lang] = (langPostCounts[post.source_lang] || 0) + 1;
              }
            }
            const hasCounts = Object.keys(langPostCounts).length > 0;
            const safeLangs = hasCounts
              ? langs.filter((lang) => (langPostCounts[lang] || 0) >= 2)
              : langs; // fallback: show all if no posts data
            const hiddenCount = hasCounts
              ? langs.filter((lang) => (langPostCounts[lang] || 0) === 1).length
              : 0;
            return (
              <>
                {safeLangs.map((lang) => (
                  <span
                    key={lang}
                    className="text-xs border border-amber-300 bg-white px-2 py-0.5 text-amber-800"
                  >
                    {LANG_NAMES[lang] ?? lang}
                  </span>
                ))}
                {hiddenCount > 0 && (
                  <span className="text-xs border border-amber-300 bg-amber-100 px-2 py-0.5 text-amber-600 italic">
                    +{hiddenCount} other language{hiddenCount > 1 ? "s" : ""}
                  </span>
                )}
              </>
            );
          })()}
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
              {translations[post.id] && (
                <p className="text-gray-500 text-[11px] mt-1 italic">{translations[post.id]}</p>
              )}
            </div>
          ))}

          {/* Enrich button + results */}
          <div onClick={(e) => e.stopPropagation()}>
            {!enrichResults && (
              <button
                disabled={enrichLoading}
                onClick={async () => {
                  setEnrichLoading(true);
                  try {
                    const params = new URLSearchParams({
                      entity: signal.entity_value,
                      type: signal.entity_type,
                    });
                    if (hood) params.set("hood", hood);
                    const res = await fetch(`/api/enrich?${params}`);
                    const data = await res.json();
                    setEnrichResults(data.results ?? []);
                  } catch {
                    setEnrichResults([]);
                  } finally {
                    setEnrichLoading(false);
                  }
                }}
                className="mt-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                {enrichLoading ? "searching..." : "find more context"}
              </button>
            )}

            {enrichResults && enrichResults.length > 0 && (
              <div className="mt-3 border-2 border-indigo-300 bg-indigo-50 p-3 space-y-2">
                <p className="text-xs text-indigo-700 font-bold uppercase tracking-wide">
                  web context
                </p>
                {enrichResults.map((r, i) => (
                  <div key={i} className="bg-white border border-indigo-200 p-2">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-indigo-700 underline hover:text-indigo-900"
                    >
                      {r.title}
                    </a>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {r.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {enrichResults && enrichResults.length === 0 && (
              <p className="mt-3 text-xs text-indigo-500 font-mono">
                no web results found for this signal.
              </p>
            )}
          </div>

          {/* Take action -- only for 3+ languages */}
          {signal.lang_count >= 3 && (() => {
            const complaint = getComplaintUrl(signal.entity_type, signal.entity_value);
            return (
              <div className="border-t border-amber-300 bg-amber-100/30 p-3 mt-2" onClick={(e) => e.stopPropagation()}>
                <p className="text-xs text-amber-800 font-bold uppercase tracking-wide mb-2">
                  take action
                </p>
                <p className="text-xs text-amber-700 mb-2">
                  {signal.lang_count} independent communities flagged this. File a formal complaint:
                </p>
                <a href={complaint.url} target="_blank" rel="noopener noreferrer"
                   className="inline-block bg-purple-800 text-white text-xs font-mono px-4 py-2 hover:bg-purple-900"
                   onClick={(e) => e.stopPropagation()}>
                  {complaint.label}
                </a>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
