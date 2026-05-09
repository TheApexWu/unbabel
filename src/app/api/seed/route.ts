import { seedDatabase } from "@/lib/seed";

export async function POST() {
  const result = seedDatabase();
  return Response.json(result);
}
