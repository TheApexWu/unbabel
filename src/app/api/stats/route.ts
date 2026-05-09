import { db } from "@/lib/db";

export async function GET() {
  const rows = db
    .prepare(
      `SELECT hood, COUNT(*) as post_count, COUNT(DISTINCT source_lang) as lang_count
       FROM posts
       WHERE flagged = 0 AND expires_at > datetime('now')
       GROUP BY hood`
    )
    .all() as { hood: string; post_count: number; lang_count: number }[];

  const stats: Record<string, { posts: number; languages: number }> = {};
  for (const r of rows) {
    stats[r.hood] = { posts: r.post_count, languages: r.lang_count };
  }

  return Response.json({ stats });
}
