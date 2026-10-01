import { requireUser } from "@/lib/auth/session";
import { logoutFromForm } from "@/lib/office/forms";

export async function POST() {
  let signedIn = true;
  try {
    await requireUser();
  } catch {
    signedIn = false;
  }
  const result = await logoutFromForm();
  if (!signedIn) {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  return Response.json(result);
}
