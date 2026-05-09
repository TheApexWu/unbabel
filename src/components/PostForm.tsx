"use client";

import { useState, useRef, useCallback } from "react";

interface ProcessReceipt {
  detected_language: string;
  translated_text: string;
  pii_found: { type: string; original: string }[];
  topics: string[];
  is_safe: boolean;
  cultural_note: string | null;
}

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", zh: "Chinese", ko: "Korean",
  hi: "Hindi", ne: "Nepali", bn: "Bengali", ar: "Arabic",
  tl: "Tagalog", ru: "Russian",
  el: "Greek", pt: "Portuguese", fr: "French",
};

// WebSpeech language codes (Chrome needs full locale)
const SPEECH_LANGS: { code: string; label: string; speech: string }[] = [
  { code: "en", label: "EN", speech: "en-US" },
  { code: "es", label: "ES", speech: "es-MX" },
  { code: "zh", label: "中", speech: "zh-CN" },
  { code: "ko", label: "한", speech: "ko-KR" },
  { code: "hi", label: "हि", speech: "hi-IN" },
  { code: "ne", label: "ने", speech: "ne-NP" },
  { code: "bn", label: "বা", speech: "bn-BD" },
  { code: "ar", label: "ع", speech: "ar-SA" },
  { code: "tl", label: "TL", speech: "tl-PH" },
  { code: "ru", label: "RU", speech: "ru-RU" },
  { code: "el", label: "EL", speech: "el-GR" },
  { code: "pt", label: "PT", speech: "pt-BR" },
  { code: "fr", label: "FR", speech: "fr-FR" },
];

export function PostForm({
  hood,
  onPosted,
}: {
  hood: string;
  onPosted: (alias?: string) => void;
}) {
  const [text, setText] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<ProcessReceipt | null>(null);
  const [listening, setListening] = useState(false);
  const [speechLang, setSpeechLang] = useState("en-US");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = speechLang;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [speechLang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !phone.trim()) return;

    setSubmitting(true);
    setError("");
    setReceipt(null);

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), phone: phone.trim(), hood }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to post");
        return;
      }

      const data = await res.json();

      setReceipt({
        detected_language: data.detected_language,
        translated_text: data.translated_text,
        pii_found: data.pii_found ?? [],
        topics: data.topics ?? [],
        is_safe: data.is_safe,
        cultural_note: data.cultural_note ?? null,
      });

      setText("");
      const postedAlias = data.alias as string | undefined;

      setTimeout(() => {
        setReceipt(null);
        onPosted(postedAlias);
      }, 4000);
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="border border-gray-400 bg-gray-50 p-4 font-mono"
      >
        <div className="mb-2">
          <input
            type="text"
            placeholder="phone (for anonymous identity only)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 px-2 py-1 text-sm bg-white"
          />
          <p className="text-xs text-gray-400 mt-1">
            hashed into an anonymous alias. never stored. never displayed.
          </p>
        </div>
        <textarea
          placeholder="write or speak in any language..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 px-2 py-1 text-sm bg-white mb-2"
        />

        {/* Voice input controls */}
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className={`px-3 py-1 text-xs font-mono border ${
              listening
                ? "bg-red-600 text-white border-red-600 animate-pulse"
                : "bg-white text-gray-700 border-gray-400 hover:border-purple-400"
            }`}
          >
            {listening ? "stop" : "speak"}
          </button>
          <select
            value={speechLang}
            onChange={(e) => setSpeechLang(e.target.value)}
            className="text-xs border border-gray-300 bg-white px-1 py-1 font-mono"
          >
            {SPEECH_LANGS.map((l) => (
              <option key={l.code} value={l.speech}>
                {l.label}
              </option>
            ))}
          </select>
          {listening && (
            <span className="text-xs text-red-600">listening...</span>
          )}
        </div>

        {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !text.trim() || !phone.trim()}
          className="bg-purple-800 text-white px-4 py-1 text-sm font-mono hover:bg-purple-900 disabled:opacity-50"
        >
          {submitting ? "processing..." : "post to the block"}
        </button>
      </form>

      {/* Processing Receipt */}
      {receipt && (
        <div className="mt-2 border border-green-300 bg-green-50 p-3 font-mono text-xs animate-pulse">
          <div className="text-green-800 font-bold mb-1">
            pipeline receipt
          </div>
          <div className="space-y-1 text-green-700">
            <div>
              <span className="text-green-500">lang:</span>{" "}
              {LANG_NAMES[receipt.detected_language] ?? receipt.detected_language}
            </div>
            {receipt.detected_language !== "en" && (
              <div>
                <span className="text-green-500">translated:</span>{" "}
                {receipt.translated_text}
              </div>
            )}
            <div>
              <span className="text-green-500">pii_stripped:</span>{" "}
              {receipt.pii_found.length > 0
                ? receipt.pii_found.map((p) => `[${p.type}]`).join(" ")
                : "none found"}
            </div>
            <div>
              <span className="text-green-500">toxicity:</span>{" "}
              {receipt.is_safe ? "clear" : "flagged"}
            </div>
            <div>
              <span className="text-green-500">topics:</span>{" "}
              {receipt.topics.length > 0 ? receipt.topics.join(", ") : "general"}
            </div>
            {receipt.cultural_note && (
              <div>
                <span className="text-green-500">cultural_note:</span>{" "}
                {receipt.cultural_note}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
