import { handleOfficeForm } from "@/lib/http/handle-form";
import { updateRequestStatusFromForm } from "@/lib/office/requests";
import { refreshRequests } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, updateRequestStatusFromForm, () => refreshRequests());
}
