# UnBabel -- Build for the Border Hackathon

## What Is This

Neighborhood intelligence platform that erases language barriers.

NYC has 800 languages. WeChat, WhatsApp, KakaoTalk connect people vertically (Chinese to Chinese, Dominican to Dominican). UnBabel connects horizontally -- everyone on the same block, regardless of language.

Core thesis: **"Community accountability infrastructure for neighborhoods that don't share a language."**

Three people post in three languages about the same landlord. None can read each other. UnBabel connects the dots.

---

## What's Built (Scaffold)

### Architecture

```
Next.js 16 + SQLite (better-sqlite3) + Tailwind CSS
                    |
            Single LLM inference call per post
        (detect + translate + PII strip + moderate + entity extract)
                    |
            Ollama (local, default) OR Featherless.ai (API, if key set)
```

### Pages

| Route | What it does |
|-------|-------------|
| `/` | Homepage. Plain link list to neighborhoods. |
| `/[hood]` | Feed page. Posts + post form + language picker + signal cards. |
| `/[hood]/directory` | Business/org directory for neighborhood. |
| `/tower/[alias]` | Personal "Tower of Babel" -- bookmarked posts organized by topic floors. Persistent, doesn't expire. |

### API Routes

| Route | Method | What it does |
|-------|--------|-------------|
| `/api/post` | POST | Submit new post. Runs full LLM pipeline: translate, PII strip, moderate, entity extract. Returns processing receipt. |
| `/api/feed` | GET | Get posts for neighborhood(s). Includes bleed-in from adjacent hoods. |
| `/api/translate` | GET | On-demand translation for viewer language switching. Caches results. |
| `/api/signals` | GET | Cross-language signal detection. Clusters entities by value, returns those mentioned in 2+ languages. |
| `/api/bookmarks` | GET/POST | Save/retrieve bookmarked posts for tower. |
| `/api/seed` | POST | Seed DB with demo posts + directory entries. |
| `/api/directory` | GET | Directory listings by neighborhood + category. |

### Key Features

1. **Single-inference pipeline**: One LLM call per post does 7 things: language detection, meaning-based translation (not literal), PII stripping, immigrant-aware moderation, topic tagging, entity extraction, cultural note generation.

2. **Cross-language signal cards**: Entity extraction clusters mentions across languages. If Spanish, Nepali, and English posts all mention "37th Ave" + "hidden fees," a signal card appears: "3 languages, 1 warning."

3. **Voice input**: WebSpeech API. Click "speak," select language, talk. Text appears in post form. Works in Chrome.

4. **Bleed-in**: Posts from adjacent neighborhoods appear in your feed with purple left border + origin label. Serendipity engine.

5. **Processing receipt**: After posting, a green card flashes showing the full pipeline output (detected language, translation, PII found, toxicity, topics, cultural note). Shows judges the engineering.

6. **Tower**: Bookmarked posts organized by topic (housing, legal, food, etc.) as "floors." Posts in the tower don't expire even when the original does. Personal knowledge base.

7. **Dual backend**: Set `FEATHERLESS_API_KEY` env var to use Featherless.ai (hackathon sponsor). Otherwise falls back to Ollama local.

### Database Tables

| Table | Purpose |
|-------|---------|
| `posts` | Core posts. 7-day expiry, flagging, tenure. |
| `translations` | Cache of translated text per post per language. |
| `entities` | Extracted entities (street, business, org, issue) per post. Used for signal detection. |
| `bookmarks` | User bookmarks with topic label. Powers the Tower. |
| `directory` | Business/org listings per neighborhood. |
| `directory_translations` | Translation cache for directory entries. |

### Files

