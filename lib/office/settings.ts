import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { SessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/http/result";
import { recordActivity } from "@/lib/office/activity";

// T-62 (BR-118): a name is 1 to 60 characters, counted as a person reads them.
export const NAME_MAX = 60;

// BR-117 and BR-118: every signed-in person can set, change, or clear their own name. Only the
// signed-in person's own row changes: no user id is read from the request.
export async function saveProfileAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  if ([...name].length > NAME_MAX) return { ok: false, error: `A name can be up to ${NAME_MAX} characters.` };
  const stored = name || null;
  await db.transaction(async (tx) => {
    await tx.update(users).set({ name: stored }).where(eq(users.id, actor.id));
    await recordActivity(tx, actor, { kind: "profile", recordId: actor.id, text: "Changed their name" });
  });
  return { ok: true, message: stored ? `Name saved: ${stored}.` : "Name cleared. The office shows your email." };
}
