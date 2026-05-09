import { getSignalClusters, getPostsByIds } from "@/lib/db";
import { getAdjacentSlugs } from "@/lib/neighborhoods";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hood = searchParams.get("hood") ?? "";

  if (!hood) {
    return Response.json({ signals: [] });
  }

  const adjacent = getAdjacentSlugs(hood);
  const clusters = getSignalClusters(hood, adjacent);

  // Collect all post IDs across clusters and fetch them in one query
  const allPostIds = new Set<number>();
  for (const c of clusters) {
    for (const id of c.post_ids.split(",")) {
      allPostIds.add(Number(id));
    }
  }

  const posts = getPostsByIds([...allPostIds]) as { id: number; [key: string]: unknown }[];
  const postMap = new Map(posts.map((p) => [p.id, p]));

  // Attach posts to each cluster
  const enriched = clusters.map((c) => ({
    ...c,
    posts: c.post_ids
      .split(",")
      .map((id) => postMap.get(Number(id)))
      .filter(Boolean),
  }));

  return Response.json({ signals: enriched });
}
