"use client";

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", zh: "Chinese", ko: "Korean",
  hi: "Hindi", ne: "Nepali", bn: "Bengali", ar: "Arabic",
  tl: "Tagalog", ru: "Russian",
};

const TYPE_LABELS: Record<string, string> = {
  street: "location",
  business: "business",
  org: "organization",
  issue: "issue",
};

interface Signal {
  entity_value: string;
  entity_type: string;
  lang_count: number;
  post_count: number;
  languages: string;
  post_ids: string;
}

export function SignalCard({ signal }: { signal: Signal }) {
  const langs = signal.languages.split(",");
  const typeLabel = TYPE_LABELS[signal.entity_type] ?? signal.entity_type;

  return (
    <div className="border-2 border-amber-400 bg-amber-50 p-4 font-mono text-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5">
          {signal.lang_count} languages, {signal.post_count} posts
        </span>
        <span className="text-xs text-amber-700">
          [{typeLabel}]
        </span>
      </div>
      <p className="text-amber-900 font-bold mb-2">
        Multiple posts mention: {signal.entity_value}
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
  );
}
