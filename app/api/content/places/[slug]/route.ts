import { getPlace } from "@/lib/content";
import { hasNulText } from "@/lib/http/nul-text";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // An id with a NUL character cannot match a record (T-54).
  if (hasNulText(slug)) return Response.json({ ok: false, error: "That place was not found." }, { status: 404 });
  const place = await getPlace(slug);
  if (!place) return Response.json({ ok: false, error: "That place was not found." }, { status: 404 });
  return Response.json({ ok: true, place });
}
