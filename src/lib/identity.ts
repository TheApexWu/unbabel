import crypto from "crypto";

const SALT = process.env.IDENTITY_SALT ?? "unbabel-hackathon-2026";

// Adjective + Noun aliases for anonymous identity
const ADJECTIVES = [
  "quiet", "bright", "swift", "gentle", "bold", "calm", "keen",
  "warm", "cool", "quick", "steady", "fair", "clear", "sharp",
  "free", "open", "deep", "wide", "soft", "true",
];

const NOUNS = [
  "sparrow", "river", "stone", "cloud", "leaf", "bridge", "flame",
  "harbor", "lantern", "compass", "anchor", "window", "garden", "bell",
  "fountain", "horizon", "ember", "feather", "tide", "branch",
];

/**
 * Hash a phone number to produce a deterministic anonymous alias.
 * Same phone always gets the same alias. Cannot be reversed.
 */
export function phoneToAlias(phone: string): string {
  const hash = crypto
    .createHash("sha256")
    .update(phone + SALT)
    .digest("hex");

  // Use first 4 hex chars to pick adjective, next 4 for noun
  const adjIdx = parseInt(hash.slice(0, 4), 16) % ADJECTIVES.length;
  const nounIdx = parseInt(hash.slice(4, 8), 16) % NOUNS.length;

  return `${ADJECTIVES[adjIdx]}-${NOUNS[nounIdx]}`;
}

/**
 * Assign a tenure badge based on account age in days.
 */
export function getTenure(
  createdAt: Date
): "new" | "settled" | "rooted" | "born" {
  const days = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days < 7) return "new";
  if (days < 30) return "settled";
  if (days < 90) return "rooted";
  return "born";
}

export const TENURE_LABELS: Record<string, string> = {
  new: "new here",
  settled: "getting settled",
  rooted: "rooted",
  born: "born here",
};