```
src/
  app/
    page.tsx                    # Homepage
    layout.tsx                  # Shell: Courier Prime font, purple bars
    [hood]/
      page.tsx                  # Feed page (posts + signals + form)
      directory/page.tsx        # Business directory
    tower/[alias]/page.tsx      # Personal tower
    api/
      post/route.ts             # Post submission pipeline
      feed/route.ts             # Feed query
      translate/route.ts        # On-read translation
      signals/route.ts          # Signal detection
      bookmarks/route.ts        # Tower bookmarks
      seed/route.ts             # DB seeding
      directory/route.ts        # Directory query
  components/
    PostCard.tsx                # Post with translation, bleed-in, bookmark button
    PostForm.tsx                # Post form with voice input + receipt
    SignalCard.tsx              # Amber cross-language signal card
    LanguagePicker.tsx          # Language dropdown
    DirectoryCard.tsx           # Directory entry
    TenureBadge.tsx             # "new here" / "rooted" / etc.
  lib/
    db.ts                       # SQLite schema + all queries
    translate.ts                # Dual-backend LLM pipeline
    neighborhoods.ts            # Neighborhood config (slugs, adjacency, zips)
    seed.ts                     # Demo seed data (22 posts, 16 directory, entities)
    identity.ts                 # Phone hash -> anonymous alias
  types/
    speech.d.ts                 # WebSpeech API types
```

---

## Translation Pipeline Details

The system prompt instructs the LLM to:

