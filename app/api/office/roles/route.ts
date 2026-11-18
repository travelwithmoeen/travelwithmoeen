import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { handleOfficeForm } from "@/lib/http/handle-form";
import { listRolesAs, saveRoleAs } from "@/lib/office/roles";

// T-63 (BR-123 to BR-127): Owner only. The role and its permissions are read on each request, so a
// change applies on each person's next page with no cache to clear beyond these two pages.
export async function GET() {
  try {
    const actor = await requireUser();
    const result = await listRolesAs(actor);
    if (!result.ok) {
      return Response.json({ ok: false, error: result.error }, { status: result.status === 403 ? 403 : 400 });
    }
    return Response.json(result);
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  return handleOfficeForm(request, saveRoleAs, () => {
    revalidatePath("/office/roles");
    revalidatePath("/office/users");
  });
}
