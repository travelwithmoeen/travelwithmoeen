import { handleOfficeForm } from "@/lib/http/handle-form";
import { deletePhotoFromForm } from "@/lib/office/forms";
import { refreshGallery } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, deletePhotoFromForm, () => refreshGallery());
}
