import { handleOfficeForm } from "@/lib/http/handle-form";
import { saveProfileAs } from "@/lib/office/settings";

// T-62 (BR-118): the signed-in person's own name. No session gets 401 from handleOfficeForm.
export async function POST(request: Request) {
  return handleOfficeForm(request, saveProfileAs);
}
