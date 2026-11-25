import { requireUser } from "@/lib/auth/session";
import { handleOfficeForm } from "@/lib/http/handle-form";
import { loadPackageSectionsAs, savePackageSectionAs } from "@/lib/office/package-sections";

// T-60 (BR-108, BR-116): the fixed sections of the package document.
export async function GET() {
  let actor;
  try {
    actor = await requireUser();
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  const result = await loadPackageSectionsAs(actor);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: "status" in result && result.status === 403 ? 403 : 400 });
  }
  return Response.json(result);
}

export async function POST(request: Request) {
  return handleOfficeForm(request, savePackageSectionAs);
}
