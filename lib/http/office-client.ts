import { apiPath } from "@/lib/http/api-path";
import type { ActionResult } from "@/lib/http/result";

export async function postOfficeForm(path: string, formData: FormData): Promise<ActionResult> {
  let response: Response;
  try {
    response = await fetch(apiPath(path), {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  } catch {
    return { ok: false, error: "The office could not be reached." };
  }
  const body = (await response.json().catch(() => null)) as ActionResult | null;
  if (!body || typeof body.ok !== "boolean") {
    return { ok: false, error: "The office could not save that." };
  }
  return body;
}

export function officeFormAction(path: string, goTo?: string) {
  return async (previous: ActionResult | null, formData: FormData): Promise<ActionResult> => {
    const result = await postOfficeForm(path, formData);
    if (result.ok && goTo) window.location.assign(goTo);
    return result;
  };
}
