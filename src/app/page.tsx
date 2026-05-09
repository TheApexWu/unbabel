"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

const HoodMap = dynamic(() => import("@/components/NeighborhoodMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        aspectRatio: "4 / 5",
        border: "1px solid var(--ink)",
        background: "var(--paper-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--ink-3)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      loading map…
    </div>
  ),
});

type Lang = "en" | "es" | "zh" | "bn";
type Stats = Record<string, { posts: number; languages: number }>;

const T = (en: string, es: string, zh: string, bn: string) => ({ en, es, zh, bn });
const t = (obj: Record<Lang, string>, lang: Lang) => obj[lang] || obj.en;

const HERO_DISPATCH = {
  id: "CITY-247-A",
  topic: T("free esl", "clases gratis de ingles", "免费英语课", "বিনামূল্যে ইংরেজি ক্লাস"),
  summary: T(
    "Reported across 4 neighborhoods in 3 languages. Independent voices, separate languages, same need. This is not a local issue — it is a city-level pattern.",
    "Reportado en 4 vecindarios en 3 idiomas. Voces independientes, idiomas distintos, una misma necesidad. Esto no es un asunto local — es un patrón a nivel de ciudad.",
    "在 4 个社区，3 种语言中均有报告。独立的声音，不同的语言，同一种需要。这不是局部问题——这是全市范围的模式。",
    "৩টি ভাষায় ৪টি পাড়ায় রিপোর্ট হয়েছে। স্বাধীন কণ্ঠ, ভিন্ন ভাষা, একই প্রয়োজন। এটি স্থানীয় সমস্যা নয় — এটি শহর পর্যায়ের প্যাটার্ন।"
  ),
  nbhds: ["jackson heights", "flushing", "bushwick", "corona"],
  languages: [
    { code: "es", name: "Español", count: 6, ratio: 1.0 },
    { code: "zh", name: "中文", count: 4, ratio: 0.66 },
    { code: "bn", name: "বাংলা", count: 2, ratio: 0.33 },
  ],
  reportCount: 12,
};

const SIDE_DISPATCHES = [
  {
    id: "JH-247-B",
    topic: T("document help", "ayuda con documentos", "文件帮助", "কাগজপত্রে সাহায্য"),
    where: "jackson heights",
    langs: 2,
    reports: 3,
  },
  {
    id: "WH-247-C",
    topic: T("rent threats", "amenazas del casero", "房东威胁", "বাড়িওয়ালার হুমকি"),
    where: "washington heights",
    langs: 2,
    reports: 4,
  },
  {
    id: "BW-247-D",
    topic: T("clinic shut", "clínica cerrada", "诊所关门", "ক্লিনিক বন্ধ"),
    where: "bushwick",
    langs: 2,
    reports: 2,
  },
];

const TICKER_ITEMS = [
  { lang: "ES", text: "Hay un mercado los domingos en el parque, productos frescos baratos." },
  { lang: "ZH", text: "法拉盛的免费法律咨询星期三下午开门。" },
  { lang: "BN", text: "কেউ কি জানেন Corona-র কাছে ESL ক্লাস কোথায়?" },
  { lang: "EN", text: "The pharmacy on Roosevelt charges way more than the one on 82nd." },
  { lang: "UR", text: "بچوں کے لیے مفت ویکسین جمعرات کو۔" },
  { lang: "ES", text: "Cuidado con el landlord en la 80 — no devuelve depositos." },
];

// Map coordinates (1000x1000 viewBox) for the 8 hoods
const HOOD_COORDS: Record<string, { cx: number; cy: number }> = {
  "jackson-heights": { cx: 660, cy: 380 },
  flushing: { cx: 770, cy: 360 },
  "washington-heights": { cx: 470, cy: 280 },
  "sunset-park": { cx: 540, cy: 600 },
  bushwick: { cx: 615, cy: 540 },
  astoria: { cx: 580, cy: 400 },
  corona: { cx: 690, cy: 410 },
  "east-harlem": { cx: 510, cy: 340 },
};

// Signal classification for landing display
const HOOD_SIGNAL: Record<string, "city" | "nbhd" | null> = {
  "jackson-heights": "city",
  flushing: "nbhd",
  "washington-heights": "nbhd",
  bushwick: "nbhd",
  corona: "nbhd",
  "sunset-park": null,
  astoria: null,
  "east-harlem": null,
};

