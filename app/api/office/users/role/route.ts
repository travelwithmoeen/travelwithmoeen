import { handleOfficeForm } from "@/lib/http/handle-form";
import { changeRoleFromForm } from "@/lib/office/forms";
import { refreshUsers } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, changeRoleFromForm, () => refreshUsers());
}
