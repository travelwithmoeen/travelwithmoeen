import { handleOfficeForm } from "@/lib/http/handle-form";
import { updateTourFromForm } from "@/lib/office/forms";
import { refreshTour } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, updateTourFromForm, (formData) => {
    refreshTour(String(formData.get("id") ?? ""));
  });
}
