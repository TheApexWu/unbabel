/**
 * Translation engine with dual backend support:
 * - Ollama (default): local inference, no API key needed
 * - Featherless.ai: set FEATHERLESS_API_KEY env var to use
 *
 * Single inference call does: language detection, translation, PII stripping, toxicity check.
 */

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen3.5:4b";

const FEATHERLESS_URL = "https://api.featherless.ai/v1";
const FEATHERLESS_KEY = process.env.FEATHERLESS_API_KEY ?? "";
const FEATHERLESS_MODEL = process.env.FEATHERLESS_MODEL ?? "Qwen/Qwen2.5-72B-Instruct";

const USE_FEATHERLESS = FEATHERLESS_KEY.length > 0;

export interface ProcessResult {
  detected_language: string;
  translated_text: string;
  sanitized_original: string;
  pii_found: { type: string; original: string }[];
  is_safe: boolean;
  flagged_reason: string | null;
  topics: string[];
  cultural_note: string | null;
  entities: { type: string; value: string }[];
}

const SYSTEM_PROMPT = `You are a multilingual translation, privacy, and moderation engine for an anonymous neighborhood forum used by immigrant communities. Given input text, perform ALL of the following in a single pass:

1. DETECT the source language (ISO 639-1 code). If the post mixes languages (code-switching like Spanglish, Hinglish, etc.), pick the dominant language but translate ALL parts.

2. TRANSLATE to the target language. CRITICAL translation rules:
   - Translate for MEANING, not literal words. Colloquial expressions, slang, and idioms should be rendered as what the speaker actually means, not word-for-word.
   - Examples: "no te dejes" -> "don't let them take advantage of you" (not "don't leave yourself"). "짬밥" -> "experience/seniority" (not "mixed rice"). "jugaad" -> "resourceful workaround" (not just "hack").
   - For culturally-specific terms with no direct equivalent (guanxi, jeong, compadrazgo, wasta), keep the original word and add a brief gloss in parentheses on first use. E.g. "guanxi (connections/social capital)".
   - Handle code-switching gracefully. A post mixing Spanish and English should be fully translated to the target language, not left half-untranslated.
   - Preserve tone. If someone is being warm, sarcastic, urgent, or cautious, the translation should carry that same energy.

3. STRIP PII in BOTH original and translation:
   - Phone numbers -> [PHONE]
   - Email addresses -> [EMAIL]
   - Social media handles (@username) -> [HANDLE]
   - Physical addresses with specific apartment/unit numbers -> [ADDRESS]
   - Street names and cross-streets are OK to keep (they're neighborhood landmarks, not personal info).
   - NEVER strip immigration status references, visa types, or document mentions -- these are essential context, not PII.

4. MODERATE with immigrant-community-aware safety rules:
   - SAFE: discussions about immigration status, ICE activity warnings, visa questions, "papers," undocumented experience, informal work, cash jobs, avoiding scams. These are survival conversations, not threats.
   - SAFE: warnings about landlords, employers, or businesses (even if negative -- this is community protection).
   - SAFE: requests for help, resource sharing, language exchange.
   - UNSAFE: direct threats of violence against specific people, doxxing (sharing someone's home address + identity together), hate speech targeting ethnic/racial/religious groups, explicit harassment.
   - When in doubt, mark as SAFE. False positives silence vulnerable people.

5. TAG 1-3 topic labels from: housing, food, transit, safety, jobs, health, legal, education, community, services, nightlife, warning.

6. CULTURAL NOTE: If the post contains slang, idioms, or culturally-coded language that required interpretation (not just literal translation), add a brief cultural_note explaining what was interpreted and why. If the translation was straightforward, set to null.

7. EXTRACT ENTITIES mentioned in the post. These are used to detect cross-language signals (e.g. multiple languages warning about the same landlord). Extract in ENGLISH (translated form) so they cluster across languages:
   - "street": street names, intersections, landmarks (e.g. "37th Ave", "Roosevelt Ave", "181st Street")
   - "business": business names, landlords, realty offices, restaurants, stores
   - "org": churches, community orgs, government offices, schools
   - "issue": specific recurring problems (e.g. "no hot water", "rent increase", "wage theft", "ICE activity")
   Only extract entities that are specific enough to cluster. Skip generic words.

Return ONLY valid JSON, no commentary, no thinking tags:
{
  "detected_language": "xx",
  "translated_text": "translated with PII replaced",
  "sanitized_original": "original with PII replaced",
  "pii_found": [{"type": "phone|email|handle|address", "original": "value"}],
  "is_safe": true,
  "flagged_reason": null,
  "topics": ["housing", "warning"],
  "cultural_note": null,
  "entities": [{"type": "street", "value": "37th Ave"}, {"type": "issue", "value": "hidden fees"}]
}`;

