import { requireUser } from "@/lib/auth/session";
import { loadQuotePackageAs } from "@/lib/office/quote-package";

// T-61 (BR-109 to BR-116): one saved quote, its package choices, the options offered for its place,
// and the gallery pictures, for the saved quote page. Owner and Manager only.
export async function GET(request: Request, context: RouteContext<"/api/office/quotes/[id]">) {
  let actor;
  try {
    actor = await requireUser();
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  const { id } = await context.params;
  const result = await loadQuotePackageAs(actor, id);
  if (!result.ok) {
    const status = "status" in result && (result.status === 403 || result.status === 404) ? result.status : 400;
    return Response.json({ ok: false, error: result.error }, { status, headers: { "Cache-Control": "no-store" } });
  }
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
