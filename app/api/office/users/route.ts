import { handleOfficeForm } from "@/lib/http/handle-form";
import { createUserFromForm } from "@/lib/office/forms";
import { refreshUsers } from "@/lib/office/refresh";
import { listUsersAs } from "@/lib/office/users";
import { requireUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const actor = await requireUser();
    const result = await listUsersAs(actor);
    if (!result.ok) {
      return Response.json({ ok: false, error: result.error }, { status: result.status === 403 ? 403 : 400 });
    }
    return Response.json(result);
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  return handleOfficeForm(request, createUserFromForm, () => refreshUsers());
}
