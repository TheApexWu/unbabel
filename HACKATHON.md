# UnBabel -- Build for the Border Hackathon

**Last updated: May 9 2026, 2:15 PM ET**

## What Is This

**A neighborhood bulletin board where language doesn't matter.**

NYC has 800 languages. WeChat, WhatsApp, KakaoTalk connect people vertically (Chinese to Chinese, Dominican to Dominican). UnBabel connects horizontally -- everyone on the same block, regardless of language.

Post in any language. Read in yours. The system detects when multiple languages mention the same person, place, or issue -- and surfaces it as a signal. Nobody voted. Nobody moderated. Independent corroboration across language barriers.

**One-liner:** "Three people post about the same landlord in three languages. None of them can read each other. UnBabel connects the dots."

---

## Team

| Name | GitHub | Role |
|------|--------|------|
| Alex Wu | TheApexWu | Architect, lead dev, pitch |
| Isayah | isayahc | Frontend auditor, feature branches |
| Song | ysongh | Backend auditor, feature branches |
| Moyan | vava484 | Data analytics (ex-Meta) |
| Xinning Zhang | xinningzhang | VC, pitch/strategy, co-presenter |

### Zhang's Role (READ THIS XINNING)

You are co-presenting. You need to understand:

1. **What the product does:** People post neighborhood tips/warnings in any language. The system translates everything so everyone reads in their own language. When 3+ languages independently mention the same landlord/clinic/issue, UnBabel surfaces a SIGNAL CARD -- a cross-language pattern nobody could see alone.

2. **Why it matters:** Immigrants already have community groups (WhatsApp, WeChat). But those are siloed by language. The Bengali group and the Mexican group in the same building never cross. UnBabel is the only place where their signals merge.

3. **The trust model:** "We don't moderate. We don't vote. Three strangers who can't read each other named the same landlord independently. That's not an accusation -- that's a pattern. UnBabel doesn't ask you to trust people. It asks you to trust the math."

4. **Key pitch lines:**
   - "Every other project builds tools for immigrants to interact with systems. We built a tool for immigrants to interact with each other."
   - "The neighborhood is talking. Now everyone on the block hears the same thing."
   - "This pattern was invisible until 6 communities reported independently."

5. **Q&A you might field:**
   - "Why not just use Google Translate?" -- Google translates text. We translate neighborhoods. The signal detection is what no translation tool does.
   - "How do you get users?" -- Partner with one church, one legal clinic. They already have multilingual foot traffic and paper bulletin boards. We digitize what's already happening.
   - "What about fake reports?" -- You can't fake cross-language corroboration. You'd need multiple phones AND fluency in multiple languages AND the AI would have to extract matching entities.

---

## What's Built (as of 2:15 PM May 9)

### Architecture

```
Next.js 16 + SQLite (better-sqlite3) + Tailwind CSS
                    |
            Single LLM inference call per post
    (detect + translate + PII strip + moderate + entity extract + topic + cultural note)
                    |
            Featherless.ai (Qwen2.5-72B, sponsor credits) OR Ollama (local fallback)
                    |
            Cross-language entity clustering (SQL)
                    |
            Tavily web search enrichment (sponsor credits)
```

### Current Stats

- 8 neighborhoods, 54 seed posts, 23 directory entries
- 13 languages: EN, ES, ZH, KO, RU, BN, HI, AR, TL, NE, EL, PT, FR
- 10+ active signal clusters in Jackson Heights alone
- "free esl" signal: 6 languages, 8 independent reports

### Pages

| Route | What it does |
|-------|-------------|
| `/` | Homepage. Craigslist-style neighborhood links with post/language counts. |
| `/[hood]` | **Signals-first feed.** Cross-language patterns as hero content. Posts collapsed below as "raw reports." |
| `/[hood]/directory` | Business/org directory with language switching. |
| `/tower/[alias]` | Personal bookmarks organized by topic floors. Persistent. |

### API Routes

