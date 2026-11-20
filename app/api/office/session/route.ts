import { getCurrentUser } from "@/lib/auth/session";
import { sessionViewOf } from "@/lib/auth/session-view";
import { countNewRequestsAs } from "@/lib/office/requests";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ ok: false }, { status: 401 });
  const newRequestCount = await countNewRequestsAs(user);
  return Response.json({ ok: true, ...sessionViewOf(user), newRequestCount });
}
