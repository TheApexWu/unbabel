import { getDirectoryByHood } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hood = searchParams.get("hood") ?? "";
  const category = searchParams.get("category") ?? undefined;

  if (!hood) {
    return Response.json({ entries: [] });
  }

  const entries = getDirectoryByHood(hood, category);
  return Response.json({ entries });
}
