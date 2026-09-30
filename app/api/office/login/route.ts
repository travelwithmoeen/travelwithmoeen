import { loginFromForm } from "@/lib/office/forms";

export async function POST(request: Request) {
  const result = await loginFromForm(await request.formData());
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
