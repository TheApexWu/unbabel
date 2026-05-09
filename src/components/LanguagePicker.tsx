"use client";

import { SUPPORTED_LANGUAGES } from "@/lib/neighborhoods";

export function LanguagePicker({
  current,
  onChange,
}: {
  current: string;
  onChange: (lang: string) => void;
}) {
  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-gray-400 text-sm font-mono px-2 py-1 text-gray-700"
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
