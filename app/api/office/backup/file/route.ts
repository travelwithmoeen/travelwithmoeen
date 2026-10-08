import { readBackupAs } from "@/lib/office/backup";
import { requireUser } from "@/lib/auth/session";

export async function GET(request: Request) {
  let actor;
  try {
    actor = await requireUser();
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  const name = new URL(request.url).searchParams.get("name") ?? "";
  const result = await readBackupAs(actor, name);
  if (!result.ok) {
    const status = "status" in result ? 403 : 404;
    return Response.json({ ok: false, error: result.error }, { status });
  }
  const fileName = name.split("/").pop() ?? "backup.json";
  return new Response(result.stream, {
    headers: {
      "content-type": "application/json",
      "content-disposition": `attachment; filename="${fileName}"`,
      "cache-control": "no-store",
    },
  });
}
