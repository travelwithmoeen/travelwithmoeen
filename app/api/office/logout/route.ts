import { logoutFromForm } from "@/lib/office/forms";

export async function POST() {
  const result = await logoutFromForm();
  return Response.json(result);
}
