import { handleOfficeForm } from "@/lib/http/handle-form";
import { updatePostFromForm } from "@/lib/office/forms";
import { refreshPost } from "@/lib/office/refresh";

export async function POST(request: Request) {
  return handleOfficeForm(request, updatePostFromForm, (formData) => {
    refreshPost(String(formData.get("slug") ?? ""));
  });
}