| Route | Method | What it does |
|-------|--------|-------------|
| `/api/post` | POST | Submit report. Full LLM pipeline. Returns processing receipt. |
| `/api/feed` | GET | Posts for neighborhood(s) + bleed-in from adjacent. |
| `/api/translate` | GET | On-demand translation. Cached. |
| `/api/signals` | GET | Cross-language signal clusters + cross-neighborhood signals. |
| `/api/enrich` | GET | Tavily web search for signal context (news, complaints, records). |
| `/api/bookmarks` | GET/POST | Tower bookmark management. |
| `/api/seed` | POST | Seed DB with demo data. |
| `/api/directory` | GET | Directory listings by neighborhood + category. |
| `/api/translate-directory` | POST | Directory entry translation with caching. |
| `/api/stats` | GET | Post count + language count per neighborhood. |

### Key Features

1. **Signals-first layout**: Neighborhood pages open to cross-language signal clusters, not a post feed. Posts are "raw reports" collapsed below. The product is the patterns, not the posts.

2. **Signal strength indicator**: 2 languages = yellow, 3-4 = orange, 5+ = red "NEIGHBORHOOD CONSENSUS." Visual gravity of cross-language agreement.

3. **Cross-neighborhood signals**: Entities appearing in 2+ neighborhoods get a red "CITY-LEVEL SIGNAL" card. Serial predators can't hide behind geographic silos.

4. **Privacy-safe language badges**: Language badges on signals only show when 2+ posts exist in that language. Prevents "only Bengali speaker in the building" identification.

5. **Tavily enrichment**: Click "enrich" on a signal to pull real web context (news, complaints, public records) via Tavily API.

6. **Auto-detect viewer language**: Browser locale auto-sets reading language. A Spanish speaker's phone shows everything in Spanish automatically.

7. **Single-inference pipeline**: One LLM call per post does 7 things: language detection, meaning-based translation, PII stripping, immigrant-aware moderation, topic tagging, entity extraction, cultural notes.

8. **Voice input**: WebSpeech API. Click "speak," select language, talk.

9. **Processing receipt**: Green card flashes after posting showing full pipeline output.

10. **Tower**: Bookmarked posts organized by topic floors. Posts in tower don't expire.

11. **Bleed-in**: Posts from adjacent neighborhoods appear with purple border.

12. **Anonymous identity**: Phone hash -> deterministic alias. Never stored. Never reversible.

13. **Collective leverage copy**: Each signal card shows "This pattern was invisible until N communities reported independently."

### Trust Model

- **Cross-language corroboration IS validation.** One person saying "this landlord steals deposits" is an accusation. Three people in three languages who can't read each other is corroboration.
- **One phone = one alias.** Can't sock-puppet without multiple phones.
- **Tenure badges.** New/settled/rooted/born -- time-weighted credibility.
- **7-day expiry.** Stale accusations die automatically.
- **PII stripping.** Phone never stored. Names/numbers stripped from post text.
- **Privacy-safe badges.** Languages with only 1 post in a signal are hidden to protect small-community speakers.
- **No voting. No moderation. No algorithm.** The math does the work.

### Immigrant-Aware Moderation

Standard moderation flags these as dangerous. UnBabel marks them SAFE:
- "ICE was spotted at the subway station" (safety warning, not threat)
- "Does anyone know a cash job?" (survival, not fraud)
- "The landlord hasn't fixed the heat in 2 weeks" (legitimate complaint)

Only UNSAFE: direct threats, doxxing, hate speech targeting specific groups.

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `posts` | Core posts. 7-day expiry, flagging, tenure. |
| `translations` | Cache of translated text per post per language. |
| `entities` | Extracted entities (street, business, org, issue) per post. Powers signal detection. |
| `bookmarks` | User bookmarks with topic label. Powers Tower. |
| `directory` | Business/org listings per neighborhood. |
| `directory_translations` | Translation cache for directory entries. |

---

## Files

