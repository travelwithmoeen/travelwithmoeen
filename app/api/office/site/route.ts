import { handleOfficeForm } from "@/lib/http/handle-form";
import { updateSiteFromForm } from "@/lib/office/forms";
import { refreshSite } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, updateSiteFromForm, () => refreshSite());
}
