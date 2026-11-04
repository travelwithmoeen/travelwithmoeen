import { hasNulText } from "@/lib/http/nul-text";
import { loginFromForm } from "@/lib/office/forms";

export async function POST(request: Request) {
  // A body that is missing, not a form, or holds a NUL character gets the usual refusal (T-54), so a
  // refused sign-in looks the same whatever the cause.
  let formData: FormData | null = null;
  try {
    formData = await request.formData();
  } catch {
    formData = null;
  }
  if (formData && hasNulText(formData)) formData = null;
  const result = await loginFromForm(formData);
  return Response.json(result, { status: result.ok ? 200 : 401 });
}
