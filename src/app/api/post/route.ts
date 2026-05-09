import { createPost, cacheTranslation, insertEntities } from "@/lib/db";
import { processPost } from "@/lib/translate";
import { phoneToAlias } from "@/lib/identity";

export async function POST(request: Request) {
  const { text, phone, hood, tenure } = await request.json();

  if (!text || !phone || !hood) {
    return Response.json({ error: "text, phone, and hood required" }, { status: 400 });
  }

  const alias = phoneToAlias(phone);

  // Single inference call: translate + moderate + PII strip + topic tag + entity extract
  const result = await processPost(text, "en");

  if (!result.is_safe) {
    return Response.json({ error: "post flagged by moderation" }, { status: 403 });
  }

  // Store with sanitized original (PII stripped)
  const inserted = createPost(
    alias,
    result.sanitized_original,
    result.detected_language,
    hood,
    tenure ?? "new"
  );

  const postId = inserted.lastInsertRowid as number;

  // Cache the English translation
  if (result.detected_language !== "en") {
    cacheTranslation(postId, "en", result.translated_text);
  }

  // Store extracted entities for signal detection
  if (result.entities.length > 0) {
    insertEntities(postId, result.entities, hood, result.detected_language);
  }

  return Response.json({
    id: postId,
    alias,
    detected_language: result.detected_language,
    translated_text: result.translated_text,
    pii_found: result.pii_found,
    topics: result.topics,
    is_safe: result.is_safe,
    cultural_note: result.cultural_note,
    entities: result.entities,
  });
}
