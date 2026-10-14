import { handleOfficeForm } from "@/lib/http/handle-form";
import { createTourFromForm } from "@/lib/office/forms";
import { refreshPlace, refreshTour } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, createTourFromForm, (formData, result) => {
    refreshTour(result.tourIds?.[0] ?? String(formData.get("id") ?? ""));
    refreshPlace("");
  });
}
