import { and, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { loginFailures } from "@/lib/db/schema";

const WINDOW_MS = 15 * 60 * 1000;
const FAILURE_LIMIT = 10;

export function signInRefusalLine(email: string, at: Date) {
  return `Sign-in refused for ${email} at ${at.toISOString()}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function loginIsLocked(email: string) {
  const normalized = normalizeEmail(email);
  const since = new Date(Date.now() - WINDOW_MS);
  const rows = await db
    .select({ id: loginFailures.id })
    .from(loginFailures)
    .where(and(eq(loginFailures.email, normalized), gte(loginFailures.failedAt, since)));
  return rows.length >= FAILURE_LIMIT;
}

export async function recordLoginFailure(email: string) {
  const normalized = normalizeEmail(email);
  const failedAt = new Date();
  await db.insert(loginFailures).values({ email: normalized, failedAt });
  console.info(signInRefusalLine(normalized, failedAt));
}

export function logLockedSignIn(email: string) {
  console.info(signInRefusalLine(normalizeEmail(email), new Date()));
}
