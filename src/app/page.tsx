"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { NEIGHBORHOODS, SUPPORTED_LANGUAGES } from "@/lib/neighborhoods";
import { LanguagePicker } from "@/components/LanguagePicker";
import { t } from "@/lib/ui-strings";

const NeighborhoodMap = dynamic(() => import("@/components/NeighborhoodMap"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 bg-gray-50 flex items-center justify-center" style={{ height: 400 }}>
      <span className="text-xs text-gray-400">loading map...</span>
    </div>
  ),
});

const HOME_STRINGS: Record<string, Record<string, string>> = {
  en: {
    tagline: "the neighborhood is talking. hear it out.",
    description: "A multilingual bulletin board that detects when immigrant communities across language barriers report the same person, place, or problem.",
    step1title: "1. post in any language",
    step1desc: "write or speak. we detect, translate, and strip personal info in one pass.",
    step2title: "2. read in yours",
    step2desc: "every post appears in the language you choose.",
    step3title: "3. patterns emerge",
    step3desc: "when multiple languages mention the same landlord, clinic, or warning, a signal surfaces it.",
    step4title: "4. save what matters",
    step4desc: "bookmark posts to your tower. they stay even after the feed expires.",
    footer: "no profiles. no DMs. no followers. no algorithm. posts expire in 7 days. you don't need to meet anyone. you just need to hear them.",
  },
  es: {
    tagline: "el barrio esta hablando. escuchalo.",
    description: "Un sistema multilingue que detecta cuando comunidades inmigrantes reportan independientemente a la misma persona, lugar o problema a traves de barreras linguisticas.",
    step1title: "1. publica en cualquier idioma",
    step1desc: "escribe o habla. detectamos, traducimos y eliminamos informacion personal en un solo paso.",
    step2title: "2. lee en el tuyo",
    step2desc: "cada publicacion aparece en el idioma que elijas.",
    step3title: "3. surgen patrones",
    step3desc: "cuando varios idiomas mencionan al mismo casero, clinica o advertencia, una senal lo revela.",
    step4title: "4. guarda lo importante",
    step4desc: "guarda publicaciones en tu torre. permanecen incluso cuando el feed expira.",
    footer: "sin perfiles. sin mensajes directos. sin seguidores. sin algoritmo. las publicaciones expiran en 7 dias. no necesitas conocer a nadie. solo necesitas escucharlos.",
  },
  zh: {
    tagline: "社区在说话。听听看。",
    description: "一个多语言系统，能够检测不同语言的移民社区独立报告同一个人、地点或问题的情况。",
    step1title: "1. 用任何语言发布",
    step1desc: "输入或说话。我们一次性完成检测、翻译和个人信息脱敏。",
    step2title: "2. 用你的语言阅读",
    step2desc: "每条帖子都会显示为你选择的语言。",
    step3title: "3. 模式浮现",
    step3desc: "当多种语言提到同一个房东、诊所或警告时，信号会将其呈现出来。",
    step4title: "4. 保存重要信息",
    step4desc: "将帖子收藏到你的塔中。即使动态过期，收藏依然保留。",
    footer: "没有个人主页。没有私信。没有关注。没有算法。帖子7天后过期。你不需要认识任何人。你只需要听到他们。",
  },
};

function ht(lang: string, key: string): string {
  return HOME_STRINGS[lang]?.[key] ?? HOME_STRINGS.en[key] ?? key;
}

function detectLang(): string {
  if (typeof navigator === "undefined") return "en";
  const raw = navigator.language || "en";
  const prefix = raw.split("-")[0].toLowerCase();
  const supported = SUPPORTED_LANGUAGES.map((l) => l.code);
  if (supported.includes(prefix)) return prefix;
  return "en";
}

export default function Home() {
  const [stats, setStats] = useState<
    Record<string, { posts: number; languages: number }>
  >({});
  const [viewerLang, setViewerLang] = useState("en");

  useEffect(() => {
    setViewerLang(detectLang());
  }, []);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.stats ?? {}))
      .catch(() => {});
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-4">
      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{t(viewerLang, "readingIn")}</span>
          <LanguagePicker current={viewerLang} onChange={setViewerLang} />
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-base text-gray-500 mb-1">
          {ht(viewerLang, "tagline")}
        </p>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          {ht(viewerLang, "description")}
        </p>
      </div>

      <div className="mb-4">
        <NeighborhoodMap />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {NEIGHBORHOODS.map((hood) => {
          const s = stats[hood.slug];
          return (
            <Link
              key={hood.slug}
              href={`/${hood.slug}`}
              className="border border-gray-300 bg-white p-3 hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <span className="text-purple-800 font-bold text-sm block">{hood.name}</span>
              <span className="text-xs text-gray-400">{hood.borough}</span>
              {s && s.posts > 0 && (
                <span className="text-xs text-gray-500 block mt-1">
                  {s.posts} {t(viewerLang, "posts")} / {s.languages} {t(viewerLang, "languages")}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
        <div className="border border-gray-200 bg-gray-50 p-3">
          <strong className="text-gray-700 block mb-1">{ht(viewerLang, "step1title")}</strong>
          {ht(viewerLang, "step1desc")}
        </div>
        <div className="border border-gray-200 bg-gray-50 p-3">
          <strong className="text-gray-700 block mb-1">{ht(viewerLang, "step2title")}</strong>
          {ht(viewerLang, "step2desc")}
        </div>
        <div className="border border-gray-200 bg-gray-50 p-3">
          <strong className="text-gray-700 block mb-1">{ht(viewerLang, "step3title")}</strong>
          {ht(viewerLang, "step3desc")}
        </div>
        <div className="border border-gray-200 bg-gray-50 p-3">
          <strong className="text-gray-700 block mb-1">{ht(viewerLang, "step4title")}</strong>
          {ht(viewerLang, "step4desc")}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400 text-center">
        {ht(viewerLang, "footer")}
      </p>
    </main>
  );
}
