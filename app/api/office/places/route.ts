import { handleOfficeForm } from "@/lib/http/handle-form";
import { updatePlaceFromForm } from "@/lib/office/forms";
import { refreshPlace, refreshTour } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, updatePlaceFromForm, (formData, result) => {
    refreshPlace(String(formData.get("slug") ?? ""));
    for (const id of result.tourIds ?? []) refreshTour(id);
  });
}
