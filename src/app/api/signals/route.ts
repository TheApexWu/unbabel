import { getSignalClusters } from "@/lib/db";
import { getAdjacentSlugs } from "@/lib/neighborhoods";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hood = searchParams.get("hood") ?? "";

  if (!hood) {
    return Response.json({ signals: [] });
  }

  const adjacent = getAdjacentSlugs(hood);
  const clusters = getSignalClusters(hood, adjacent);

  return Response.json({ signals: clusters });
}
