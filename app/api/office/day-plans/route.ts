import { requireUser } from "@/lib/auth/session";
import { handleOfficeForm } from "@/lib/http/handle-form";
import { saveDayPlanAs, loadDayPlansAs } from "@/lib/office/day-plans";

// T-58 (BR-105, BR-111, BR-116): the day plans and hotel-names lines of a rate place.
export async function GET(request: Request) {
  let actor;
  try {
    actor = await requireUser();
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  const place = new URL(request.url).searchParams.get("place");
  const result = await loadDayPlansAs(actor, place);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: "status" in result && result.status === 403 ? 403 : 400 });
  }
  return Response.json(result);
}

export async function POST(request: Request) {
  return handleOfficeForm(request, saveDayPlanAs);
}
