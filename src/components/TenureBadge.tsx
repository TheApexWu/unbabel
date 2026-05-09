import { TENURE_LABELS } from "@/lib/identity";

const TENURE_COLORS: Record<string, string> = {
  new: "bg-green-100 text-green-800 border-green-300",
  settled: "bg-blue-100 text-blue-800 border-blue-300",
  rooted: "bg-amber-100 text-amber-800 border-amber-300",
  born: "bg-purple-100 text-purple-800 border-purple-300",
};

export function TenureBadge({ tenure }: { tenure: string }) {
  const label = TENURE_LABELS[tenure] ?? tenure;
  const color = TENURE_COLORS[tenure] ?? "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <span
      className={`inline-block text-xs font-mono px-2 py-0.5 border rounded ${color}`}
    >
      {label}
    </span>
  );
}
