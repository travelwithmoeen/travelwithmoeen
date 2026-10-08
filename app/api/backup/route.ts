import { runBackup, scheduleSecretMatches } from "@/lib/office/backup";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!scheduleSecretMatches(request.headers.get("authorization"))) {
    return Response.json({ ok: false, error: "Not allowed." }, { status: 401 });
  }
  const result = await runBackup();
  return Response.json(result, { status: result.ok ? 200 : 500 });
}