```
src/
  app/
    page.tsx                    # Homepage
    layout.tsx                  # Shell: Courier Prime font, purple bars
    [hood]/
      page.tsx                  # Signals-first feed + cross-hood signals
      directory/page.tsx        # Business directory with lang switching
    tower/[alias]/page.tsx      # Personal tower
    api/
      post/route.ts             # Post submission pipeline
      feed/route.ts             # Feed query
      translate/route.ts        # On-read translation
      translate-directory/route.ts # Directory translation
      signals/route.ts          # Signal detection + cross-hood signals
      enrich/route.ts           # Tavily web search enrichment
      bookmarks/route.ts        # Tower bookmarks
      seed/route.ts             # DB seeding
      directory/route.ts        # Directory query
      stats/route.ts            # Neighborhood stats
  components/
    PostCard.tsx                # Post with translation, bleed-in, bookmark
    PostForm.tsx                # Report form with voice input + receipt
    SignalCard.tsx              # Signal card with strength, expansion, enrich
    LanguagePicker.tsx          # Language dropdown
    DirectoryCard.tsx           # Directory entry
    TenureBadge.tsx             # Tenure indicator
  lib/
    db.ts                       # SQLite schema + all queries
    translate.ts                # Dual-backend LLM pipeline
    tavily.ts                   # Tavily search client
    neighborhoods.ts            # 8 neighborhoods, adjacency graph, 13 languages
    seed.ts                     # 54 demo posts + 23 directory entries + entities
    identity.ts                 # Phone hash -> anonymous alias
  types/
    speech.d.ts                 # WebSpeech API types
```

---

## How to Run

```bash
# Install
cd unbabel && npm install

# Production (use for demo -- much faster than dev)
npm run build && npm start

# Seed database (run once after first start)
curl -X POST http://localhost:3000/api/seed

# Env vars (create .env.local in project root)
# Ask Alex for keys
FEATHERLESS_API_KEY=...   # LLM inference
TAVILY_API_KEY=...        # Web search enrichment
```

---

## Git Workflow

**Everyone works on their own branch. Never push directly to main.**

```bash
git clone https://github.com/TheApexWu/unbabel.git
cd unbabel && npm install
git checkout -b your-name/feature-name

# Work, commit, push
git add .
git commit -m "what you did"
git push -u origin your-name/feature-name
```

---

## Pitch Script (3 min)

**Open (15 sec):** "My mom immigrated to the US and found jobs, English classes, and legal help through diverse churches -- not just Chinese ones. But she had to walk through the door and speak the right language. UnBabel makes the door visible."

**Signal detection (30 sec):** Open Jackson Heights. Point to the "free esl" signal: "8 reports across 6 languages -- Spanish, Tagalog, Chinese, Russian, Korean, Bengali. Six communities that can't read each other all searching for the same thing. This pattern was invisible until they all posted on the same board."

**Live demo (60 sec):** Type or speak a post. Watch it translate. Switch the language picker. Show the processing receipt. Click a signal card -- expand to see the raw reports in their original languages.

**Subversive moment (30 sec):** "A landlord on 37th Ave charges hidden fees. Reported in English, Bengali, Tagalog, and Nepali. Four languages, four independent warnings. The landlord relied on language barriers to keep complaints isolated. UnBabel ended that."

**Trust model (15 sec):** "We don't moderate. We don't vote. Three strangers who can't read each other named the same landlord independently. That's not an accusation -- that's a pattern."

**Close (15 sec):** "Every other project builds tools for immigrants to interact with systems. We built a tool for immigrants to interact with each other."

---

## Judging Criteria (5 pts each, 20 total)

1. **Design** -- UX, visual intentionality
2. **Uniqueness** -- sharp non-obvious angle, real problem
3. **Technical Execution** -- does it work, how much shipped
4. **Storytelling & Pitch** -- 3-min demo, live demo tightness

---

## Sponsors Used

- **Featherless.ai** ($500 credits): LLM inference backend (Qwen2.5-72B)
- **Tavily** ($15K credits): Web search enrichment for signals
