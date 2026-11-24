import { requireUser } from "@/lib/auth/session";
import { handleOfficeForm } from "@/lib/http/handle-form";
import { loadPackageOptionsAs, savePackageOptionAs } from "@/lib/office/package-options";

// T-59 (BR-107, BR-116): the package options.
export async function GET() {
  let actor;
  try {
    actor = await requireUser();
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  const result = await loadPackageOptionsAs(actor);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: "status" in result && result.status === 403 ? 403 : 400 });
  }
  return Response.json(result);
}

export async function POST(request: Request) {
  return handleOfficeForm(request, savePackageOptionAs);
}
