import { getTours } from "@/lib/content";

export async function GET() {
  return Response.json({ ok: true, tours: await getTours() });
}
