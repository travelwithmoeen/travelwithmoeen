import { handleOfficeForm } from "@/lib/http/handle-form";
import { backupAs, listBackupsAs } from "@/lib/office/backup";
import { requireUser } from "@/lib/auth/session";

export const maxDuration = 60;

export async function GET() {
  try {
    const actor = await requireUser();
    const result = await listBackupsAs(actor);
    if (!result.ok) {
      return Response.json({ ok: false, error: result.error }, { status: result.status === 403 ? 403 : 400 });
    }
    return Response.json(result);
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  return handleOfficeForm(request, (actor) => backupAs(actor));
}
