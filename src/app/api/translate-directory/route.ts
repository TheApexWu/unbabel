import { db, getCachedDirectoryTranslation, cacheDirectoryTranslation } from "@/lib/db";
import { translateOnly } from "@/lib/translate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const targetLang = searchParams.get("lang") ?? "en";

  if (!id) {
    return Response.json({ error: "id required" }, { status: 400 });
  }

  // Check cache
  const cached = getCachedDirectoryTranslation(id, targetLang);
  if (cached) {
    return Response.json({
      translated_name: cached.translated_name,
      translated_description: cached.translated_description,
      cached: true,
    });
  }

  // Fetch original
  const entry = db
    .prepare("SELECT name, description_original, source_lang FROM directory WHERE id = ?")
    .get(id) as { name: string; description_original: string | null; source_lang: string | null } | null;

  if (!entry) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  const sourceLang = entry.source_lang ?? "en";

  if (sourceLang === targetLang) {
    return Response.json({
      translated_name: entry.name,
      translated_description: entry.description_original,
      cached: false,
    });
  }

  // Translate name and description
  const [nameResult, descResult] = await Promise.all([
    translateOnly(entry.name, sourceLang, targetLang),
    entry.description_original
      ? translateOnly(entry.description_original, sourceLang, targetLang)
      : Promise.resolve({ translated_text: null }),
  ]);

  const translatedName = nameResult.translated_text;
  const translatedDesc = descResult.translated_text ?? "";

  // Cache
  cacheDirectoryTranslation(id, targetLang, translatedName, translatedDesc);

  return Response.json({
    translated_name: translatedName,
    translated_description: translatedDesc,
    cached: false,
  });
}
