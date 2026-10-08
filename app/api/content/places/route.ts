import { getPlaces } from "@/lib/content";

export async function GET() {
  return Response.json({ ok: true, places: await getPlaces() });
}
