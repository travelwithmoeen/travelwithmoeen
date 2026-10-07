import { handleOfficeForm } from "@/lib/http/handle-form";
import { deleteSlideFromForm } from "@/lib/office/forms";
import { refreshHome } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, deleteSlideFromForm, () => refreshHome());
}
