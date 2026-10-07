import { handleOfficeForm } from "@/lib/http/handle-form";
import { updatePlaceFromForm } from "@/lib/office/forms";
import { refreshPlace } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, updatePlaceFromForm, (formData) => {
    refreshPlace(String(formData.get("slug") ?? ""));
  });
}
