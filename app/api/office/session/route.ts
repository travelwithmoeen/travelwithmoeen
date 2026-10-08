import { getSessionView } from "@/lib/auth/session-view";

export async function GET() {
  const view = await getSessionView();
  if (!view) return Response.json({ ok: false }, { status: 401 });
  return Response.json({ ok: true, ...view });
}
