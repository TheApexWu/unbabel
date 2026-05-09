import { NextRequest, NextResponse } from "next/server";
import { tavilySearch } from "@/lib/tavily";
import { getNeighborhood } from "@/lib/neighborhoods";

export async function GET(req: NextRequest) {
  const entity = req.nextUrl.searchParams.get("entity");
  const type = req.nextUrl.searchParams.get("type");
  const hood = req.nextUrl.searchParams.get("hood");

  if (!entity) {
    return NextResponse.json({ error: "missing entity param" }, { status: 400 });
  }

  // Build a smart search query based on entity type and neighborhood
  let query = entity;
  if (hood) {
    const n = getNeighborhood(hood);
    if (n) {
      query += ` ${n.name} ${n.borough} NYC`;
    } else {
      query += ` ${hood.replace(/-/g, " ")} NYC`;
    }
  }
  if (type === "issue") {
    query += " news reports";
  } else if (type === "business") {
    query += " reviews";
  } else if (type === "org") {
    query += " organization";
  }

  try {
    const results = await tavilySearch(query);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("Tavily search failed:", err);
    return NextResponse.json({ error: "search failed" }, { status: 500 });
  }
}
