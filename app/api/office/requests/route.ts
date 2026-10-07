import { requireUser } from "@/lib/auth/session";
import { listRequestsAs } from "@/lib/office/requests";

export async function GET() {
  try {
    const actor = await requireUser();
    const result = await listRequestsAs(actor);
    if (!result.ok) {
      return Response.json({ ok: false, error: result.error }, { status: result.status === 403 ? 403 : 400 });
    }
    return Response.json(result);
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
}
