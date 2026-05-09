import { getPostsByHood } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hoodsParam = searchParams.get("hoods") ?? "";
  const hoods = hoodsParam.split(",").filter(Boolean);

  if (hoods.length === 0) {
    return Response.json({ posts: [] });
  }

  const primary = hoods[0];
  const adjacent = hoods.slice(1);
  const posts = getPostsByHood(primary, adjacent);

  return Response.json({ posts });
}
