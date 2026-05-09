import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1
          className="text-4xl font-bold text-purple-800 mb-1"
          style={{ fontFamily: "Georgia, serif" }}
        >
          unbabel
        </h1>
        <p className="text-sm text-gray-500">
          the neighborhood is talking. hear it out.
        </p>
      </div>

      <div className="border border-gray-300 bg-white p-4">
        <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-300 pb-2">
          pick your neighborhood
        </h2>
        <div className="space-y-1">
          {NEIGHBORHOODS.map((hood) => (
            <div key={hood.slug} className="flex items-baseline gap-2">
              <Link
                href={`/${hood.slug}`}
                className="text-purple-800 hover:text-purple-600 underline text-sm"
              >
                {hood.name}
              </Link>
              <span className="text-xs text-gray-400">{hood.borough}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-400 space-y-2">
        <p>
          nyc has 800 languages. we built enclaves, not bridges. unbabel lets
          you overhear your neighborhood in every language without knowing
          who&apos;s talking.
        </p>
        <p>
          no profiles. no DMs. no followers. no algorithm. posts expire in 7
          days. you don&apos;t need to meet anyone. you just need to hear them.
        </p>
      </div>
    </main>
  );
}
