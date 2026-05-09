# UnBabel

**Cross-language intelligence for immigrant neighborhoods.**

Reddit aggregates opinions. We aggregate evidence.

## What It Does

Post in any language. Read in yours. When multiple languages independently mention the same person, place, or issue, UnBabel surfaces it as a signal -- a cross-language pattern nobody could see alone. One click files a formal complaint.

- 12 NYC neighborhoods, 68+ reports, 13 languages
- Signals-first layout: cross-language entity clustering as hero content
- Signal strength: 2 languages = pattern, 5+ = strong corroboration
- Cross-neighborhood tracking: serial predators can't hide behind geography
- One-click complaint links to NYC 311, DOL, DCA
- Tavily web enrichment for real-world context on signals
- Full UI translation (EN/ES/ZH): every label, button, and header translates
- Pre-cached translations for instant language switching
- Voice input, anonymous identity (phone hashed, never stored), 7-day expiry
- Tower of Babel: persistent pyramid-shaped bookmarks by topic
- Single-inference LLM pipeline: 7 tasks per post in one call

## How to Run

```bash
npm install
npm run build && npm start
```

DB auto-seeds on first access. No manual seeding needed.

Create `.env.local` with API keys (ask Alex):
```
FEATHERLESS_API_KEY=...
TAVILY_API_KEY=...
```

## Technical Architecture

```
User report (text/voice) -> /api/post -> Single LLM call (Featherless Qwen2.5-72B)
  -> 7 outputs: detect, translate, PII strip, moderate, entity extract, topic, cultural note
  -> SQLite (posts + entities + translations cache)
  -> Cross-language entity clustering (SQL aggregation)
  -> Signal cards surface patterns across language barriers
  -> One-click complaint filing (NYC 311/DOL/DCA)
```

## Trust Model

We don't moderate. We don't vote. Independent corroboration across language barriers IS the validation. You can't fake a cross-language signal.

## Pages

| Route | What |
|---|---|
| `/` | Homepage with interactive map |
| `/[hood]` | Signals-first feed with cross-language patterns |
| `/[hood]/directory` | Local resources with language switching |
| `/tower/[alias]` | Pyramid-shaped persistent bookmarks |
| `/demo` | Full-screen pitch deck |

## Team

Built at Build for the Border hackathon, May 9 2026.

See [HACKATHON.md](HACKATHON.md) for full documentation.
