import { getTour } from "@/lib/content";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = await getTour(id);
  if (!tour) return Response.json({ ok: false, error: "That tour was not found." }, { status: 404 });
  return Response.json({ ok: true, tour });
}
