import { getTour } from "@/lib/content";
import { hasNulText } from "@/lib/http/nul-text";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // An id with a NUL character cannot match a record (T-54).
  if (hasNulText(id)) return Response.json({ ok: false, error: "That tour was not found." }, { status: 404 });
  const tour = await getTour(id);
  if (!tour) return Response.json({ ok: false, error: "That tour was not found." }, { status: 404 });
  return Response.json({ ok: true, tour });
}