- **Translate for meaning, not literal words.** Slang, idioms, code-switching handled. "No te dejes" becomes "don't let them take advantage of you."
- **Keep untranslatable cultural terms** with parenthetical gloss: "guanxi (connections/social capital)"
- **Strip PII** but keep street names (they're landmarks). NEVER strip immigration status references.
- **Moderate with immigrant-aware rules.** ICE warnings, visa questions, cash jobs = SAFE. Landlord complaints = SAFE. Only direct threats, doxxing, hate speech = UNSAFE. When in doubt, SAFE.
- **Extract entities** in English (so they cluster across languages): streets, businesses, orgs, issues.
- **Cultural notes** explain when interpretation was non-obvious.

---

## Design Principles

- No profiles. No followers. No algorithm. No engagement metrics.
- No DMs. Ever. You cannot message anyone directly.
- No user pages. No post history. No "view user."
- Posts expire in 7 days (feed self-cleans). Tower posts persist.
- Anonymous identity: phone hash -> deterministic alias (e.g. "calm-sparrow"). Cannot be reversed.
- Tenure badges: "new here" / "getting settled" / "rooted" / "born here." No country, no race.
- Source language never displayed in the original design (shown now for demo clarity -- can toggle off).
- Text-only. No images = no abuse vector.
- Shy-friendly. Get info without social performance.

---

## How to Run

```bash
# Install
cd unbabel && npm install

# Development (slow first load, hot reload)
npm run dev

# Production (fast, use for demo)
npm run build && npm start

# Seed database (run once)
curl -X POST http://localhost:3000/api/seed

# With Featherless (if you have API key)
FEATHERLESS_API_KEY=your_key npm start

# With Ollama (default, needs Ollama running)
# Make sure qwen3.5:4b is pulled: ollama pull qwen3.5:4b
```

---

## What Needs Building (Hackathon Day)

### Must-have for demo (P0)
- [ ] Test voice input end-to-end (needs Chrome + localhost or HTTPS)
- [ ] Test posting with Ollama or Featherless -- verify translation quality
- [ ] Add 2-3 more neighborhoods if time (Astoria, Corona, East Harlem)
- [ ] Practice the live demo: speak Chinese -> English appears -> signal card updates

### Should-have (P1)
- [ ] Tower visual polish -- make floors look more like a literal tower (blocks stacking)
- [ ] Add post count / language count to homepage neighborhood links
- [ ] Directory entries translate when viewer switches language (currently shows original only)
- [ ] Neighborhood briefing: one-click AI summary of the week's posts across all languages

### Nice-to-have (P2)
- [ ] Tavily auto-enrichment: detect question posts, surface real local resources
- [ ] 311 complaint seeding: pull real NYC 311 data as system posts
- [ ] Search across all translated posts (SQLite FTS5)
- [ ] Tower sharing: generate a read-only link to your tower for others

---

## Expansion / Research Directions

### Product
- **More cities**: The architecture is city-agnostic. London, Toronto, LA have the same enclave problem. Neighborhood config is just a JSON array.
- **Verified directory**: Partner with orgs (CAST GNY, churches, legal aid) to verify directory listings. Verified badge.
- **Alert subscriptions**: "Tell me when someone posts about [topic] in [neighborhood]." Push notifications. Requires persistent identity.
- **Offline mode**: SQLite already works offline. PWA wrapper for areas with poor connectivity.
- **Print output**: Generate a physical flyer from the week's top posts for posting in laundromats, churches, bodegas. Low-tech bridge.

### Technical
- **Entity resolution**: Currently uses exact string match for clustering. Better: fuzzy matching / embedding similarity so "37th Ave" and "37th Avenue" and "Roosevelt corner of 37th" all cluster.
- **Translation quality evaluation**: Side-by-side comparison of Qwen 4B vs 8B vs 72B on idiomatic content. Measure meaning preservation, not BLEU.
- **Dialect handling**: Mexican Spanish vs Dominican Spanish vs Argentinian. Simplified Chinese vs Traditional. Korean formal vs casual.
- **Audio posts**: Skip text entirely. Record voice -> transcribe -> translate -> post. For non-literate users.
- **Embedding-based topic clustering**: Replace manual topic tags with sentence embeddings. Auto-discover topics.
- **Moderation adversarial testing**: Red-team the safety rules. What slips through? What gets wrongly flagged?

### Research Questions
- Do anonymous ephemeral platforms actually build trust, or does anonymity enable abuse? What's the empirical evidence?
- What's the minimum translation quality threshold for cross-language community formation? When does bad translation actively harm?
- How do you cold-start a neighborhood platform? Is 311 data sufficient kindling, or do you need community org partnerships?
- What's the right expiry window? 7 days is arbitrary. Is 3 days better for trust? 14 for utility?
- How do you handle languages with very few speakers in a neighborhood (e.g., 5 Tibetan speakers in Jackson Heights)? Does anonymity break when the pool is too small?

---

## Pitch Script (3 min demo)

**Open (15 sec):** "My mom immigrated to the US and found jobs, English classes, and legal help through diverse churches -- not just Chinese ones. But she had to walk through the door and speak the right language. UnBabel makes the door visible."

**Signal detection (30 sec):** "Three people posted this week in Jackson Heights. One in Spanish, one in Nepali, one in English. All about the same realty office adding hidden fees. None of them can read each other's posts. None of them know each other. [Point to signal card.] UnBabel connected the dots. The landlord can't rely on language barriers to keep complaints isolated anymore."

**Live demo (60 sec):** Type or speak a post in Chinese/Spanish. Watch it translate. Switch the language picker -- all posts re-render in the new language. Show the processing receipt. Show the bleed-in post from Flushing appearing in Jackson Heights.

**Tower (30 sec):** "The feed is ephemeral -- posts expire in 7 days. But what if you find a free legal clinic? A church with ESL classes? You save it to your tower. Your tower is permanent. A personal knowledge base that grows as you discover your neighborhood."

**Technical (30 sec):** "One LLM call per post does seven things: detect language, translate for meaning, strip PII, moderate with immigrant-aware safety rules, extract entities, tag topics, add cultural context notes. That's not Google Translate. That's cultural mediation."

**Close (15 sec):** "Every other project here builds tools for immigrants to interact with systems. We built a tool for immigrants to interact with each other. The neighborhood is talking. Now everyone on the block hears the same thing."

---

## Team

| Role | Person | Focus |
|------|--------|-------|
| Architect / Lead Dev | Alex | Pipeline, signal detection, voice, infra |
| SWE | Phillip | Frontend, new neighborhoods, directory |
| Data | Moyan | Seed data, 311 research, demo content |
| Strategy / Pitch | Annie | Pitch deck, narrative, judge prep |

---

## Sponsors Touched

- **Featherless.ai** ($500 credits): Using their API for inference (if key acquired)
- **Tavily** ($15K credits): Expansion feature for auto-enrichment (P2)
- **Lovable**: Not currently used
