import { handleOfficeForm } from "@/lib/http/handle-form";
import { savePriceFromForm } from "@/lib/office/forms";

export async function POST(request: Request) {
  return handleOfficeForm(request, savePriceFromForm);
}
