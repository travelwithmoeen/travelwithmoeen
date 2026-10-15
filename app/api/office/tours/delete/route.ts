import { handleOfficeForm } from "@/lib/http/handle-form";
import { deleteTourFromForm } from "@/lib/office/forms";
import { refreshPlace, refreshTour } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, deleteTourFromForm, (formData) => {
    refreshTour(String(formData.get("id") ?? ""));
    refreshPlace("");
  });
}
