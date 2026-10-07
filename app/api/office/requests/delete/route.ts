import { handleOfficeForm } from "@/lib/http/handle-form";
import { deleteRequestFromForm } from "@/lib/office/requests";
import { refreshRequests } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, deleteRequestFromForm, () => refreshRequests());
}
