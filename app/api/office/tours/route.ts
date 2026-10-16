import { handleOfficeForm } from "@/lib/http/handle-form";
import { updateTourFromForm } from "@/lib/office/forms";
import { refreshPlace, refreshTour } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, updateTourFromForm, (formData, result) => {
    refreshTour(String(formData.get("id") ?? result.tourIds?.[0] ?? ""));
    refreshPlace("");
  });
}
