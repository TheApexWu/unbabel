export interface Neighborhood {
  slug: string;
  name: string;
  zips: string[];
  adjacent: string[]; // slugs of neighboring hoods for bleed
  borough: string;
  description: string; // one-line character sketch
  image: string; // Unsplash direct URL for banner
}

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "jackson-heights",
    name: "Jackson Heights",
    zips: ["11372", "11370"],
    adjacent: ["flushing", "bushwick", "astoria", "corona"],
    borough: "Queens",
    description: "74th Street smells like five countries at once.",
    image: "https://images.unsplash.com/photo-1590492106684-1e0813806819?w=800&h=300&fit=crop",
  },
  {
    slug: "flushing",
    name: "Flushing",
    zips: ["11354", "11355", "11358"],
    adjacent: ["jackson-heights", "corona"],
    borough: "Queens",
    description: "Main Street is louder in Mandarin and Korean than English.",
    image: "https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?w=800&h=300&fit=crop",
  },
  {
    slug: "washington-heights",
    name: "Washington Heights",
    zips: ["10032", "10033", "10040"],
    adjacent: ["bushwick", "east-harlem"],
    borough: "Manhattan",
    description: "Bachata from every window. The bridge glows at night.",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=300&fit=crop",
  },
  {
    slug: "sunset-park",
    name: "Sunset Park",
    zips: ["11220", "11232"],
    adjacent: ["bushwick"],
    borough: "Brooklyn",
    description: "Chinatown South meets Latin America on 8th Avenue.",
    image: "https://images.unsplash.com/photo-1555424681-b0ecf4e40b9a?w=800&h=300&fit=crop",
  },
  {
    slug: "bushwick",
    name: "Bushwick",
    zips: ["11221", "11237"],
    adjacent: ["jackson-heights", "sunset-park", "washington-heights"],
    borough: "Brooklyn",
    description: "Murals on every wall. Tamales on every corner.",
    image: "",
  },
  {
    slug: "astoria",
    name: "Astoria",
    zips: ["11102", "11103", "11105", "11106"],
    adjacent: ["jackson-heights", "flushing"],
    borough: "Queens",
    description: "Greek diners next to Egyptian hookah bars next to Brazilian steakhouses.",
    image: "",
  },
  {
    slug: "corona",
    name: "Corona",
    zips: ["11368"],
    adjacent: ["jackson-heights", "flushing"],
    borough: "Queens",
    description: "The real heart of Queens. Lemon ice on every block.",
    image: "",
  },
  {
    slug: "east-harlem",
    name: "East Harlem",
    zips: ["10029", "10035"],
    adjacent: ["washington-heights"],
    borough: "Manhattan",
    description: "El Barrio. Salsa, murals, and the best alcapurrias in the city.",
    image: "",
  },
];

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "zh", name: "Chinese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
  { code: "bn", name: "Bengali" },
  { code: "hi", name: "Hindi" },
  { code: "ar", name: "Arabic" },
  { code: "tl", name: "Tagalog" },
  { code: "ne", name: "Nepali" },
  { code: "el", name: "Greek" },
  { code: "pt", name: "Portuguese" },
  { code: "fr", name: "French" },
];

export function getNeighborhood(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.slug === slug);
}

export function getAdjacentSlugs(slug: string): string[] {
  return getNeighborhood(slug)?.adjacent ?? [];
}
