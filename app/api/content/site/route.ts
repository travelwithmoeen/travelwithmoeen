import { getSiteSettings } from "@/lib/content";

export async function GET() {
  return Response.json({ ok: true, settings: await getSiteSettings() });
}