async function chatOllama(userMessage: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      stream: false,
      format: "json",
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.message?.content ?? "";
}

async function chatFeatherless(userMessage: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${FEATHERLESS_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FEATHERLESS_KEY}`,
      },
      body: JSON.stringify({
        model: FEATHERLESS_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Featherless error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  } finally {
    clearTimeout(timeout);
  }
}

function cleanResponse(content: string): string {
  return content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .trim();
}

const DEFAULT_RESULT: ProcessResult = {
  detected_language: "unknown",
  translated_text: "",
  sanitized_original: "",
  pii_found: [],
  is_safe: false,
  flagged_reason: null,
  topics: [],
  cultural_note: null,
  entities: [],
};

/**
 * Full pipeline: detect language, translate, strip PII, moderate, tag topics.
 * Single inference call. Works with Ollama or Featherless.
 */
export async function processPost(
  text: string,
  targetLang: string
): Promise<ProcessResult> {
  const userMessage = `Target language: ${targetLang}\n\nText to process:\n${text}`;

  try {
    const raw = USE_FEATHERLESS
      ? await chatFeatherless(userMessage)
      : await chatOllama(userMessage);

    const parsed = JSON.parse(cleanResponse(raw));

    return {
      detected_language: parsed.detected_language ?? "unknown",
      translated_text: parsed.translated_text ?? text,
      sanitized_original: parsed.sanitized_original ?? text,
      pii_found: parsed.pii_found ?? [],
      is_safe: parsed.is_safe ?? true,
      flagged_reason: parsed.flagged_reason ?? null,
      topics: parsed.topics ?? [],
      cultural_note: parsed.cultural_note ?? null,
      entities: parsed.entities ?? [],
    };
  } catch {
    return { ...DEFAULT_RESULT, translated_text: text, sanitized_original: text };
  }
}

/**
 * Translate-only call for on-read translation (when viewer switches language).
 * Lighter prompt, no moderation needed (already done on ingest).
 */
export async function translateOnly(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<{ translated_text: string }> {
  if (sourceLang === targetLang) {
    return { translated_text: text };
  }

  const system = `Translate the following text from ${sourceLang} to ${targetLang}. Return ONLY valid JSON: {"translated_text": "..."}. No commentary.`;

  try {
    let raw: string;
    if (USE_FEATHERLESS) {
      const res = await fetch(`${FEATHERLESS_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${FEATHERLESS_KEY}`,
        },
        body: JSON.stringify({
          model: FEATHERLESS_MODEL,
          messages: [
            { role: "system", content: system },
            { role: "user", content: text },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
      });
      const data = await res.json();
      raw = data.choices?.[0]?.message?.content ?? "";
    } else {
      const res = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: [
            { role: "system", content: system },
            { role: "user", content: text },
          ],
          stream: false,
          format: "json",
        }),
      });
      const data = await res.json();
      raw = data.message?.content ?? "";
    }

    return JSON.parse(cleanResponse(raw));
  } catch {
    return { translated_text: text };
  }
}

/** Check which backend is active (for UI display) */
export function getBackendInfo() {
  return {
    backend: USE_FEATHERLESS ? "featherless" : "ollama",
    model: USE_FEATHERLESS ? FEATHERLESS_MODEL : OLLAMA_MODEL,
  };
}
