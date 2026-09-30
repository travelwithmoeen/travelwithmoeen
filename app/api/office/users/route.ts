import { handleOfficeForm } from "@/lib/http/handle-form";
import { createUserFromForm } from "@/lib/office/forms";
import { refreshUsers } from "@/lib/office/refresh";
import { listUsersAs } from "@/lib/office/users";
import { requireUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const actor = await requireUser();
    const result = await listUsersAs(actor);
    return Response.json(result, { status: result.ok ? 200 : 403 });
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  return handleOfficeForm(request, createUserFromForm, () => refreshUsers());
}
