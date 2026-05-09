export interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

export async function tavilySearch(query: string, maxResults = 3): Promise<TavilyResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("TAVILY_API_KEY not set");

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      api_key: apiKey,
      max_results: maxResults,
      search_depth: "basic",
    }),
  });

  if (!res.ok) {
    throw new Error(`Tavily API error: ${res.status}`);
  }

  const data = await res.json();
  return (data.results ?? []).map((r: { title: string; url: string; content: string }) => ({
    title: r.title,
    url: r.url,
    content: r.content,
  }));
}
