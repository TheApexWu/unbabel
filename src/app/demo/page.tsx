"use client";

import { useEffect, useState } from "react";

interface Signal {
  entity_value: string;
  entity_type: string;
  lang_count: number;
  post_count: number;
  languages: string;
  post_ids: string;
}

interface Stats {
  [hood: string]: { posts: number; languages: number };
}

export default function DemoPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [activeSignals, setActiveSignals] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    fetch("/api/signals?hood=jackson-heights")
      .then((r) => r.json())
      .then((data) => {
        setSignals(data.signals ?? []);
      })
      .catch(() => {});

    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        const stats: Stats = data.stats ?? {};
        const hoods = Object.keys(stats);
        let posts = 0;
        for (const h of hoods) {
          posts += stats[h].posts;
        }
        setTotalPosts(posts);
        // active signals = total signals across all fetched data
        setActiveSignals(hoods.length);
      })
      .catch(() => {});
  }, []);

  const top3 = signals.slice(0, 3);

  return (
    <div style={{ background: "#1a1a1a", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(4rem, 10vw, 8rem)",
            color: "#a855f7",
            fontWeight: 400,
            margin: 0,
            lineHeight: 1,
          }}
        >
          unbabel
        </h1>
        <p
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            color: "#d4d4d4",
            marginTop: "1.5rem",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          cross-language intelligence for neighborhoods
        </p>
      </section>

      {/* KEY STATS */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
            maxWidth: "900px",
            width: "100%",
          }}
        >
          {[
            { number: "12", label: "neighborhoods" },
            { number: `${totalPosts || "68"}+`, label: "reports" },
            { number: "13", label: "languages" },
            { number: `${signals.length || "--"}`, label: "active signals" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                border: "1px solid #a855f7",
                padding: "2rem 1rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 700,
                  color: "#a855f7",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1,
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#a3a3a3",
                  marginTop: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP SIGNALS */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            color: "#a855f7",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          live signals from Jackson Heights
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          {top3.length > 0
            ? top3.map((signal) => {
                const langs = signal.languages.split(",");
                return (
                  <div
                    key={signal.entity_value}
                    style={{
                      border: "2px solid #f59e0b",
                      background: "#292211",
                      padding: "2rem",
                      fontFamily: "monospace",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: "#f59e0b",
                          color: "#1a1a1a",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.5rem",
                        }}
                      >
                        SIGNAL
                      </span>
                      <span
                        style={{
                          background: "#7f1d1d",
                          color: "#fca5a5",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.5rem",
                        }}
                      >
                        {signal.lang_count} languages
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#d97706" }}>
                        [{signal.entity_type}]
                      </span>
                      <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#d97706" }}>
                        {signal.post_count} reports
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                        fontWeight: 700,
                        color: "#fbbf24",
                        margin: "0 0 0.75rem 0",
                      }}
                    >
                      {signal.entity_value}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "#fcd34d", margin: "0 0 0.75rem 0", fontStyle: "italic" }}>
                      This pattern was invisible until {signal.lang_count} communities reported independently.
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {langs.map((lang) => (
                        <span
                          key={lang}
                          style={{
                            fontSize: "0.75rem",
                            border: "1px solid #d97706",
                            padding: "0.2rem 0.5rem",
                            color: "#fbbf24",
                          }}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            : (
              <p style={{ color: "#a3a3a3", fontFamily: "monospace", textAlign: "center" }}>
                loading signals...
              </p>
            )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            color: "#a855f7",
            marginBottom: "4rem",
          }}
        >
          how it works
        </h2>
        {[
          { step: "1", text: "post in any language" },
          { step: "2", text: "the system detects cross-language patterns" },
          { step: "3", text: "signals become collective action" },
        ].map((item) => (
          <div
            key={item.step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "3rem",
              maxWidth: "700px",
              width: "100%",
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                color: "#a855f7",
                fontWeight: 700,
                minWidth: "3rem",
                textAlign: "center",
              }}
            >
              {item.step}
            </span>
            <span
              style={{
                fontSize: "clamp(1.2rem, 3vw, 2rem)",
                color: "#e5e5e5",
                textAlign: "left",
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </section>

      {/* PITCH LINES */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          gap: "4rem",
        }}
      >
        {[
          "Every other project builds tools for immigrants to interact with systems. We built a tool for immigrants to interact with each other.",
          "Reddit is consensus. UnBabel is corroboration.",
          "You can't fake a cross-language signal.",
        ].map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: "Georgia, serif",
              fontSize: i === 2 ? "clamp(1.5rem, 4vw, 3rem)" : "clamp(1.2rem, 3vw, 2rem)",
              color: i === 2 ? "#a855f7" : "#e5e5e5",
              maxWidth: "800px",
              lineHeight: 1.5,
              fontWeight: i === 2 ? 700 : 400,
              margin: 0,
            }}
          >
            {line}
          </p>
        ))}
      </section>
    </div>
  );
}
