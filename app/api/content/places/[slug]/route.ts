import { getPlace } from "@/lib/content";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) return Response.json({ ok: false, error: "That place was not found." }, { status: 404 });
  return Response.json({ ok: true, place });
}
