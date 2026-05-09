# UnBabel

**A neighborhood bulletin board where language doesn't matter.**

Three people post about the same landlord in three languages. None of them can read each other. UnBabel connects the dots.

## What It Does

Post in any language. Read in yours. When multiple languages independently mention the same person, place, or issue, UnBabel surfaces it as a signal -- a cross-language pattern nobody could see alone.

- 8 NYC neighborhoods, 13 languages
- Cross-language signal detection (entity clustering)
- Signal strength: 2 languages = pattern, 5+ = neighborhood consensus
- Cross-neighborhood tracking: serial predators can't hide behind geography
- Voice input, anonymous identity, 7-day post expiry
- Tavily web enrichment for real-world context on signals

## How to Run

```bash
npm install
npm run build && npm start
curl -X POST http://localhost:3000/api/seed
```

Create `.env.local` with API keys (ask Alex):
```
FEATHERLESS_API_KEY=...
TAVILY_API_KEY=...
```

## Trust Model

We don't moderate. We don't vote. Independent corroboration across language barriers IS the validation. You can't fake a cross-language signal.

## Team

Built at Build for the Border hackathon, May 9 2026.

See [HACKATHON.md](HACKATHON.md) for full documentation.
