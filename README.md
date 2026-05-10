# UnBabel

**Cross-language signal detection for immigrant neighborhoods.**

Built at Build for the Border hackathon (May 9 2026). Shelved.

## What It Was

A system that detects when isolated immigrant communities independently report the same problem across language barriers. 12 NYC neighborhoods, 13 languages, cross-lingual entity clustering, one-click NYC 311 complaint filing.

## Lessons Learned

- Solved a problem we assumed existed instead of validating with actual users first
- Cross-language entity clustering is technically interesting but not a defensible moat in immigration tech
- Teammates who don't ship code don't help -- solo or one strong partner next time
- Spent the last hour polishing translations instead of practicing the pitch
- Don't default to TypeScript/Next.js scaffolding when the problem doesn't demand it

## Tech Stack

Next.js, SQLite, Featherless.ai (Qwen2.5-72B), Tavily, Leaflet, WebSpeech API

## Run

```bash
npm install && npm run build && npm start
```

DB auto-seeds. Needs `.env.local` with `FEATHERLESS_API_KEY` and `TAVILY_API_KEY`.
