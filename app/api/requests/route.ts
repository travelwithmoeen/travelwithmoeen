import { saveGuestRequest } from "@/lib/requests";

function text(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return value === undefined || value === null ? "" : String(value);
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "The request could not be read." }, { status: 400 });
  }
  const result = await saveGuestRequest({
    kind: text(body, "kind"),
    name: text(body, "name"),
    phone: text(body, "phone"),
    email: text(body, "email"),
    message: text(body, "message"),
  });
  if (!result.ok) return Response.json(result, { status: 400 });
  return Response.json({ ok: true, id: result.id });
}