function Masthead({
  lang,
  onLangChange,
}: {
  lang: Lang;
  onLangChange: (l: Lang) => void;
}) {
  const today = useMemo(() => {
    const d = new Date("2026-05-09");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <div className="masthead-meta">
          <div className="row">
            <b>VOL. 1</b> · ISSUE 247
          </div>
          <div className="row">{today}</div>
          <div className="row">NYC EDITION</div>
        </div>
        <h1 className="masthead-title">
          <em>un</em>babel<span className="dot" />
        </h1>
        <div className="masthead-right">
          <div className="row" style={{ marginBottom: 4 }}>
            READING IN
          </div>
          <div className="lang-switch">
            {(
              [
                ["en", "EN"],
                ["es", "ES"],
                ["zh", "ZH"],
                ["bn", "BN"],
              ] as [Lang, string][]
            ).map(([code, label]) => (
              <button
                key={code}
                className={lang === code ? "active" : ""}
                onClick={() => onLangChange(code)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="masthead-tagline">the neighborhood is talking. hear it out.</p>
    </header>
  );
}

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {items.map((it, i) => (
          <span className="ticker-item" key={i}>
            <span className="lang-tag">{it.lang}</span>
            <span>{it.text}</span>
            <span style={{ color: "rgba(244,239,230,0.4)" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function StaffBar() {
  const sigCount = Object.values(HOOD_SIGNAL).filter(Boolean).length;
  const cityCount = Object.values(HOOD_SIGNAL).filter((s) => s === "city").length;
  return (
    <div className="staffbar">
      <div className="staffbar-inner">
        <div className="pulse-row">
          <span className="pulse">
            <span className="pulse-dot city" />
            {cityCount} city-level signal
          </span>
          <span className="pulse">
            <span className="pulse-dot" />
            {sigCount - cityCount} neighborhood signals
          </span>
          <span>22 raw reports past 24h</span>
          <span>9 active languages</span>
        </div>
        <div>posts expire in 7 days</div>
      </div>
    </div>
  );
}

function LangMeter({
  languages,
  city,
}: {
  languages: { code: string; name: string; count: number; ratio: number }[];
  city?: boolean;
}) {
  return (
    <div className="meter-block">
      <div className="meter-label">LANGUAGE SIGNAL · {languages.length} VOICES</div>
      {languages.map((l) => (
        <div className="meter-row" key={l.code}>
          <span className="lang-name">{l.name}</span>
          <div className="meter-track">
            <div
              className={`meter-fill ${city ? "city" : ""}`}
              style={{ ["--w" as string]: l.ratio } as React.CSSProperties}
            />
          </div>
          <span className="count">{l.count}</span>
        </div>
      ))}
    </div>
  );
}

function MapView({ onSelectNbhd }: { onSelectNbhd: (slug: string) => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const active = NEIGHBORHOODS.filter((n) => HOOD_SIGNAL[n.slug] && HOOD_COORDS[n.slug]);

  return (
    <div className="map-wrap">
      <svg className="map-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="0" width="1000" height="1000" className="map-water" />
        {/* Land masses */}
        <path
          d="M0 100 L380 80 L360 200 L340 320 L310 460 L280 580 L240 720 L180 880 L0 1000 Z"
          className="map-land"
        />
        <path
          d="M455 200 L505 220 L520 320 L525 460 L510 560 L485 600 L470 580 L450 460 L445 340 Z"
          className="map-land"
        />
        <path
          d="M495 100 L640 80 L660 160 L640 220 L580 240 L540 220 L505 200 L500 130 Z"
          className="map-land"
        />
        <path
          d="M540 240 L820 200 L910 240 L1000 280 L1000 1000 L580 1000 L500 920 L480 800 L500 680 L520 580 L545 460 L555 360 L555 280 Z"
          className="map-land"
        />
        <path d="M180 880 L460 1000 L380 940 L300 920 L220 920 Z" className="map-land" />

        {/* Parks */}
        <ellipse cx="490" cy="400" rx="14" ry="78" className="map-park" />
        <ellipse cx="600" cy="660" rx="44" ry="34" className="map-park" />
        <path d="M650 470 L740 450 L780 510 L760 560 L680 560 Z" className="map-park" />

        {/* Roads */}
        <path d="M0 380 L1000 360" className="map-road" strokeWidth="1.5" />
        <path d="M0 540 L1000 560" className="map-road" strokeWidth="1.5" />
        <path d="M0 720 L1000 700" className="map-road" strokeWidth="1.2" />
        <path d="M400 100 L420 1000" className="map-road" strokeWidth="1.2" />
        <path d="M620 100 L640 1000" className="map-road" strokeWidth="1.5" />
        <path d="M820 200 L800 1000" className="map-road" strokeWidth="1.2" />
        <path d="M460 200 L600 320 L820 420 L990 540" className="map-road" strokeWidth="1.5" />

        {/* Labels */}
        <text x="200" y="600" className="map-label-big">JERSEY</text>
        <text x="500" y="660" className="map-label-big">NEW YORK</text>
        <text x="600" y="160" className="map-label">Bronx</text>
        <text x="850" y="350" className="map-label">Queens</text>
        <text x="700" y="850" className="map-label">Brooklyn</text>

        {/* Signal dots */}
        {active.map((n) => {
          const { cx, cy } = HOOD_COORDS[n.slug];
          const isActive = hover === n.slug;
          const r = isActive ? 14 : 11;
          const isCity = HOOD_SIGNAL[n.slug] === "city";
          return (
            <g
              key={n.slug}
              onClick={() => onSelectNbhd(n.slug)}
              onMouseEnter={() => setHover(n.slug)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={cx}
                cy={cy}
                className={`signal-ring ${isCity ? "city" : ""}`}
                style={{ animationDelay: `${(cx * 7 + cy * 3) % 2400}ms` }}
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                className={`signal-dot ${isActive ? "active" : ""} ${isCity ? "city" : ""}`}
              />
            </g>
          );
        })}
      </svg>

      {hover &&
        (() => {
          const n = NEIGHBORHOODS.find((x) => x.slug === hover);
          const c = HOOD_COORDS[hover];
          if (!n || !c) return null;
          const left = (c.cx / 1000) * 100;
          const top = (c.cy / 1000) * 100;
          return (
            <div className="map-tooltip" style={{ left: `${left}%`, top: `${top}%` }}>
              <span className="t">{n.name}</span>
              <span className="s">{n.borough}</span>
            </div>
          );
        })()}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [stats, setStats] = useState<Stats>({});

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.stats ?? {}))
      .catch(() => {});
  }, []);

  const goto = (slug: string) => router.push(`/${slug}`);

  const activeCount = NEIGHBORHOODS.filter((n) => (stats[n.slug]?.posts ?? 0) > 0).length;

  return (
    <>
      <Masthead lang={lang} onLangChange={setLang} />
      <Ticker />
      <StaffBar />

      <div className="container">
        <section className="lead-section">
          <div className="section-mark">
            <h2>Today&rsquo;s Dispatches</h2>
            <span className="sub">cross-language patterns · live</span>
          </div>
          <div className="lead-grid">
            <div className="dispatch-hero" onClick={() => goto("jackson-heights")}>
              <div className="id">
                DISPATCH NO. {HERO_DISPATCH.id} · CITY-LEVEL SIGNAL · {HERO_DISPATCH.reportCount} REPORTS
              </div>
              <h3>{t(HERO_DISPATCH.topic, lang)}</h3>
              <p className="summary">{t(HERO_DISPATCH.summary, lang)}</p>
              <LangMeter languages={HERO_DISPATCH.languages} city />
              <div className="nbhd-chips">
                {HERO_DISPATCH.nbhds.map((n) => (
                  <span className="nbhd-chip" key={n}>
                    ◯ {n}
                  </span>
                ))}
              </div>
            </div>
            <div className="dispatch-side">
              {SIDE_DISPATCHES.map((d) => (
                <div
                  className="dispatch-mini"
                  key={d.id}
                  onClick={() => goto("jackson-heights")}
                >
                  <div className="id">
                    DISPATCH {d.id} · {d.reports} REPORTS
                  </div>
                  <h4>{t(d.topic, lang)}</h4>
                  <div className="meta">
                    {d.where} · {d.langs} languages
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="index-section">
          <div style={{ aspectRatio: "4 / 5", border: "1px solid var(--ink)", overflow: "hidden" }}>
            <HoodMap />
          </div>
          <div>
            <div className="section-mark">
              <h2>Neighborhoods</h2>
              <span className="sub">{activeCount} active</span>
            </div>
            <div className="nbhd-table">
              <div className="nbhd-table-head">
                <div>Place</div>
                <div>Borough</div>
                <div>Posts · Langs</div>
                <div />
              </div>
              {NEIGHBORHOODS.map((n) => {
                const s = stats[n.slug];
                const posts = s?.posts ?? 0;
                const langs = s?.languages ?? 0;
                const sig = HOOD_SIGNAL[n.slug];
                return (
                  <button
                    key={n.slug}
                    className="nbhd-row"
                    disabled={posts === 0}
                    onClick={() => posts > 0 && goto(n.slug)}
                  >
                    <span className="name">
                      <span
                        className={`row-pulse ${
                          sig === "city" ? "city" : sig === "nbhd" ? "" : "none"
                        }`}
                      />
                      {n.name}
                    </span>
                    <span className="borough">{n.borough}</span>
                    <span className="stats">{posts > 0 ? `${posts} · ${langs}` : "—"}</span>
                    <span className="arrow">{posts > 0 ? "→" : ""}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="how-section">
          <div className="section-mark">
            <h2>How it works</h2>
            <span className="sub">four steps · zero accounts</span>
          </div>
          <div className="how-grid">
            <div className="how-step">
              <div className="num">i.</div>
              <h4>post in any language</h4>
              <p>write or speak. we detect, translate, and strip personal info in one pass.</p>
            </div>
            <div className="how-step">
              <div className="num">ii.</div>
              <h4>read in yours</h4>
              <p>every post appears in the language you choose, with the original kept intact.</p>
            </div>
            <div className="how-step">
              <div className="num">iii.</div>
              <h4>patterns emerge</h4>
              <p>
                when separate languages mention the same landlord, clinic, or warning, a signal
                surfaces.
              </p>
            </div>
            <div className="how-step">
              <div className="num">iv.</div>
              <h4>save what matters</h4>
              <p>bookmark dispatches to your tower. they stay even after the feed expires.</p>
            </div>
          </div>
        </section>

        <section className="closer">
          <p>
            no profiles. no DMs. no followers. no algorithm. posts expire in seven days. you don&rsquo;t
            need to meet anyone — you just need to hear them.
          </p>
        </section>

        <div className="colophon">
          <b>unbabel</b> · nyc 2026 · no profiles · no DMs · no algorithm · posts expire in 7 days
        </div>
      </div>
    </>
  );
}
