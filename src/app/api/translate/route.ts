import {
  getPostById,
  getCachedTranslation,
  cacheTranslation,
} from "@/lib/db";
import { translateOnly } from "@/lib/translate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = Number(searchParams.get("postId"));
  const targetLang = searchParams.get("lang") ?? "en";
  const cacheOnly = searchParams.get("cacheOnly") === "1";

  if (!postId) {
    return Response.json({ error: "postId required" }, { status: 400 });
  }

  // Check cache first
  const cached = getCachedTranslation(postId, targetLang);
  if (cached) {
    return Response.json({
      translated_text: cached.translated_text,
      cached: true,
    });
  }

  // If cache-only mode, return immediately without LLM call
  if (cacheOnly) {
    return Response.json({ translated_text: null, cached: false });
  }

  // Fetch original post
  const post = getPostById(postId) as {
    body_original: string;
    source_lang: string;
  } | null;
  if (!post) {
    return Response.json({ error: "post not found" }, { status: 404 });
  }

  // If requesting the source language, return original
  if (post.source_lang === targetLang) {
    return Response.json({
      translated_text: post.body_original,
      cached: false,
    });
  }

  // Translate via active backend
  const result = await translateOnly(post.body_original, post.source_lang, targetLang);

  // Cache it
  cacheTranslation(postId, targetLang, result.translated_text);

  return Response.json({
    translated_text: result.translated_text,
    cached: false,
  });
}
