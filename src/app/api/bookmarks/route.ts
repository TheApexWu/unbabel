import { addBookmark, removeBookmark, getBookmarksByAlias } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const alias = searchParams.get("alias") ?? "";

  if (!alias) {
    return Response.json({ bookmarks: [] });
  }

  const bookmarks = getBookmarksByAlias(alias);
  return Response.json({ bookmarks });
}

export async function POST(request: Request) {
  const { alias, postId, topic, action } = await request.json();

  if (!alias || !postId) {
    return Response.json({ error: "alias and postId required" }, { status: 400 });
  }

  if (action === "remove") {
    removeBookmark(alias, postId);
    return Response.json({ removed: true });
  }

  addBookmark(alias, postId, topic ?? "general");
  return Response.json({ added: true });
}
