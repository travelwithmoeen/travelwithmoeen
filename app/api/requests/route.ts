import { hasNulText, NUL_TEXT_ERROR } from "@/lib/http/nul-text";
import { saveGuestRequest } from "@/lib/requests";

const NOT_READ = "The request could not be read.";

// A field counts only when it is text. A number, a list, an object, or a missing field is empty, so
// nothing deeper in the body is read.
function text(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: NOT_READ }, { status: 400 });
  }
  // A guest request is a plain object. null, a list, a number, or text is not one.
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ ok: false, error: NOT_READ }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const fields = {
    kind: text(record, "kind"),
    name: text(record, "name"),
    phone: text(record, "phone"),
    email: text(record, "email"),
    message: text(record, "message"),
  };
  // T-54: the NUL check runs on the five fields only, not on the whole body.
  if (Object.values(fields).some(hasNulText)) return Response.json({ ok: false, error: NUL_TEXT_ERROR }, { status: 400 });
  const result = await saveGuestRequest(fields);
  if (!result.ok) return Response.json(result, { status: 400 });
  return Response.json({ ok: true, id: result.id });
}
