import { requireUser, type SessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/http/result";

export async function handleOfficeForm(
  request: Request,
  run: (actor: SessionUser, formData: FormData) => Promise<ActionResult>,
  refresh?: (formData: FormData) => void,
) {
  let actor: SessionUser;
  try {
    actor = await requireUser();
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  const formData = await request.formData();
  const result = await run(actor, formData);
  if (result.ok && refresh) refresh(formData);
  if (!result.ok && result.status === 403) {
    return Response.json({ ok: false, error: result.error }, { status: 403 });
  }
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 400 });
  }
  return Response.json(result);
}
