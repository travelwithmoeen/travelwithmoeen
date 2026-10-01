import { requireUser } from "@/lib/auth/session";
import { logoutFromForm } from "@/lib/office/forms";

export async function POST() {
  try {
    await requireUser();
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  const result = await logoutFromForm();
  return Response.json(result);
}
